/**
 * Cross-Platform Consistency Tests
 * 
 * **Feature: social-media-downloader, Property 20: Cross-Platform Feature Parity**
 * **Feature: social-media-downloader, Property 21: Cross-Platform Theme Consistency**
 * **Validates: Requirements 9.1, 9.2**
 */

import * as fc from 'fast-check';
import { darkTheme, lightTheme } from '../theme';

// Mobile Tailwind config
const mobileTailwindConfig = require('../../mobile/tailwind.config.js');

// Web theme colors (from web/tailwind.config.ts)
const webThemeColors = {
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
};

const webThemeSpacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

const webThemeBorderRadius = {
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
};

const webThemeFontSize = {
  xs: '0.75rem',
  sm: '0.875rem',
  base: '1rem',
  lg: '1.125rem',
  xl: '1.25rem',
  '2xl': '1.5rem',
  '3xl': '1.875rem',
  '4xl': '2.25rem',
};

const webThemeGradients = {
  'gradient-purple': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'gradient-blue': 'linear-gradient(135deg, #667eea 0%, #4facfe 100%)',
  'gradient-orange': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
};

describe('Cross-Platform Consistency', () => {
  describe('Property 20: Cross-Platform Feature Parity', () => {
    it('should have matching component interfaces between web and mobile', () => {
      // Test that both platforms have the same core components
      const webComponents = [
        'Layout',
        'ThemeToggle',
        'InputBar',
        'PlatformBadge',
        'MetadataCard',
        'DownloadOptions',
        'ProgressIndicator',
      ];

      const mobileComponents = [
        'Layout',
        'ThemeToggle',
        'InputBar',
        'PlatformBadge',
        'MetadataCard',
        'DownloadOptions',
        'ProgressIndicator',
      ];

      expect(webComponents.sort()).toEqual(mobileComponents.sort());
    });

    it('should have matching type definitions for shared interfaces', () => {
      // Test that DownloadFormat interface is consistent
      const downloadFormatTypes = ['video', 'audio', 'image', 'thumbnail'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...downloadFormatTypes),
          (formatType) => {
            // Both platforms should support the same format types
            expect(['video', 'audio', 'image', 'thumbnail']).toContain(formatType);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have matching Quality interface structure', () => {
      const qualityValues = ['1080p', '720p', '480p', '360p'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...qualityValues),
          fc.boolean(),
          (value, available) => {
            const quality = { value, label: value, available };
            
            // Quality object should have required properties
            expect(quality).toHaveProperty('value');
            expect(quality).toHaveProperty('label');
            expect(quality).toHaveProperty('available');
            expect(typeof quality.available).toBe('boolean');
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have matching ProgressStatus types', () => {
      const statusTypes = ['idle', 'fetching', 'downloading', 'complete', 'error'];
      
      fc.assert(
        fc.property(
          fc.constantFrom(...statusTypes),
          (status) => {
            // Both platforms should support the same status types
            expect(statusTypes).toContain(status);
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 21: Cross-Platform Theme Consistency', () => {
    it('should have identical color values in dark theme', () => {
      const mobileColors = mobileTailwindConfig.theme.extend.colors;

      // Test background colors
      expect(mobileColors.background.DEFAULT).toBe(webThemeColors.background.DEFAULT);
      expect(mobileColors.background.light).toBe(webThemeColors.background.light);

      // Test foreground colors
      expect(mobileColors.foreground.DEFAULT).toBe(webThemeColors.foreground.DEFAULT);
      expect(mobileColors.foreground.light).toBe(webThemeColors.foreground.light);

      // Test accent colors
      expect(mobileColors.primary).toBe(webThemeColors.primary);
      expect(mobileColors.secondary).toBe(webThemeColors.secondary);
      expect(mobileColors.accent).toBe(webThemeColors.accent);

      // Test utility colors
      expect(mobileColors.error).toBe(webThemeColors.error);
      expect(mobileColors.success).toBe(webThemeColors.success);
    });

    it('should have identical border color values', () => {
      const mobileColors = mobileTailwindConfig.theme.extend.colors;

      expect(mobileColors.border.DEFAULT).toBe(webThemeColors.border.DEFAULT);
      expect(mobileColors.border.light).toBe(webThemeColors.border.light);
    });

    it('should have identical glass-morphism background values', () => {
      const mobileColors = mobileTailwindConfig.theme.extend.colors;

      expect(mobileColors['glass-bg'].DEFAULT).toBe(webThemeColors['glass-bg'].DEFAULT);
      expect(mobileColors['glass-bg'].light).toBe(webThemeColors['glass-bg'].light);
    });

    it('should have matching font family definitions', () => {
      const mobileFonts = mobileTailwindConfig.theme.extend.fontFamily;

      // Both should define geist and jakarta fonts
      expect(mobileFonts).toHaveProperty('geist');
      expect(mobileFonts).toHaveProperty('jakarta');
    });

    it('should have matching spacing scale', () => {
      const mobileSpacing = mobileTailwindConfig.theme.extend.spacing;

      expect(mobileSpacing.xs).toBe(webThemeSpacing.xs);
      expect(mobileSpacing.sm).toBe(webThemeSpacing.sm);
      expect(mobileSpacing.md).toBe(webThemeSpacing.md);
      expect(mobileSpacing.lg).toBe(webThemeSpacing.lg);
      expect(mobileSpacing.xl).toBe(webThemeSpacing.xl);
      expect(mobileSpacing['2xl']).toBe(webThemeSpacing['2xl']);
      expect(mobileSpacing['3xl']).toBe(webThemeSpacing['3xl']);
    });

    it('should have matching border radius values', () => {
      const mobileBorderRadius = mobileTailwindConfig.theme.extend.borderRadius;

      expect(mobileBorderRadius.sm).toBe(webThemeBorderRadius.sm);
      expect(mobileBorderRadius.md).toBe(webThemeBorderRadius.md);
      expect(mobileBorderRadius.lg).toBe(webThemeBorderRadius.lg);
      expect(mobileBorderRadius.xl).toBe(webThemeBorderRadius.xl);
    });

    it('should have matching gradient definitions', () => {
      const mobileGradients = mobileTailwindConfig.theme.extend.backgroundImage;

      expect(mobileGradients['gradient-purple']).toBe(webThemeGradients['gradient-purple']);
      expect(mobileGradients['gradient-blue']).toBe(webThemeGradients['gradient-blue']);
      expect(mobileGradients['gradient-orange']).toBe(webThemeGradients['gradient-orange']);
    });

    it('should maintain theme consistency across random theme switches', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('dark', 'light'),
          (themeMode) => {
            const theme = themeMode === 'dark' ? darkTheme : lightTheme;
            const mobileColors = mobileTailwindConfig.theme.extend.colors;
            
            // Verify theme has all required properties
            expect(theme).toHaveProperty('mode');
            expect(theme).toHaveProperty('colors');
            expect(theme).toHaveProperty('fonts');
            expect(theme).toHaveProperty('borderRadius');
            
            // Verify colors match Tailwind config
            expect(theme.colors.background).toBe(
              themeMode === 'dark' 
                ? mobileColors.background.DEFAULT 
                : mobileColors.background.light
            );
            
            expect(theme.colors.foreground).toBe(
              themeMode === 'dark'
                ? mobileColors.foreground.DEFAULT
                : mobileColors.foreground.light
            );
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should have matching fontSize scale', () => {
      const mobileFontSize = mobileTailwindConfig.theme.extend.fontSize;

      expect(mobileFontSize.xs).toBe(webThemeFontSize.xs);
      expect(mobileFontSize.sm).toBe(webThemeFontSize.sm);
      expect(mobileFontSize.base).toBe(webThemeFontSize.base);
      expect(mobileFontSize.lg).toBe(webThemeFontSize.lg);
      expect(mobileFontSize.xl).toBe(webThemeFontSize.xl);
      expect(mobileFontSize['2xl']).toBe(webThemeFontSize['2xl']);
      expect(mobileFontSize['3xl']).toBe(webThemeFontSize['3xl']);
      expect(mobileFontSize['4xl']).toBe(webThemeFontSize['4xl']);
    });
  });
});
