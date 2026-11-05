/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: 'rgb(var(--paper) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        ink: 'rgb(var(--ink) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        accent: 'rgb(var(--accent) / <alpha-value>)',
        'accent-ink': 'rgb(var(--accent-ink) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        invert: 'rgb(var(--invert) / <alpha-value>)',
        'invert-ink': 'rgb(var(--invert-ink) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'Liberation Mono', 'monospace'],
      },
      fontSize: {
        label: ['0.6875rem', { lineHeight: '1.2' }],
        micro: ['0.625rem', { lineHeight: '1.4' }],
      },
      letterSpacing: {
        label: '0.12em',
        display: '-0.04em',
      },
      maxWidth: {
        shell: '1180px',
      },
      borderRadius: {
        xs: '2px',
        sm: '3px',
      },
      transitionDuration: {
        DEFAULT: '120ms',
      },
    },
  },
  plugins: [],
};
