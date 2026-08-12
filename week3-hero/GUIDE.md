# 후킹한 히어로 섹션 만들기 — 실습 가이드

지피터스 디자인 스터디 3주차 · Claude Code + Claude Design

---

## 무엇을 만드나

스크롤 한 번으로 두 가지를 배웁니다.

1. **1784식 히어로** — 배경 영상이 루프로 돌고, 스크롤하는 동안 화면이 고정된 채 텍스트가 변형됩니다
2. **코드잇식 섹션 릴레이** — 아래 섹션마다 *다른 종류의* 모션이 나와 지루할 틈을 주지 않습니다

레퍼런스: [1784.navercorp.com](https://1784.navercorp.com/) · [codeit.kr](https://www.codeit.kr/)

## 이 실습의 핵심 문장

> **JS는 숫자 하나만 넘긴다. 움직임은 전부 CSS가 결정한다.**

스크롤 모션이 어려워 보이는 건 대부분 JS로 다 하려 들기 때문입니다.
우리는 `--progress`라는 0→1 숫자 하나만 JS로 계산해서 넘기고, 나머지는 CSS에 맡깁니다.
이 구조를 잡고 나면 모션을 추가하는 게 CSS 한 줄 쓰는 일이 됩니다.

---

## 준비물

- Claude Code (`npm install -g @anthropic-ai/claude-code`)
- 폴더 하나
- 브라우저

> 라이브러리는 하나도 쓰지 않습니다. GSAP도, jQuery도 없습니다.
> 설치 문제로 실습이 막히는 걸 피하고, 원리를 그대로 보기 위해서입니다.

---

## STEP 1 — 레퍼런스 해부 (Claude Design)

바로 코드를 짜지 않습니다. **무엇을 훔칠지 먼저 정합니다.**

두 사이트를 열고 스크롤하면서 이 질문에만 답해보세요.

- 1784 히어로에서 스크롤할 때 **정확히 무엇이 변하나?** (위치? 크기? 자간? 밝기?)
- 코드잇은 섹션마다 **모션 종류가 어떻게 달라지나?**

여기서 Claude Design으로 히어로 시안을 몇 개 뽑아 비교해보세요.
글자 크기와 여백만 바꿔도 "후킹한 정도"가 크게 달라집니다.

<details>
<summary>💡 관찰 결과 (먼저 직접 보고 나서 펼치세요)</summary>

**1784 히어로** — 스크롤 구간 동안 히어로가 고정되고, 그 사이에 3박자가 일어납니다.
1. 자간이 서서히 벌어진다
2. 타이틀이 커지면서 사라진다
3. 두 번째 문장이 올라온다

**코드잇** — 같은 페이드업을 반복하지 않습니다. 카드 스태거 → 캐러셀 → 채팅 말풍선 → 숫자 카운트업 → 카드 그리드처럼 **계속 다른 걸** 씁니다.
</details>

---

## STEP 2 — 히어로: 영상 + 스크롤 파인

### 2-1. 배경 영상 구하기

[Mixkit](https://mixkit.co/free-stock-video/ink/)에서 어둡고 푸른 톤 클립을 하나 받으세요.
Mixkit은 상업 이용이 가능하고 출처 표기가 필요 없습니다.

**고를 때 기준:**

| 기준 | 이유 |
|---|---|
| 10~20초 | 배경 루프는 짧아도 사용자가 눈치채지 못합니다 |
| 10MB 이하 | 첫 화면 로딩(LCP)이 마케팅 지표에 직결됩니다 |
| 어둡고 대비 낮은 것 | 위에 흰 글씨를 얹어야 합니다 |
| 급격한 장면 전환 없는 것 | 루프 이음새가 티납니다 |

`assets/hero-loop.mp4`로 저장합니다.

### 2-2. 파인의 원리

스크롤 모션의 뼈대는 **CSS 두 줄**입니다.

```css
.hero        { height: 250vh; }            /* 이 높이가 곧 모션 길이 */
.hero__stage { position: sticky; top: 0;
               height: 100vh; }            /* 화면에 붙어 있는 부분 */
```

바깥이 250vh니까 **150vh만큼 스크롤하는 동안 안쪽은 화면에 붙어 있습니다.**
그 150vh가 우리의 타임라인입니다. 높이를 늘리면 모션이 느려지고, 줄이면 빨라집니다.

### 2-3. Claude Code에 넣을 프롬프트

```
히어로 섹션을 만들어줘.

구조:
- 바깥 .hero 는 height 250vh, 안쪽 .hero__stage 는 sticky top:0 / height 100vh
- stage 안에 배경 영상(autoplay muted loop playsinline), 어둡게 덮는 veil, 카피

모션:
- JS는 스크롤 진행률 0→1 을 계산해서 --progress 커스텀 속성으로만 넘길 것
- 실제 변형은 전부 CSS 가 --progress 를 읽어서 계산할 것
- 진행률을 세 구간으로 쪼개서 서로 다른 박자를 줄 것
  0.00~0.45 자간이 벌어진다
  0.35~0.70 타이틀이 커지며 사라진다
  0.68~1.00 두 번째 문장이 올라온다

제약:
- 색·간격·글자크기는 tokens.css 변수만 쓰고 hex 나 px 를 새로 만들지 말 것
- 이징은 --ease-out 만 쓰고 bounce 계열은 절대 쓰지 말 것
```

### 2-4. 구간을 쪼개는 법

이게 이 실습에서 제일 쓸모 있는 조각입니다.

```css
.hero {
  --p:  calc(var(--progress, 0) * var(--motion-scroll));
  --pA: clamp(0, calc(var(--p) / 0.45), 1);           /* 0.00 → 0.45 */
  --pB: clamp(0, calc((var(--p) - 0.35) / 0.35), 1);  /* 0.35 → 0.70 */
  --pC: clamp(0, calc((var(--p) - 0.68) / 0.32), 1);  /* 0.68 → 1.00 */
}
```

전체 진행률 하나를 **구간별 진행률 셋**으로 바꾸는 공식입니다.

```
구간진행률 = clamp(0, (전체진행률 - 시작) / (끝 - 시작), 1)
```

이제 각 구간을 원하는 속성에 꽂기만 하면 됩니다.

```css
.hero__title  { letter-spacing: calc(var(--tracking-tight) + var(--pA) * 0.12em);
                opacity: calc(1 - var(--pB)); }
.hero__second { opacity: var(--pC); }
```

### 2-5. 타이틀을 단어로 쪼개기

1784의 실제 소스를 열어보면 타이틀이 한 덩어리가 아닙니다.

```html
<p class="cover-title__item--title">1784</p>
<p class="cover-title__item">THE</p>
<p class="cover-title__item">TEST</p>
<p class="cover-title__item">BED</p>
```

그리고 각 단어의 **정지 상태**를 재보면 이렇습니다.

| 단어 | opacity | translateX |
|---|---|---|
| THE | 0 | **+364** |
| TEST | 0 | **−364** |
| BED | 0 | **+364** |

화면 밖 **좌우를 번갈아** 출발점으로 잡아뒀다가 순서대로 들어옵니다.

그런데 키프레임 전문을 뜯어보면 더 중요한 게 있습니다. 1784의 `c`와 `d`는 이렇게 생겼습니다.

```
c:  0~50% translateX(-100%) opacity 0   →  70% 중앙  →  100% translateX(+100%) opacity 0
d:  0~50% translateX(+100%) opacity 0   →  70% 중앙  →  100% translateX(-100%) opacity 0
```

**들어오기만 하는 게 아니라 반대쪽으로 통과해 나갑니다.** 왼쪽에서 온 단어는 오른쪽으로 빠지고, 오른쪽에서 온 단어는 왼쪽으로 빠집니다. 들어오고 끝나는 것과 체감이 꽤 다릅니다.

한 요소에 진입·퇴장 `transform`을 동시에 걸 수는 없으니 **층을 나눕니다.**

```html
<span class="word" style="--w:0; --dir:-1"><span class="word__in">THE</span></span>
<span class="word" style="--w:1; --dir:1"><span class="word__in">MUSE</span></span>
```
```css
/* 바깥 — 스크롤이 만드는 퇴장 (반대 방향) */
.hero__title .word {
  display: inline-block;
  transform: translateX(calc(
    var(--dir, 1) * -40vw * var(--pB) * (1 + var(--w, 0) * 0.12)
  ));
}

/* 안쪽 — 로드 직후의 진입 */
.hero__title .word__in {
  display: inline-block;
  opacity: 0;
  transform: translateX(calc(var(--dir, 1) * 28vw));
  animation: word-in var(--duration-cinematic) var(--ease-out) forwards;
  animation-delay: calc(var(--w, 0) * 130ms);
}
@keyframes word-in { to { opacity: 1; transform: translateX(0); } }
```

`--w`는 순서, `--dir`는 방향(−1 왼쪽 / 1 오른쪽). 퇴장 식에 `--dir`를 **음수로** 곱한 게 통과의 전부입니다. `(1 + --w * 0.12)`는 뒷 단어일수록 조금 더 멀리 보내 한 줄로 붙어 움직이지 않게 합니다.

실제로 재보면 이렇게 나옵니다.

| progress | THE `−1` | MUSE `+1` | OF `−1` | LAPIS `+1` |
|---|---|---|---|---|
| 0.0 | 0 | 0 | 0 | 0 |
| 0.5 | +219 | −246 | +272 | −298 |
| 0.7 | +512 | −573 | +635 | −696 |

> 단어가 화면 밖으로 나가도 `.hero__stage`의 `overflow: hidden`이 잘라내므로
> 가로 스크롤바는 생기지 않습니다. 이 한 줄이 없으면 페이지가 옆으로 늘어납니다.

**✅ 여기까지 됐으면:** 페이지를 열면 단어가 좌우에서 번갈아 날아와 자리를 잡고,
스크롤하면 화면이 고정된 채 자간이 벌어지다가 사라지고, 새 문장이 올라옵니다.

---

## STEP 3 — 리빌 엔진과 섹션 두 개

### 3-1. 리빌은 한 번만

모든 섹션이 공유하는 등장 모션을 하나 만듭니다. **IntersectionObserver**로 화면에 들어오면 클래스를 붙이고, 붙인 뒤에는 관찰을 끊습니다.

```js
const io = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add("is-visible");
    io.unobserve(entry.target);      // 다시 접었다 펴면 산만하다
  }
}, { threshold: 0.15, rootMargin: "0px 0px -10% 0px" });
```

### 3-2. 스태거는 CSS 변수로

카드를 하나씩 순서대로 등장시키는 건 JS가 아니라 **인라인 변수 하나**로 충분합니다.

```html
<li data-reveal style="--i:0">
<li data-reveal style="--i:1">
<li data-reveal style="--i:2">
```
```css
[data-reveal] { transition-delay: calc(var(--i, 0) * var(--duration-fast) * 0.6); }
```

### 3-3. 프롬프트

```
공통 리빌 엔진을 만들어줘.
- [data-reveal] 이 붙은 요소가 화면에 들어오면 .is-visible 을 붙이고 관찰 해제
- 스태거는 인라인 --i 변수로 transition-delay 를 계산

그리고 두 섹션에 적용해줘.
- Brand Story: 2단 레이아웃, 이미지와 텍스트가 서로 반대 방향으로 움직이는 패럴랙스
- Notes: 3장 카드가 순서대로 등장, 호버하면 이미지만 살짝 확대
```

**✅ 여기까지 됐으면:** 스크롤을 내리면 섹션이 차례로 떠오르고, 카드 3장이 도미노처럼 등장합니다.

---

## STEP 4 — 임팩트 구간: 가로 핀 스크롤

세로로 스크롤하는데 화면은 옆으로 넘어가는 구간입니다. 사람들이 "오"하는 지점이고, 원리는 히어로와 **완전히 같습니다.**

```css
.collection        { height: 300vh; }                              /* 타임라인 */
.collection__stage { position: sticky; top: 0; height: 100vh;
                     overflow: hidden; }
.collection__track { display: flex; width: 200vw;                  /* 패널 2장 */
                     transform: translateX(calc(var(--p) * -100vw)); }
```

히어로에서는 `--p`를 **투명도와 자간**에 꽂았고, 여기서는 **가로 위치**에 꽂았을 뿐입니다.
진행률 구조를 한 번 만들어두면 이렇게 재활용됩니다.

```
패널 3장으로 늘리려면 → width: 300vw, translateX 는 -200vw
```

**✅ 여기까지 됐으면:** 컬렉션 구간에서 스크롤이 가로 이동으로 바뀝니다.

---

## STEP 4.5 — 앰비언트 루프 (실제로 레퍼런스를 뜯어보고 추가한 단계)

코드잇 소스를 열어보고 나서야 알게 된 게 있습니다. **우리가 만든 건 등장하고 멈춥니다. 코드잇은 등장한 뒤에도 계속 움직입니다.**

코드잇 CSS를 받아서 키프레임을 열어보면, 이건 그냥 "배경이 조금 움직인다"가 아니었습니다.
**한 루프 안에서 여러 요소가 시점을 나눠 쓰는 하나의 장면**입니다.

```
laptop:  0% scale(1)         →  25% scale(1.44)  → 정지
button:  0% opacity 0        →  25% opacity 1 + scale(1.6)
cursor:  0% opacity 0        →  25% translate(-300%,-100%) scale(1.6)
desc:    0~35% opacity 0     →  50% opacity 1
arrow:   0~55% 정지          →  70% translateY(-100%)
```

읽어보면 시나리오가 보입니다. **노트북이 확대되고 → 커서가 버튼으로 이동하며 버튼이 눌리고 → 설명이 뜨고 → 화살표가 올라갑니다.** 제품 사용 장면을 3초마다 반복 재생하는 것이지, 장식용 움직임이 아닙니다.

리빌 종류를 늘리는 것보다 **이게 체감 차이가 훨씬 큽니다.** 화면 어딘가가 항상 조금 움직이면 페이지가 살아 있다고 느껴집니다.

### 롤링 텍스트 — 이음새 없이 무한히

같은 세트를 **두 벌** 넣고 `-50%`까지 미는 게 핵심입니다.

```html
<div class="marquee__track">
  <span class="marquee__set">THE MUSE OF LAPIS ✦ 깊고 푸른 우아함 ✦</span>
  <span class="marquee__set">THE MUSE OF LAPIS ✦ 깊고 푸른 우아함 ✦</span>
</div>
```
```css
.marquee__track { display: flex; width: max-content;
                  animation: roll 38s linear infinite; }
@keyframes roll { to { transform: translateX(-50%); } }
```

트랙 전체의 `-50%`가 정확히 한 세트 너비라, 끝나는 순간이 시작과 같아 끊김이 보이지 않습니다.

### 진폭은 작게

```css
.hero__grad    { animation: breathe 14s var(--ease-in-out) infinite alternate; }
.divider__mark { animation: pulse 6s var(--ease-in-out) infinite alternate; }
@keyframes breathe { to { opacity: 0.8; } }
@keyframes pulse   { to { opacity: 0.4; } }
```

LAPIS는 조용한 럭셔리라 눈에 띄면 실패입니다. **전부 `transform`과 `opacity`만** 건드린다는 점도 중요합니다 — 레이아웃을 다시 계산하지 않아 느려지지 않습니다.

> ⚠️ 코드잇 이징 중에는 `cubic-bezier(0.91, -0.02, 0.84, 1.6)`처럼 1을 넘는 값이 있습니다.
> 되튀는(오버슈트) 움직임이고, LAPIS 규칙이 금지하는 종류라 그대로 가져오지 않았습니다.
> 생동감은 이징이 아니라 **스태거 간격과 주기**로 만듭니다.

---

## STEP 5 — 접근성 점검 (여기서 진짜가 갈립니다)

멋진 모션을 만든 다음이 아니라, **여기서 완성됩니다.**

### 5-1. 왜 duration을 0으로 만드는 걸론 부족한가

많은 사람이 이렇게 끝냅니다.

```css
@media (prefers-reduced-motion: reduce) {
  :root { --duration-base: 1ms; }   /* ❌ 이걸론 스크롤 파인이 안 꺼진다 */
}
```

`--duration-*`은 **transition에만** 효과가 있습니다.
그런데 스크롤 파인은 transition이 아니라 **스크롤 위치에 직접 묶인 변형**입니다. 시간이 아니라 스크롤이 재생하는 거죠. 그래서 저 방법으로는 꿈쩍도 하지 않습니다.

### 5-2. 두 가지를 같이 해야 합니다

**① 값을 얼린다** — 진행률에 곱할 스위치를 만듭니다.

```css
:root { --motion-scroll: 1; }
@media (prefers-reduced-motion: reduce) {
  :root { --motion-scroll: 0; }
}
/* 쓸 때는 항상 곱해서 */
--p: calc(var(--progress, 0) * var(--motion-scroll));
```

**② 구조를 걷어낸다** — 이걸 빠뜨리면 **아무것도 없는 빈 화면을 250vh 스크롤하게 됩니다.**

```css
@media (prefers-reduced-motion: reduce) {
  .hero        { height: auto; }
  .hero__stage { position: static; }
  .collection__track { flex-direction: column; width: 100%; transform: none; }
}
```

### 5-3. 무한 루프는 따로 꺼야 합니다 (STEP 4.5를 넣었다면 필수)

앰비언트 루프에는 `14s`, `38s`처럼 **초를 직접 적었습니다.** 토큰이 아니라 리터럴이라
`--duration-*`을 1ms로 낮춰도 **그대로 계속 돕니다.**

```css
@media (prefers-reduced-motion: reduce) {
  .hero__grad, .divider__mark, .marquee__track { animation: none; }

  /* 끄기만 하면 시작 프레임에 멈춘다 — 최종 상태를 같이 줘야 한다 */
  .hero__title .word { animation: none; opacity: 1; transform: none; }

  /* 흐르지 않는 마퀴는 잘린 문장일 뿐이라 아예 감춘다 */
  .marquee { display: none; }
}
```

마지막 두 줄이 핵심입니다. `animation: none`만 쓰면 **단어가 화면 밖 시작 위치에 opacity 0으로 얼어붙어 영영 안 보입니다.**

### 5-4. 확인하는 법

- **Windows** — 설정 → 접근성 → 시각 효과 → 애니메이션 효과 끄기
- **macOS** — 시스템 설정 → 손쉬운 사용 → 디스플레이 → 동작 줄이기
- **Chrome DevTools** — `Ctrl+Shift+P` → `Emulate CSS prefers-reduced-motion`

**✅ 통과 기준:** 모션을 끈 상태에서 페이지를 끝까지 스크롤했을 때 **빈 구간 없이 모든 내용이 보여야** 합니다.

---

## 마지막 점검표

- [ ] 모션 끈 상태에서 빈 스크롤 구간이 없다
- [ ] 375px 폭에서 가로 스크롤바가 생기지 않는다
- [ ] 영상이 안 떠도 `poster` 이미지로 글씨가 읽힌다
- [ ] hex 색이나 px 글자크기를 새로 만든 곳이 없다
- [ ] bounce 계열 이징을 쓴 곳이 없다
- [ ] 이미지 `alt`가 파일명이 아니라 분위기를 설명한다

---

## 더 해볼 것

- 히어로 `height`를 250vh → 400vh로 바꿔보기 (모션이 느려집니다)
- 구간 경계 `0.45 / 0.35 / 0.68` 숫자를 바꿔 박자 바꿔보기
- 컬렉션 패널을 3장으로 늘려보기
- 진행률을 **가로 위치**가 아니라 **회전이나 blur**에 꽂아보기
