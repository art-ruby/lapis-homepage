/* ─────────────────────────────────────────────────────────────
   LAPIS — Week 3 실습 / 모션 엔진
   이 파일이 하는 일은 딱 세 가지다.
     1. 스크롤 구간의 진행률(0→1)을 --progress 로 넘긴다  ← 히어로·컬렉션·스토리
     2. 화면에 들어온 요소에 .is-visible 을 붙인다        ← 리빌 전부
     3. 스크롤이 내려가면 nav 에 .is-solid 를 붙인다
   "무엇이 어떻게 움직이는가"는 전부 style.css 가 결정한다.
   ───────────────────────────────────────────────────────────── */

const reducedMQ = window.matchMedia("(prefers-reduced-motion: reduce)");

/* OS 가 모션을 줄이라고 했는가.
   기본값은 언제나 OS 를 따른다. 사람이 버튼을 눌러 명시적으로 켤 때만 예외.
   (실습 중에 정작 모션을 못 보는 상황을 막기 위한 장치) */
let forceMotion = false;
const reduced = { get matches() { return reducedMQ.matches && !forceMotion; } };

function syncMotionFlag() {
  const root = document.documentElement;
  root.dataset.motion = forceMotion ? "force" : "auto";
  root.dataset.motionOff = String(reducedMQ.matches && !forceMotion);
}

/* ── 1. 스크롤 진행률 ────────────────────────────────────
   [data-scroll-progress] 가 붙은 섹션이 화면을 지나가는 동안
   0 → 1 로 올라가는 값을 --progress 에 써 넣는다.
   구간 길이 = 섹션 높이 - 화면 높이 (sticky 로 붙어 있는 시간). */
const tracks = [...document.querySelectorAll("[data-scroll-progress]")];

function updateProgress() {
  for (const el of tracks) {
    const rect = el.getBoundingClientRect();
    const distance = rect.height - window.innerHeight;
    // 구간이 화면보다 짧으면(모바일에서 펼쳐진 경우) 진행률 개념이 없다.
    const p = distance <= 0 ? 0 : clamp01(-rect.top / distance);
    el.style.setProperty("--progress", p.toFixed(4));
  }
}

function clamp01(n) {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/* 스크롤 이벤트마다 계산하면 프레임이 밀린다.
   "다음 프레임에 한 번만" 계산하도록 묶어준다. */
let queued = false;
function requestUpdate() {
  if (queued) return;
  queued = true;
  requestAnimationFrame(() => {
    queued = false;
    updateProgress();
    syncNav();
  });
}

/* ── 2. 리빌 ─────────────────────────────────────────────
   한 번 보이면 관찰을 끊는다. 다시 접혔다 펴지는 건 산만하다. */
const revealables = [...document.querySelectorAll("[data-reveal]")];

function setupReveal() {
  if (reduced.matches) {
    revealables.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    },
    // 요소가 살짝 올라온 뒤에 시작해야 자연스럽다.
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );
  revealables.forEach((el) => io.observe(el));
}

/* ── 3. Nav 상태 ─────────────────────────────────────────── */
const nav = document.getElementById("nav");

function syncNav() {
  nav.classList.toggle("is-solid", window.scrollY > window.innerHeight * 0.6);
}

/* 모바일 메뉴 토글 */
const toggle = document.querySelector(".nav__toggle");
const links = document.querySelector(".nav__links");
links.id = "nav-links";

toggle.addEventListener("click", () => {
  const open = links.classList.toggle("is-open");
  toggle.setAttribute("aria-expanded", String(open));
});

/* ── 시작 ────────────────────────────────────────────────
   reduced-motion 이면 스크롤 계산 자체를 돌리지 않는다.
   (style.css 가 이미 sticky 와 높이를 걷어냈다) */
function start() {
  syncMotionFlag();
  setupReveal();
  syncNav();

  if (reduced.matches) return;

  updateProgress();
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate, { passive: true });
}

/* "모션 켜서 보기" — 켠 뒤에는 처음부터 다시 봐야 히어로 진입 모션을 놓치지 않는다 */
document.getElementById("motion-on").addEventListener("click", () => {
  forceMotion = true;
  syncMotionFlag();
  window.scrollTo(0, 0);
  start();
});

start();

/* 사용자가 도중에 설정을 바꾸면 새로고침 없이 반영되도록 */
reducedMQ.addEventListener("change", () => window.location.reload());
