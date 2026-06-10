/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cinema: {
          dark: '#0A0A0A',
          navy: '#14141F',
          deep: '#1A1A2E',
          mid: '#0F3460',
          red: '#E50914',
          'red-dark': '#B20710',
          'red-glow': '#FF1A1A',
        },
      },
      fontFamily: {
        cinema: ['Cinzel', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      animation: {
        'grain': 'grain 0.5s steps(4) infinite',
        'flicker': 'flicker 3s infinite',
      },
      keyframes: {
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-2px, 2px)' },
          '50%': { transform: 'translate(2px, -2px)' },
          '75%': { transform: 'translate(-2px, -2px)' },
        },
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
}
