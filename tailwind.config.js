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
        gradientShift: "gradientShift 12s ease-in-out infinite", // ✅ Smooth gradient animation
      },
      keyframes: {
        gradientShift: {
          '0%': { backgroundColor: '#001f3f' },
          '50%': { backgroundColor: '#004080' },
          '100%': { backgroundColor: '#001f3f' },
        },
      },
      backgroundSize: {
        '400': '400% 400%', // Needed for smooth animated gradients
      },
      colors: {
        primary: "#1e3a8a",     // blue-800
        secondary: "#10b981",   // green-500
        danger: "#dc2626",      // red-600
      },
    },
  },
  plugins: [],
};
