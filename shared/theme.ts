import { ThemeConfig, ThemeMode } from './types';

/**
 * Dark theme configuration matching reference design
 * Background: #05040A, Borders: white/10
 */
export const darkTheme: ThemeConfig = {
  mode: 'dark',
  colors: {
    background: '#05040A',
    foreground: '#FFFFFF',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4facfe',
    border: 'rgba(255, 255, 255, 0.1)',
    error: '#f5576c',
    success: '#10b981',
  },
  fonts: {
    primary: 'Geist',
    secondary: 'Plus Jakarta Sans',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
};

/**
 * Light theme configuration
 */
export const lightTheme: ThemeConfig = {
  mode: 'light',
  colors: {
    background: '#FFFFFF',
    foreground: '#05040A',
    primary: '#667eea',
    secondary: '#764ba2',
    accent: '#4facfe',
    border: 'rgba(5, 4, 10, 0.1)',
    error: '#f5576c',
    success: '#10b981',
  },
  fonts: {
    primary: 'Geist',
    secondary: 'Plus Jakarta Sans',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
  },
};

/**
 * Get theme configuration by mode
 */
export function getTheme(mode: ThemeMode): ThemeConfig {
  return mode === 'dark' ? darkTheme : lightTheme;
}

/**
 * Spacing scale following design system
 */
export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
};

/**
 * Typography scale
 */
export const typography = {
  fontSizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.75',
  },
};
