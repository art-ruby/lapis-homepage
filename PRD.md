# LAPIS Homepage — PRD (Product Requirements Document)

Companion doc to `LAPIS_Design_System.md`. That file defines *how it should look and feel*;
this file defines *what gets built, for whom, and in what order*.

---

## 1. Overview

| 항목 | 내용 |
|---|---|
| 프로젝트명 | LAPIS Brand Homepage |
| 캠페인명 | The Muse of Lapis |
| 유형 | 원페이지, 스크롤 기반 브랜드 사이트 (이커머스 아님) |
| 목적 | 향수 브랜드 LAPIS의 세계관과 제품을 감성적으로 소개. 실 판매 기능은 범위 밖(옵션) |
| 성격 | 개인 과제 / 포트폴리오용 프로토타입 — 실제 커머스 트래픽 대응 불필요 |

---

## 2. Goals & Success Metrics

**목표**
- 브랜드 인지도 형성: "Quiet Luxury × 미드나잇 블루 × 웜 골드"라는 톤을 스크롤 경험만으로 전달
- 디자인 시스템(`LAPIS_Design_System.md`) 준수도 100% — 하드코딩된 컬러/폰트/스페이싱 없음
- 포트폴리오/과제 제출 기준 충족: 재현 가능한 코드 구조, 문서화, 접근성 기본기

**성공 지표 (정성적 + 정량적)**

| 지표 | 기준 |
|---|---|
| Lighthouse Performance | 90+ (모바일 기준) |
| Lighthouse Accessibility | 90+ |
| 반응형 대응 | mobile(< 600) / tablet / desktop / wide 4구간 모두 레이아웃 깨짐 없음 |
| 모션 접근성 | `prefers-reduced-motion` 대응 100% |
| 디자인 토큰 준수 | 컴포넌트 내 하드코딩된 hex/px 값 0건 |

---

## 3. Target Audience

- **주 타겟**: 절제된 고급감과 조용한 존재감을 선호하는 20대 후반–30대 초반 여성
- **성향**: 화려한 광고보다 무드와 디테일로 설득되는 "quiet luxury" 소비층. 프리미엄 라이프스타일에 관심 있고, 브랜드 스토리·헤리티지를 소비 근거로 삼음
- **디바이스**: 모바일 우선 소비(SNS 유입 가정) — 반응형 우선순위는 mobile → desktop 순

---

## 4. Scope

**In scope**
- 6개 섹션 원페이지: Hero → Brand Story → Notes(Composition) → Collection → Philosophy → Contact
- 반응형 레이아웃 (mobile/tablet/desktop/wide)
- 스크롤 기반 인터랙션(fade-up, 내비 상태 변화, 카드 호버)
- 뉴스레터 구독 폼(UI + 클라이언트 목업, 실제 저장은 P2)
- 디자인 시스템 기반 토큰 적용(Tailwind + CSS 변수)

**Out of scope (이번 라운드에서 제외)**
- 실제 결제/구매 플로우
- 로그인/회원가입, 마이페이지
- CMS 연동(콘텐츠는 코드에 하드코딩된 카피 기준)
- 전체 다국어 완전 번역(선택 시 토글 UI만 P1 범위)

---

## 5. Information Architecture

```
LAPIS (1-page)
├── 01 Hero            — 브랜드명, 태그라인, 가격, CTA
├── 02 Brand Story      — "왜 라피스인가" 텍스트 + 이미지
├── 03 Notes            — 탑/미들/베이스 노트 3카드
├── 04 Collection       — LAPIS / LUNA 라인업 카드
├── 05 Philosophy       — 헤리티지 · 장인정신 · 지속가능성 3열
└── 06 Contact          — 뉴스레터 구독 + 푸터
```

내비게이션은 각 섹션 앵커로 스크롤 이동, 모바일에서는 820px 미만 시 메뉴 아이콘으로 축소.

---

## 6. Functional Requirements (섹션별)

### 6.1 Hero
- 풀스크린(`100dvh`) 배경 이미지/그라디언트 오버레이
- 브랜드명(대형 타이포), 영문 서브(Eau de Parfum), 국문 타이틀, 태그라인, 가격, CTA 버튼
- CTA 클릭 시 `#collection`으로 스무스 스크롤
- 스크롤 유도 인디케이터(scroll cue) 노출

