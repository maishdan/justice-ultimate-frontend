/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // ✅ Enables dark mode using class strategy
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
<<<<<<< HEAD
    //require('@tailwindcss/line-clamp'),
=======
    require('@tailwindcss/line-clamp'),
>>>>>>> 8202cd886166243aae7d13ab04e8ede3607ebf1c
  ],
}
