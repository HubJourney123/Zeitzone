/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        emerald: {
          deep: '#065f46',
          DEFAULT: '#059669',
          light: '#10b981',
        },
      },
    },
  },
  plugins: [],
}
