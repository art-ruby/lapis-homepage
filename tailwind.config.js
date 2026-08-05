// LAPIS — tailwind.config.js
// Source of truth for these values: design-tokens.json / LAPIS_Design_System.md
// Do not hardcode hex colors or px values in components — always use these theme keys.

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        lapis: {
          deep: '#0A1A3C',
          mid: '#1E3A6E',
        },
        black: '#050508',
        offwhite: '#F5F3EE',
        gold: {
          DEFAULT: '#C9A24B',
          light: '#E8D4A0',
          deep: '#8A6A1F',
        },
        state: {
          error: '#B5654F',
          success: '#6F8F73',
        },
      },
      fontFamily: {
        'serif-en': ['"Playfair Display"', 'serif'],
        'script-en': ['"Cormorant Garamond"', 'serif'],
        'serif-kr': ['"Noto Serif KR"', 'serif'],
        'sans-kr': ['"Pretendard Variable"', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        display: ['clamp(52px, 10vw, 120px)', { lineHeight: '1', letterSpacing: '0.18em' }],
        h1: ['clamp(28px, 3.4vw, 42px)', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        h2: ['clamp(22px, 2.2vw, 28px)', { lineHeight: '1.5', letterSpacing: '0.02em' }],
        eyebrow: ['clamp(15px, 1.4vw, 18px)', { letterSpacing: '0.08em' }],
        body: ['15.5px', { lineHeight: '2' }],
        caption: ['12.5px', { letterSpacing: '0.1em' }],
      },
      spacing: {
        13: '3.25rem', // 52px, extra step for card padding if needed
        18: '4.5rem',  // 72px, mobile section padding
        30: '7.5rem',  // 120px, desktop section padding
        35: '8.75rem', // 140px
      },
      maxWidth: {
        container: '1280px',
      },
      screens: {
        tablet: '600px',
        desktop: '1024px',
        wide: '1440px',
      },
      transitionTimingFunction: {
        'lapis-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'lapis-in-out': 'cubic-bezier(0.65, 0, 0.35, 1)',
      },
      transitionDuration: {
        fast: '200ms',
        base: '400ms',
        slow: '800ms',
        cinematic: '1200ms',
      },
      letterSpacing: {
        tight: '0.02em',
        base: '0.08em',
        wide: '0.18em',
      },
    },
  },
  plugins: [],
};
