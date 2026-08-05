# LAPIS — Project Context for Claude Code

This file is read automatically at the start of every Claude Code session in this
repository. Follow it before writing any UI code.

## What this project is

LAPIS is a premium perfume brand ("The Muse of Lapis" campaign). This repo builds
the brand homepage: a one-page, scroll-driven site (Hero → Brand Story → Notes →
Collection → Philosophy → Contact).

Full brand rationale, reference-site analysis, and the complete design spec live in
`LAPIS_Design_System.md` (same folder as this file). Read it once per session if
you need the "why" behind a decision (color ratio rules, motion rules,
accessibility rules, Do & Don't table). This CLAUDE.md is the "how" — the
operational rules.

> Note: this folder currently holds the design assets flat (`LAPIS_Design_System.md`,
> `index.html`, `tokens.css`, `tailwind.config.js`, `design-tokens.json`, `images/`).
> When you scaffold the actual Next.js app, move the static prototype into
> `prototypes/index.html`, the spec into `docs/LAPIS_Design_System.md`, and the
> token files into the app's own `styles/` / root config — update the paths below
> to match once that reorganization happens.

## Recommended stack

- Next.js (App Router) + TypeScript
- Tailwind CSS, configured from `tailwind.config.js` in this repo (already wired to
  the brand tokens — do not add ad-hoc colors to it without checking
  `docs/LAPIS_Design_System.md` §3–§6 first)
- `styles/tokens.css` holds the same tokens as CSS custom properties, for anything
  Tailwind utilities can't express cleanly (gradients, custom easing curves)
- `design-tokens.json` is the machine-readable source of truth if you need to
  generate Figma tokens, a style dictionary, or feed values into a script

## Hard rules — do not violate

1. **Never hardcode a hex color, px font-size, or px spacing value in a component.**
   Use the Tailwind theme keys (`bg-lapis-deep`, `text-gold-light`, `text-h1`,
   `p-30`, etc.) or the CSS variables in `tokens.css`. If a value you need doesn't
   exist yet, add it to `tailwind.config.js` / `tokens.css` / `design-tokens.json`
   together, not just inline in the component.
2. **Gold is an accent, not a background.** It should never cover more than ~5% of
   a viewport's area. If a component ends up with a large gold fill, stop and flag
   it instead of shipping it.
3. **No bounce / elastic / spring easing, ever.** Only `ease-lapis-out` /
   `ease-lapis-in-out` (see `tailwind.config.js` → `transitionTimingFunction`).
4. **Korean text is never italicized.** Use letter-spacing or `text-gold-light` for
   emphasis instead.
5. **One h1-equivalent per section, one CTA style per context.** Primary CTA is
   always an outlined button that inverts on hover — never a filled gradient
   button from the start.
6. **Respect `prefers-reduced-motion`.** Any scroll-reveal / parallax / hover-scale
   effect needs a reduced-motion fallback (see `tokens.css` bottom block).
7. **Every image needs a mood-descriptive alt, not a literal one.** ("깊고 푸른 조명 아래
   옆모습을 보이는 여성" style, not "woman.jpg").

## Component build order

Build components in this order — each depends on tokens/utilities from the one
before it existing:

1. `Nav` — transparent → solid-on-scroll, collapses to icon under 820px
2. `Divider` — gradient line + ✦ motif, reused between every section
3. `Hero`
4. `BrandStory` (text + image, 2-col on desktop)
5. `NoteCard` / `NotesGrid` (top/heart/base)
6. `LineCard` / `Collection` (LAPIS / LUNA)
7. `PhilosophyGrid` (3-col)
8. `NewsletterForm`
9. `Footer`

Full spec for each of these is in `docs/LAPIS_Design_System.md` §7 (Components).

## Reference implementation

`prototypes/index.html` in this repo is a static HTML/CSS/JS build of the full
one-pager using these exact tokens. Treat it as the visual reference when porting
sections into React components — the interactions (scroll fade-up, nav
scroll-state, card hover) should behave identically after the port.

## When something isn't covered here

Check `docs/LAPIS_Design_System.md` first (it has Grid, Responsive Rules, and
Accessibility sections in full detail). If it's genuinely not covered, default to
the closest existing pattern rather than inventing a new one, and ask before
introducing a new component type.
