/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <- this enables class-based dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      animation: {
        gradientShift: "gradientShift 12s ease infinite", // ✅ Gradient animation
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundSize: {
        '400': '400% 400%', // Needed for smooth animated gradients
      },
    },
  },
  plugins: [],
};
