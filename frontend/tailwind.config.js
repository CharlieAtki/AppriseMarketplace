/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        marquee: 'marquee 15s linear infinite', // Custom scrolling animation
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' }, // Starting position
          '100%': { transform: 'translateX(-100%)' }, // End position (scrolling off screen)
        },
      },
    },
  },
  plugins: [],
};
