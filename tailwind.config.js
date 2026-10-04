/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'mochi-pink': {
          light: '#FCE7EE',
          DEFAULT: '#F3B8C9',
          dark: '#D86A88',
          deep: '#A33355',
        },
        'mochi-wood': {
          light: '#F0E2D2',
          DEFAULT: '#C79B6E',
          dark: '#9A6A3A',
          deep: '#694119',
        },
        'mochi-lavender': {
          light: '#EEE6F5',
          DEFAULT: '#D9CBE8',
          dark: '#A994C4',
          deep: '#5C4478',
        },
        'mochi-brown': {
          light: '#8B5C5A',
          DEFAULT: '#593432',
          dark: '#3D201E',
          deep: '#261211',
        },
        'mochi-cream': '#FCF9F5',
        'mochi-card': '#FFFFFF',
      },
      fontFamily: {
        display: ['Biski', 'Mitr', 'Prompt', 'sans-serif'],
        sans: ['Prompt', 'Mitr', 'sans-serif'],
      },
      borderRadius: {
        'mochi': '18px',
        'mochi-lg': '24px',
        'mochi-sm': '14px',
      },
      boxShadow: {
        'mochi': '0 8px 24px -4px rgba(89, 52, 50, 0.08), 0 2px 6px -1px rgba(89, 52, 50, 0.04)',
        'mochi-hover': '0 14px 32px -4px rgba(89, 52, 50, 0.12), 0 4px 10px -1px rgba(89, 52, 50, 0.06)',
      }
    },
  },
  plugins: [],
}
