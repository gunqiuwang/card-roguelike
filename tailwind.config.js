/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - Warm Gold (magical accent)
        primary: '#D4863D',
        'primary-light': '#E9A84D',
        'primary-dark': '#A66A2E',

        // Background - Deep Purple/Black (castle dungeon)
        bg: '#1A1128',
        'bg-light': '#251A38',
        'bg-dark': '#0D0915',

        // Surface - Slightly lighter for panels
        surface: '#2D1F42',
        'surface-light': '#3D2A55',
        'surface-dark': '#1E142E',

        // Card - Parchment
        'card-bg': '#F5E6D3',
        'card-border': '#8B7355',

        // Accent - Wine Red
        accent: '#9B2D5A',
        'accent-light': '#C4456E',
        'accent-dark': '#6B1E3D',

        // Gold
        gold: '#E9B872',

        // Rarity
        'rarity-starter': '#8B7355',
        'rarity-common': '#4A7C9B',
        'rarity-rare': '#9B4DCA',

        // Type colors
        'type-attack': '#C44536',
        'type-defense': '#4A7C9B',
        'type-heal': '#4A9B5C',

        // UI elements
        energy: '#F5D76E',
        health: '#E74C3C',
        block: '#5C9CEC',

        // Enemy intent
        'intent-attack': '#E74C3C',
        'intent-charge': '#9B59B6',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      fontFamily: {
        heading: 'Georgia, "Times New Roman", serif',
        card: 'Georgia, serif',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0,0,0,0.4)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.5), 0 0 30px rgba(212, 134, 61, 0.3)',
        'glow': '0 0 20px rgba(212, 134, 61, 0.3)',
        'glow-strong': '0 0 30px rgba(212, 134, 61, 0.5)',
      },
    },
  },
  plugins: [],
}