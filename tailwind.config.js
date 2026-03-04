/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4a90a4',
          light: '#6ba3b5',
          dark: '#3a7285',
        },
        accent: {
          DEFAULT: '#d4af37',
          light: '#e6c55a',
          dark: '#b8941f',
        },
        surface: {
          DEFAULT: '#f9fafb',
          light: '#ffffff',
          dark: '#e5e7eb',
        },
        foreground: {
          DEFAULT: '#8b7355',
          light: '#a08968',
          dark: '#73604a',
        },
      },
      fontFamily: {
        'display': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'mobile-xs': '0.5rem',
        'mobile-sm': '1rem',
        'mobile-md': '1.5rem',
        'mobile-lg': '2rem',
        'mobile-xl': '3rem',
        'touch': '44px',
        'touch-comfortable': '48px',
      },
      maxWidth: {
        'mobile': '100%',
        'tablet': '768px',
        'desktop': '1200px',
        'site': '1400px',
      },
    },
  },
  plugins: [],
};
