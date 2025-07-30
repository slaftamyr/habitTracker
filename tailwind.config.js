/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media', // Uses system preference
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        glass: 'rgba(255,255,255,0.3)',
        'glass-dark': 'rgba(36,37,41,0.4)',
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(31, 38, 135, 0.15)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
