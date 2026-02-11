/** @type {import('tailwindcss').Config} */

// CSS variable color with opacity support (function pattern)
function color(varName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgb(var(${varName}) / ${opacityValue})`
    }
    return `rgb(var(${varName}))`
  }
}

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
          DEFAULT: color('--color-primary'),
          light: color('--color-primary-light'),
          dark: color('--color-primary-dark'),
        },
        accent: {
          DEFAULT: color('--color-accent'),
          light: color('--color-accent-light'),
          dark: color('--color-accent-dark'),
        },
        surface: {
          DEFAULT: color('--color-surface'),
          light: color('--color-surface-light'),
          dark: color('--color-surface-dark'),
        },
        foreground: {
          DEFAULT: color('--color-foreground'),
          light: color('--color-foreground-light'),
          dark: color('--color-foreground-dark'),
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
