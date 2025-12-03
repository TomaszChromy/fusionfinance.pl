/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Dark Theme
        'bg-primary': '#08090c',
        'bg-secondary': '#0f1115',
        'bg-tertiary': '#15181e',
        'bg-card': '#1a1d24',
        'bg-elevated': '#1f232b',
        // Gold & Premium Accents
        gold: {
          primary: '#c9a962',
          light: '#e4d4a5',
          dark: '#9a7b3c',
          glow: 'rgba(201, 169, 98, 0.15)',
        },
        // Text Hierarchy
        'text-primary': '#f4f4f5',
        'text-secondary': '#a1a1aa',
        'text-muted': '#71717a',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      spacing: {
        // Fibonacci spacing
        '1': '0.0625rem',
        '2': '0.125rem',
        '3': '0.1875rem',
        '5': '0.3125rem',
        '8': '0.5rem',
        '13': '0.8125rem',
        '21': '1.3125rem',
        '34': '2.125rem',
        '55': '3.4375rem',
        '89': '5.5625rem',
      },
      borderColor: {
        subtle: 'rgba(255, 255, 255, 0.06)',
        default: 'rgba(255, 255, 255, 0.1)',
        gold: 'rgba(201, 169, 98, 0.3)',
      },
    },
  },
  plugins: [],
}