### 6.2 Brand Story
- 2컬럼(데스크톱) / 1컬럼(모바일) 레이아웃: 텍스트 + 우측 비주얼
- 텍스트는 브랜드 철학(라피스 라줄리, 한복 실루엣, quiet luxury) 반영. 기본은 한 줄 요약 +
  "더 보기" 아코디언으로 전체 문단 노출, 펼친 안쪽 끝에 한 줄 감각 프롬프트("당신의 조용한
  순간은?") — 저장 없이 즉시 반응만 주는 에페메럴 인터랙션
- 우측 비주얼은 인물 사진이 아니라 브랜드 톤(딥블루+골드, ✦ 모티프) 추상 패널(`.abstract-panel`).
  진입 시 fade-up 애니메이션(1회성)은 텍스트/비주얼 동일 적용

### 6.3 Notes (Composition)
- 3카드 그리드(탑/미들/베이스), 데스크톱 가로 배치 / 모바일 세로 스택
- 카드 호버 시 배경·텍스트 컬러 반전(다크 전환)
- 카드 콘텐츠: 순번(eyebrow), 영문명, 국문명, 원료 리스트

### 6.4 Collection
- LAPIS / LUNA 2개 라인 카드. LAPIS는 제품 실사 풀블리드 + 하단 그라디언트 정보 오버레이,
  LUNA는 인물/실사 대신 동일 톤의 추상 패널(`.abstract-panel.compact`) — 아직 공개 전 라인이라
  실사가 없기도 하고, 벤치마킹 방지 원칙과도 맞음
- 호버 시 이미지 스케일업(1.06배, 1.2s) — 추상 패널은 스케일 대신 밝기(brightness) 상승으로 동일한
  호버 피드백 제공
- LUNA는 "Coming Soon" 상태 배지 노출(가격 미표기)

### 6.5 Philosophy
- 3열(데스크톱) / 1열(모바일) 그리드
- 각 항목: 로마 숫자 넘버 + 소제목 + 본문(헤리티지/장인정신/지속가능성)

### 6.6 Contact
- 이메일 입력 + 구독 버튼(언더라인 스타일 폼)
- 제출 시 클라이언트 사이드 인라인 메시지 노출(P0), 실제 저장은 Supabase 연동(P2)
- 푸터: 로고, 섹션 앵커 링크, 카피라이트

---

## 7. Non-Functional Requirements

| 영역 | 요구사항 |
|---|---|
| 성능 | 이미지 WebP/AVIF 변환 및 lazy-loading, 히어로 이미지만 eager 로드 |
| 접근성 | WCAG AA 대비, 키보드 내비게이션, alt 텍스트 전 이미지 필수, `prefers-reduced-motion` 대응 |
| SEO | 시맨틱 HTML(section/h1-h2 계층), OG 메타 태그, 브랜드명 타이틀/디스크립션 |
| 반응형 | mobile(<600) / tablet(600–1023) / desktop(1024–1439) / wide(≥1440) 4구간 |
| 국제화(P1) | 한/영 토글 UI, 문자열은 처음부터 분리된 콘텐츠 객체로 관리(하드코딩 금지) |
| 브라우저 지원 | 최신 Chrome/Safari/Edge 2개 버전, IE 미지원 |

---

## 8. Priority (P0 / P1 / P2)

| 우선순위 | 항목 |
|---|---|
| **P0** | 반응형 레이아웃, 스크롤 인터랙션(fade-up, 내비 상태), 이미지 최적화, 디자인 토큰 적용 |
| **P1** | 다국어(한/영) 토글, 노트 구성 인터랙티브 다이어그램(호버 외 클릭 상세 등) |
| **P2** | Supabase 연동 — 뉴스레터 구독/문의 폼 실제 저장, 관리자 조회 |

P0가 없으면 배포하지 않는다. P1/P2는 시간이 남을 때 순서대로 추가한다.

---

## 9. Tech Stack & Architecture

- **프레임워크**: Next.js (App Router) + TypeScript
- **스타일링**: Tailwind CSS(`tailwind.config.js`) + `tokens.css`(CSS 변수, Tailwind로 표현 어려운 그라디언트/이징용)
- **데이터(P2, 선택)**: Supabase — 뉴스레터 구독 테이블 1개로 충분(스키마: email, created_at)
- **배포**: Vercel
- **현재 상태**: 정적 HTML/CSS/JS 프로토타입(`index.html`) 완성 — 이를 Next.js 컴포넌트로 포팅하는 단계가 다음 작업

---

## 10. Content & Asset Requirements

- **카피**: 섹션당 1문장 원칙(디자인 시스템 §2 참조). 국문 우선, 영문은 P1에서 별도 문자열 세트로 작성
- **이미지**: 제품 컷 1종(사파이어 블루 병)만 실사 자산 사용. **인물(뮤즈) 모델 이미지는 벤치마킹 방지를 위해 사이트에 노출하지 않는다** — Brand Story·Collection(LUNA) 자리는 브랜드 톤(딥블루+골드, ✦ 모티프)만으로 구성한 추상 패널로 대체(§6.2, §6.4 참고). 실제 인물 촬영 자산은 필요 시에도 공개 저장소/배포본에는 포함하지 않는다.
- **폰트**: Playfair Display / Cormorant Garamond / Noto Serif KR / Pretendard (Google Fonts + jsDelivr CDN)
- **아이콘**: 커스텀 별(✦) 모티프 외 라인 아이콘 최소 사용

---

## 11. Related Documents

- `LAPIS_Design_System.md` — 브랜드 철학, 컬러/타이포/스페이싱/모션/접근성 전체 스펙
- `design-tokens.json` — 머신 리더블 토큰
- `tailwind.config.js`, `tokens.css` — 코드 레벨 토큰
- `CLAUDE.md` — Claude Code 작업 규칙 및 컴포넌트 빌드 순서
- `index.html` — 현재 완성된 정적 프로토타입(포팅 기준 레퍼런스)

---

## 12. Open Questions

- [ ] LUNA 라인 실제 출시 정보/가격이 확정되면 "Coming Soon" 배지 교체 필요
- [ ] 다국어(P1) 진행 시 영문 카피를 별도로 작성할지, 국문 카피의 직역으로 갈지 톤 결정 필요
- [ ] Supabase 연동(P2) 여부는 과제 제출 범위에 포함되는지 확인 필요 — 미포함 시 폼은 UI 목업으로 종료
