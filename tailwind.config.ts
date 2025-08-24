import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        flows: {
          teal: '#00E0FF',
          purple: '#8A2EFF',
          ink: '#0A0A0B',
          slate: '#111218'
        }
      }
    },
  },
  plugins: [],
} satisfies Config
