/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html','./src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily:{
        sans:['Poppins', 'sans-serif']
      },
      screens: {
        'sm': {'max':'600px'},
        'md': {'max':'900px'},
        'mdh': {'max-height':'900px'},
        'xl': {'max':'1300px'},
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

