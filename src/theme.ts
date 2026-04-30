// UI Theme Design Tokens - Q版暗黑童话风格
// Dark Fantasy / Castle / Magical Contract Cards

export const theme = {
  // Color Palette
  colors: {
    // Primary - Warm Gold (magical accent)
    primary: '#D4863D',
    primaryLight: '#E9A84D',
    primaryDark: '#A66A2E',

    // Background - Deep Purple/Black (castle dungeon)
    bg: '#1A1128',
    bgLight: '#251A38',
    bgDark: '#0D0915',

    // Surface - Slightly lighter for panels
    surface: '#2D1F42',
    surfaceLight: '#3D2A55',
    surfaceDark: '#1E142E',

    // Card backgrounds - Parchment/Light
    cardBg: '#F5E6D3',
    cardBorder: '#8B7355',

    // Accent - Wine Red (magical energy)
    accent: '#9B2D5A',
    accentLight: '#C4456E',
    accentDark: '#6B1E3D',

    // Text colors
    textLight: '#F5E6D3',
    textMuted: '#A89B8C',
    textDark: '#2D1F42',

    // Rarity colors
    rarityStarter: '#8B7355',
    rarityCommon: '#4A7C9B',
    rarityRare: '#9B4DCA',

    // Type colors
    typeAttack: '#C44536',
    typeDefense: '#4A7C9B',
    typeHeal: '#4A9B5C',

    // UI elements
    gold: '#E9B872',
    energy: '#F5D76E',
    health: '#E74C3C',
    block: '#5C9CEC',

    // Enemy intent
    intentAttack: '#E74C3C',
    intentCharge: '#9B59B6',
  },

  // Typography
  fonts: {
    heading: 'Georgia, "Times New Roman", serif',
    body: '"Segoe UI", system-ui, -apple-system, sans-serif',
    card: 'Georgia, serif',
  },

  // Spacing
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },

  // Border radius
  radius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 2px 4px rgba(0,0,0,0.3)',
    md: '0 4px 8px rgba(0,0,0,0.4)',
    lg: '0 8px 16px rgba(0,0,0,0.5)',
    glow: '0 0 20px rgba(212, 134, 61, 0.3)',
    cardGlow: '0 0 15px rgba(212, 134, 61, 0.4)',
  },

  // Animation
  animation: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
} as const;

export type Theme = typeof theme;