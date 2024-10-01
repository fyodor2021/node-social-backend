/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily:{
        sans:['Poppins', 'sans-serif']
      },
      screens: {
        'xl': '1200px',
        '2xl': '1520px',
      },
      container: {
        center: false, 
        padding: '0rem',
      },
    },
  },
  important: true,
  plugins: [],
}

