/** @type {import('tailwindcss').Config} */
// Color palette is locked in docs/ART_BIBLE.md §二
// Any color change MUST update ART_BIBLE.md first.
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 锚定七色（docs/ART_BIBLE.md）
        ink: {
          DEFAULT: '#0F0E0C',
          soft: '#1A1815',
          deep: '#050504',
        },
        parchment: {
          DEFAULT: '#C9B890',
          light: '#E0D2AB',
          dark: '#9D8F6F',
        },
        vermillion: {
          DEFAULT: '#B23A2A',
          light: '#D15040',
          dark: '#8B2A1E',
        },
        ember: {
          DEFAULT: '#C4551B',
          glow: '#E08A48',
        },
        jade: {
          DEFAULT: '#4A5D4A',
        },
        bone: {
          DEFAULT: '#A68C5B',
          light: '#D4B87A',
        },
        mist: {
          DEFAULT: '#6B6259',
        },
      },
      fontFamily: {
        heading: ['"Ma Shan Zheng"', '"STKaiti"', '"KaiTi"', 'cursive'],
        body: ['"Noto Serif SC"', '"Source Han Serif SC"', '"STSong"', 'serif'],
        numeric: ['Cinzel', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        paper: '0 2px 8px rgba(0, 0, 0, 0.4)',
        card: '0 4px 16px rgba(0, 0, 0, 0.5)',
        'card-hover': '0 12px 32px rgba(0, 0, 0, 0.7), 0 0 20px rgba(196, 85, 27, 0.2)',
        seal: '0 0 12px rgba(178, 58, 42, 0.5)',
      },
      transitionTimingFunction: {
        snap: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
  },
  plugins: [],
};
