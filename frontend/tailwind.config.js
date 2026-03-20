/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1B4F72',
          dark: '#154360',
          light: '#2980B9',
        },
        gold: {
          DEFAULT: '#F39C12',
          light: '#F8C471',
        },
        dark: '#0D1B2A',
        'gray-soft': '#F0F4F8',
        'text-main': '#1A1A2E',
        'text-muted': '#5D6D7E',
        success: '#16A34A',
        warning: '#D97706',
        danger: '#DC2626',
        slate: {
          900: '#1E293B',
        }
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
}
