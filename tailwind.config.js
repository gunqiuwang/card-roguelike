/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4863D',
        secondary: '#2F5D3A',
        danger: '#C45C4A',
        bg: '#1A1A2E',
        surface: '#16213E',
        card: '#0F3460',
        gold: '#E9B872',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [],
}