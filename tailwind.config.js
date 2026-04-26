/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2D4A6F',
          50: '#E8EDF3',
          100: '#D1DBE7',
          200: '#A3B7CF',
          300: '#7593B7',
          400: '#476F9F',
          500: '#2D4A6F',
          600: '#243C59',
          700: '#1B2E43',
          800: '#12202D',
          900: '#091217',
        },
        secondary: {
          DEFAULT: '#5B8C5A',
          50: '#EDF3ED',
          100: '#DBE7DB',
          200: '#B7CFB7',
          300: '#93B793',
          400: '#6F9F6F',
          500: '#5B8C5A',
          600: '#477046',
          700: '#335433',
          800: '#203820',
          900: '#0C1C0C',
        },
        accent: {
          DEFAULT: '#C9A227',
          50: '#FAF5E6',
          100: '#F5EBCD',
          200: '#EBD79B',
          300: '#E1C369',
          400: '#D7AF37',
          500: '#C9A227',
          600: '#A1821F',
          700: '#796117',
          800: '#51410F',
          900: '#282008',
        },
        surface: '#FFFFFF',
        background: '#FAFAFA',
        border: '#E5E7EB',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Source Sans Pro', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
        'elevated': '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
}
