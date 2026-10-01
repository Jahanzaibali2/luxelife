import type { Config } from 'tailwindcss'

// Editorial palette: white page, flat gray image backdrops, near-black ink,
// hairline borders and one muted stone accent. Legacy token names are kept so
// existing classes pick up the new look without markup changes.
const ink = '#1A1A1A'
const muted = '#6B6B6B'
const backdrop = '#EDEDEB'
const hairline = '#E4E4E1'
const accent = '#8C7B6B'
const white = '#FFFFFF'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        short: { raw: '(max-height: 700px)' },
        tall: { raw: '(min-height: 900px)' },
      },
      colors: {
        accent,
        hairline,
        ink,
        backdrop,

        primary: ink,
        'on-primary': white,
        'primary-container': ink,
        'on-primary-container': '#A3A3A0',
        'primary-fixed': backdrop,
        'primary-fixed-dim': '#D6D6D3',
        'on-primary-fixed': ink,
        'on-primary-fixed-variant': '#3A3A3A',
        'inverse-primary': '#D6D6D3',

        secondary: muted,
        'on-secondary': white,
        'secondary-container': backdrop,
        'on-secondary-container': muted,
        'secondary-fixed': backdrop,
        'secondary-fixed-dim': '#C9C9C6',
        'on-secondary-fixed': ink,
        'on-secondary-fixed-variant': '#4A4A4A',

        tertiary: ink,
        'on-tertiary': white,
        'tertiary-container': '#2A2A2A',
        'on-tertiary-container': '#A3A3A0',
        'tertiary-fixed': backdrop,
        'tertiary-fixed-dim': '#D6D6D3',
        'on-tertiary-fixed': ink,
        'on-tertiary-fixed-variant': '#4A4A4A',

        background: white,
        'on-background': ink,
        surface: white,
        'surface-bright': white,
        'surface-dim': '#E6E6E3',
        'surface-tint': ink,
        'surface-variant': backdrop,
        'surface-container-lowest': white,
        'surface-container-low': '#F5F5F3',
        'surface-container': backdrop,
        'surface-container-high': '#E8E8E5',
        'surface-container-highest': '#E3E3E0',
        'on-surface': ink,
        'on-surface-variant': muted,
        'inverse-surface': ink,
        'inverse-on-surface': '#F5F5F3',

        outline: '#9A9A96',
        'outline-variant': hairline,

        error: '#B3261E',
        'on-error': white,
        'error-container': '#F9DEDC',
        'on-error-container': '#8C1D18',

        'warm-ivory': white,
        'brand-bg': white,
        'soft-blush': accent,
        'charcoal-grey': ink,
        'deep-cocoa': ink,
      },
      borderRadius: {
        DEFAULT: '0',
        sm: '0',
        md: '2px',
        lg: '2px',
        xl: '4px',
        '2xl': '4px',
      },
      spacing: {
        'margin-mobile': '20px',
        'margin-desktop': '64px',
        gutter: '24px',
        'section-gap': 'clamp(3rem, 10vw, 10rem)',
        'container-max': '1360px',
        unit: '8px',
      },
      maxWidth: {
        'container-max': '1360px',
      },
      fontFamily: {
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        'display-lg': ['"Instrument Serif"', 'Georgia', 'serif'],
        'headline-lg': ['"Instrument Serif"', 'Georgia', 'serif'],
        'headline-lg-mobile': ['"Instrument Serif"', 'Georgia', 'serif'],
        'headline-md': ['"Instrument Serif"', 'Georgia', 'serif'],
        'body-lg': ['Inter', 'system-ui', 'sans-serif'],
        'body-md': ['Inter', 'system-ui', 'sans-serif'],
        'label-sm': ['Inter', 'system-ui', 'sans-serif'],
        'label-caps': ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': [
          'clamp(2.5rem, 6vw, 5rem)',
          { lineHeight: '1.02', letterSpacing: '-0.015em', fontWeight: '400' },
        ],
        'headline-lg': [
          'clamp(2rem, 4vw, 3.25rem)',
          { lineHeight: '1.08', letterSpacing: '-0.01em', fontWeight: '400' },
        ],
        'headline-lg-mobile': ['2rem', { lineHeight: '1.1', fontWeight: '400' }],
        'headline-md': ['1.625rem', { lineHeight: '1.2', fontWeight: '400' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.65', fontWeight: '400' }],
        'body-md': ['0.9375rem', { lineHeight: '1.6', fontWeight: '400' }],
        'label-sm': ['0.8125rem', { lineHeight: '1.4', fontWeight: '400' }],
        'label-caps': [
          '0.6875rem',
          { lineHeight: '1rem', letterSpacing: '0.14em', fontWeight: '500' },
        ],
        button: ['0.875rem', { lineHeight: '1.25rem', fontWeight: '500' }],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
} satisfies Config
