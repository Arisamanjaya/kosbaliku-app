/** @type {import('tailwindcss/types').Config} */
const config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e9eef3',
          100: '#bbc9d8',
          200: '#9bafc6',
          300: '#6d8bab',
          400: '#51759b',
          500: '#255282',
          600: '#224b76',
          700: '#1a3a5c',
          800: '#142d48',
          900: '#102237',
        },
        secondary: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        }
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = config;
