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
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          light: 'var(--color-surface-light)',
          dark: 'var(--color-surface-dark)',
        },
        foreground: {
          DEFAULT: 'var(--color-foreground)',
          light: 'var(--color-foreground-light)',
          dark: 'var(--color-foreground-dark)',
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
