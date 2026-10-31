/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        chess: {
          bg: '#312e2b',
          sidebar: '#262522',
          panel: '#21201d',
          card: '#272522',
          border: '#363431',
          hover: '#3a3835',
          green: '#81b64c',
          greenHover: '#a3d160',
          greenActive: '#6b9a3e',
          text: '#ffffff',
          muted: '#c3c2c1',
          dim: '#8b8987',
          accent: '#5c8bb0',
          yellow: '#e69e2c',
          red: '#fa412d',
          cyan: '#1baca6',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'system-ui',
          'Helvetica',
          'Arial',
          'sans-serif',
        ],
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
