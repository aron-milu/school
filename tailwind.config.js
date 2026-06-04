/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#1E90FF',
          50: '#EBF5FF',
          100: '#D6EBFF',
          200: '#ADD6FF',
          300: '#85C2FF',
          400: '#5CADFF',
          500: '#1E90FF',
          600: '#1a7dd9',
          700: '#1569b3',
          800: '#10568d',
          900: '#0a4267',
        },
      },
    },
  },
  plugins: [],
};
