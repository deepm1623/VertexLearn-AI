/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#182230',
        muted: '#667085',
        brand: '#635bff',
      },
      boxShadow: {
        soft: '0 8px 30px rgba(16, 24, 40, 0.06)',
      },
    },
  },
  plugins: [],
}
