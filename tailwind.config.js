/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bebas: ['"Bebas Neue"', 'sans-serif'], // 👈 add this
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
