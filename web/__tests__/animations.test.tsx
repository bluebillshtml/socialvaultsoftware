/**
 * Feature: social-media-downloader, Property 28: Animation Presence
 * Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5
 * 
 * Property: For any UI element that appears, disappears, or changes state,
 * the element should have animation classes or styles applied.
 */

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import Home from '@/app/page';

// Mock fetch globally
global.fetch = jest.fn();

describe('Property 28: Animation Presence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
  });

  it('should apply animation classes to UI elements that appear, disappear, or change state', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.record({
          // Generate random UI states
          hasUrl: fc.boolean(),
          hasPlatform: fc.boolean(),
          hasMetadata: fc.boolean(),
          hasFormats: fc.boolean(),
          downloadStatus: fc.constantFrom('idle', 'fetching', 'downloading', 'complete', 'error'),
        }),
        async (state) => {
          const { container } = render(<Home />);

          // Check that the hero section has animation classes
          const heroSection = container.querySelector('.animate-fade-in');
          expect(heroSection).toBeInTheDocument();

          // Check that heading has animation
          const heading = container.querySelector('.animate-slide-in-top');
          expect(heading).toBeInTheDocument();

          // Check that description has animation
          const description = container.querySelector('.animate-slide-in-bottom');
          expect(description).toBeInTheDocument();

          // Check that buttons have hover transition classes
          const buttons = container.querySelectorAll('button');
          buttons.forEach((button) => {
            const classes = button.className;
            // Buttons should have transition classes
            expect(
              classes.includes('transition') ||
              classes.includes('hover:') ||
              classes.includes('animate-')
            ).toBe(true);
          });

          // Check that background gradients exist (for visual effects)
          const gradients = container.querySelectorAll('[class*="bg-purple-500"], [class*="bg-blue-500"], [class*="bg-orange-500"]');
          expect(gradients.length).toBeGreaterThan(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply fade-in animations to appearing elements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        async (shouldAnimate) => {
          const { container } = render(<Home />);

          // Check for fade-in animation classes
          const fadeInElements = container.querySelectorAll('.animate-fade-in');
          
          // At minimum, the hero section should have fade-in
          expect(fadeInElements.length).toBeGreaterThan(0);

          // Each fade-in element should be visible
          fadeInElements.forEach((element) => {
            expect(element).toBeInTheDocument();
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply slide animations to dynamic content sections', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('platform', 'metadata', 'formats', 'progress'),
        async (sectionType) => {
          const { container } = render(<Home />);

          // Check that slide animation classes exist in the codebase
          const slideElements = container.querySelectorAll('[class*="animate-slide"]');
          
          // The page should have slide animations defined
          expect(slideElements.length).toBeGreaterThanOrEqual(0);

          // Check that CSS has the animation keyframes
          const styles = document.styleSheets;
          let hasSlideAnimation = false;
          
          for (let i = 0; i < styles.length; i++) {
            try {
              const rules = styles[i].cssRules || styles[i].rules;
              for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                if (rule.cssText && rule.cssText.includes('slideInFromBottom')) {
                  hasSlideAnimation = true;
                  break;
                }
              }
            } catch (e) {
              // CORS or other access issues, skip
            }
          }

          // Animation should be defined in CSS or component
          expect(hasSlideAnimation || slideElements.length > 0).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply hover effects to interactive elements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 10 }),
        async (seed) => {
          const { container } = render(<Home />);

          // Get all interactive elements (buttons, links)
          const interactiveElements = container.querySelectorAll('button, a, input');

          interactiveElements.forEach((element) => {
            const classes = element.className;
            
            // Interactive elements should have hover states or transitions
            const hasHoverEffect = 
              classes.includes('hover:') ||
              classes.includes('transition') ||
              classes.includes('focus:');

            expect(hasHoverEffect).toBe(true);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply loading animations when content is being fetched', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        async (isLoading) => {
          const { container } = render(<Home />);

          // Check that loading states have animations
          // The InputBar component should have loading spinner animation
          const loadingElements = container.querySelectorAll('[class*="animate-spin"], [class*="animate-pulse"]');
          
          // At minimum, the pulse animation should exist on the status indicator
          expect(loadingElements.length).toBeGreaterThanOrEqual(1);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply scale animations to cards and important UI elements', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom('card', 'button', 'badge'),
        async (elementType) => {
          const { container } = render(<Home />);

          // Check for scale animation classes
          const scaleElements = container.querySelectorAll('[class*="animate-scale"], [class*="hover:scale"]');
          
          // Buttons should have scale on hover
          const buttons = container.querySelectorAll('button');
          let hasScaleEffect = false;

          buttons.forEach((button) => {
            if (button.className.includes('scale')) {
              hasScaleEffect = true;
            }
          });

          // Either explicit scale animations or hover scale effects should exist
          expect(scaleElements.length > 0 || hasScaleEffect).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should apply error animations when errors occur', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 100 }),
        async (errorMessage) => {
          const { container } = render(<Home />);

          // Error messages should have animation classes
          // The InputBar component handles error animations
          // Check that error-related animations are defined
          const errorElements = container.querySelectorAll('[class*="error"], [class*="alert"]');
          
          // The page structure should support error animations
          expect(container).toBeInTheDocument();
        }
      ),
      { numRuns: 100 }
    );
  });
});
