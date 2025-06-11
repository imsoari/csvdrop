/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'csv-orange': {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Base orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        'csv-gradient': {
          start: '#f97316', // Start of gradient (orange)
          end: '#c2410c',   // End of gradient (darker orange)
        },
      },
      backgroundImage: {
        'csv-gradient': 'linear-gradient(135deg, #f97316 0%, #c2410c 100%)',
      },
    },
  },
  plugins: [],
};
