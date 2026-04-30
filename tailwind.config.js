/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary - 朱砂红
        primary: '#C4483E',
        'primary-light': '#E06B5A',
        'primary-dark': '#8B3029',

        // Background - 宣纸色
        bg: '#F5EDE0',
        'bg-light': '#FAF6EE',
        'bg-dark': '#E8DFD0',

        // Surface - 牛皮纸
        surface: '#D4C4A8',
        'surface-light': '#E5D9C3',
        'surface-dark': '#B8A88C',

        // Card - 素描纸
        'card-bg': '#FDF8F0',
        'card-border': '#8B7355',

        // Ink - 墨色
        ink: '#2D2926',
        'ink-light': '#4A4541',
        'ink-muted': '#7A746D',

        // Seal - 印章朱砂
        seal: '#C4483E',
        'seal-light': '#D66B5A',

        // Gold
        gold: '#C9A227',
        'gold-light': '#E5C04D',

        // UI
        energy: '#4A7C9B',
        health: '#C45C4A',
        block: '#5C8A4A',

        // Schools
        'school-zhanyao': '#8B3029',
        'school-yuling': '#2D4A5C',
        'school-fushu': '#4A5C2D',

        // Rarity
        'rarity-starter': '#8B7355',
        'rarity-common': '#4A7C9B',
        'rarity-rare': '#9B4DCA',
      },
      borderRadius: {
        sm: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
      },
      fontFamily: {
        heading: 'Georgia, "Times New Roman", "Noto Serif SC", serif',
        card: 'Georgia, serif',
        chinese: '"Noto Serif SC", "STSong", serif',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(45, 41, 38, 0.15)',
        'card-hover': '0 8px 24px rgba(45, 41, 38, 0.25)',
        'seal': '0 2px 8px rgba(196, 72, 62, 0.3)',
        'paper': '0 2px 4px rgba(45, 41, 38, 0.1)',
      },
    },
  },
  plugins: [],
}