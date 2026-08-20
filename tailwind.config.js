/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        finance: {
          green: '#10b981', // emerald-500
          red: '#f43f5e', // rose-500
          bg: '#f9fafb', // gray-50
          card: '#ffffff',
          text: '#111827', // gray-900
          muted: '#6b7280', // gray-500
          border: '#e5e7eb' // gray-200
        }
      }
    },
  },
  plugins: [],
}
