import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: { sans: ['var(--font-geist)', 'sans-serif'] },
      colors: {
        black: { DEFAULT: '#0c0c0b', 2: '#111110', 3: '#1a1a18' },
        cream: { DEFAULT: '#f0ede6', 2: '#c8c5be', 3: '#6b6960' },
        saffron: { DEFAULT: '#d4a843' },
      },
    },
  },
  plugins: [],
}
export default config
