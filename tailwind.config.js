/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50:  '#f0f7f0',
          100: '#d8edd8',
          200: '#b4d9b4',
          300: '#84bf84',
          400: '#52a052',
          500: '#2e7d2e',
          600: '#1B5E1B',
          700: '#154815',
          800: '#0f320f',
          900: '#0a220a',
        },
        sage: {
          50:  '#f6faf4',
          100: '#e8f4e4',
          200: '#cce5c4',
          300: '#a2cf96',
          400: '#70b360',
          500: '#52B788',
          600: '#3d9e70',
          700: '#2e7a54',
          800: '#265f42',
          900: '#1e4d35',
        },
        cream: {
          50:  '#FAFAF5',
          100: '#F5F0E8',
          200: '#EDE5D4',
          300: '#DDD4C0',
          400: '#C8BA9E',
          500: '#A89880',
        },
        earth: {
          500: '#5C4033',
          600: '#4A3228',
          700: '#3A2620',
        },
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        body: ['var(--font-outfit)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'card': '0 2px 16px rgba(27, 94, 27, 0.08)',
        'card-hover': '0 8px 32px rgba(27, 94, 27, 0.15)',
        'modal': '0 24px 80px rgba(0, 0, 0, 0.2)',
      },
    },
  },
  plugins: [],
};
