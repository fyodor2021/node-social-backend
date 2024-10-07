/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily:{
        sans:['Poppins', 'sans-serif']
      },
      screens: {
        'sm': '600px',
        'md': {'max':'900px'},
        'xl': '1200px',
        '2xl': '1520px',
        '3xl': '1775px'
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

