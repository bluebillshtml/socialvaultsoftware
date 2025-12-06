/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark theme colors (default)
        background: {
          DEFAULT: '#05040A',
          light: '#FFFFFF',
        },
        foreground: {
          DEFAULT: '#FFFFFF',
          light: '#05040A',
        },
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#4facfe',
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.1)',
          light: 'rgba(5, 4, 10, 0.1)',
        },
        error: '#f5576c',
        success: '#10b981',
        'glass-bg': {
          DEFAULT: 'rgba(255, 255, 255, 0.05)',
          light: 'rgba(5, 4, 10, 0.05)',
        },
      },
      fontFamily: {
        geist: ['Geist', 'sans-serif'],
        jakarta: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      spacing: {
        xs: '0.25rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
      },
      backgroundImage: {
        'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-blue': 'linear-gradient(135deg, #667eea 0%, #4facfe 100%)',
        'gradient-orange': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      },
    },
  },
  plugins: [],
};
