import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        sand:        '#f2ede7',
        'sand-dark': '#e8ddd2',
        cream:       '#ffffff',
        'brown-deep': '#2c2420',
        'brown-mid':  '#7a6a5a',
        'brown-light':'#9a8a7a',
        gold:        '#c4a882',
        'gold-dark': '#9a7a5a',
        charcoal:    '#1a1210',
        cement:          '#A5A391',
        'cement-dark':   '#8e8c7f',
        concrete:        '#1e1d1c',
        'concrete-deep': '#161514',
      },
      fontFamily: {
        serif: ['var(--font-libre-baskerville)', 'Georgia', 'serif'],
        sans:  ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
