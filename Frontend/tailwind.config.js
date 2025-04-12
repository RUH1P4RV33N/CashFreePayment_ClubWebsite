/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        script: ['Dancing Script', 'cursive'],
        inter: ['Inter', 'sans-serif'],
        serif: ['PT Serif', 'serif'],
        pixel: ['"Press Start 2P"', 'monospace'],
      },
      animation: {
        fade: 'fadeOut 1s ease-in-out forwards 3s', // fades after 3s
      },
      keyframes: {
        fadeOut: {
          '0%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
    },
  },
  plugins: [],
}
