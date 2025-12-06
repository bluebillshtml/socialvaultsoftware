/**
 * Property-based tests for theme system
 * Feature: social-media-downloader
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../lib/ThemeContext';
import * as fc from 'fast-check';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Test component that uses the theme hook
function TestComponent({ onRender }: { onRender: (theme: string, toggleTheme: () => void, setTheme: (theme: any) => void) => void }) {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  React.useEffect(() => {
    onRender(theme, toggleTheme, setTheme);
  }, [theme, toggleTheme, setTheme, onRender]);
  
  return <div data-testid="theme-value">{theme}</div>;
}

describe('Theme System Property Tests', () => {
  beforeEach(() => {
    localStorageMock.clear();
    document.documentElement.className = '';
    document.body.className = '';
  });

  /**
   * Property 22: System Theme Detection
   * For any system theme preference (light or dark), the app should initialize 
   * with the matching theme on first load.
   * Validates: Requirements 10.1
   */
  test('Property 22: System Theme Detection', () => {
    fc.assert(
      fc.property(fc.boolean(), (isDark) => {
        // Setup: Mock system preference
        localStorageMock.clear();
        (window.matchMedia as jest.Mock).mockImplementation((query) => ({
          matches: query === '(prefers-color-scheme: dark)' ? isDark : !isDark,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
        }));

        let capturedTheme = '';
        
        // Act: Render component
        render(
          <ThemeProvider>
            <TestComponent onRender={(theme) => { capturedTheme = theme; }} />
          </ThemeProvider>
        );

        // Assert: Theme matches system preference
        const expectedTheme = isDark ? 'dark' : 'light';
        return capturedTheme === expectedTheme;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 23: Theme Toggle Correctness
   * For any theme toggle action, the app should switch between light and dark 
   * themes with corresponding color value changes.
   * Validates: Requirements 10.2, 10.3
   */
  test('Property 23: Theme Toggle Correctness', () => {
    fc.assert(
      fc.property(fc.constantFrom('dark', 'light'), (initialTheme) => {
        // Setup: Set initial theme
        localStorageMock.clear();
        localStorageMock.setItem('socialvault-theme', initialTheme);

        let themeBefore = '';
        let themeAfter = '';
        let toggleFn: (() => void) | null = null;

        // Act: Render component
        const { rerender } = render(
          <ThemeProvider>
            <TestComponent onRender={(theme, toggle) => { 
              themeBefore = theme;
              toggleFn = toggle;
            }} />
          </ThemeProvider>
        );

        // Toggle theme
        if (toggleFn) {
          toggleFn();
        }

        // Re-render to capture new theme
        rerender(
          <ThemeProvider>
            <TestComponent onRender={(theme) => { themeAfter = theme; }} />
          </ThemeProvider>
        );

        // Assert: Theme switched to opposite
        const expectedAfter = themeBefore === 'dark' ? 'light' : 'dark';
        const themeChanged = themeAfter === expectedAfter;
        
        // Assert: DOM classes updated
        const hasCorrectClass = 
          (themeAfter === 'dark' && !document.body.classList.contains('light')) ||
          (themeAfter === 'light' && document.body.classList.contains('light'));

        return themeChanged && hasCorrectClass;
      }),
      { numRuns: 100 }
    );
  });

  /**
   * Property 24: Theme Persistence
   * For any theme selection, the preference should persist across app restarts 
   * and be restored on next launch.
   * Validates: Requirements 10.4
   */
  test('Property 24: Theme Persistence', () => {
    fc.assert(
      fc.property(fc.constantFrom('dark', 'light'), (selectedTheme) => {
        // Setup: Clear storage
        localStorageMock.clear();

        let setThemeFn: ((theme: any) => void) | null = null;

        // Act: First render - set theme
        const { unmount } = render(
          <ThemeProvider>
            <TestComponent onRender={(theme, toggle, setTheme) => { 
              setThemeFn = setTheme;
            }} />
          </ThemeProvider>
        );

        if (setThemeFn) {
          setThemeFn(selectedTheme);
        }

        const storedValue = localStorageMock.getItem('socialvault-theme');
        
        // Unmount to simulate app close
        unmount();

        let restoredTheme = '';

        // Act: Second render - simulate app restart
        render(
          <ThemeProvider>
            <TestComponent onRender={(theme) => { restoredTheme = theme; }} />
          </ThemeProvider>
        );

        // Assert: Theme persisted and restored
        const persistedCorrectly = storedValue === selectedTheme;
        const restoredCorrectly = restoredTheme === selectedTheme;

        return persistedCorrectly && restoredCorrectly;
      }),
      { numRuns: 100 }
    );
  });
});
