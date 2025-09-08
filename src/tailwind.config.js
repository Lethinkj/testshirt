module.exports = {
  content: ['./src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        black: '#000000',
        white: '#FFFFFF',
        gray: {
          100: '#F5F5F5',
          300: '#D3D3D3',
          500: '#A1A1A1',
        },
        red: {
          500: '#FF0000',
          700: '#CC0000',
        },
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        'open-sans': ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};