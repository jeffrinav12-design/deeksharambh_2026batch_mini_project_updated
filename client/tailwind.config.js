/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          light: '#2a36b1',
          DEFAULT: '#1a237e', // Deep Navy Blue
          dark: '#0f154e',
          deep: '#0a0d30'
        },
        gold: {
          light: '#ffea73',
          DEFAULT: '#FFD700', // Gold accent
          dark: '#cda800'
        }
      },
      fontFamily: {
        serif: ['Times New Roman', 'Times', 'serif'],
        sans: ['Outfit', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
