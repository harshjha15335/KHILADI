/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        royal: {
          pink: '#E81274',
          'pink-bright': '#F52391',
          navy: '#101B4B',
          blue: '#203A8C',
          purple: '#29134F',
          dark: '#080C1F',
          card: '#0E132A',
          border: 'rgba(232, 18, 116, 0.2)',
          white: '#F7F4FA',
          gold: '#D6AF60',
          volt: '#D4FF00',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
