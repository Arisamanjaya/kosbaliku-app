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
          50: '#F8E9E8',
          100: '#EABCB8',
          200: '#E09C96',
          300: '#D16E66',
          400: '#C95248',
          500: '#BB271A',
          600: '#AA2318',
          700: '#851C12',
          800: '#67150E',
          900: '#4F100B',
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
