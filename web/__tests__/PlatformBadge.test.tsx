/**
 * Property-Based Tests for PlatformBadge Component
 * Feature: social-media-downloader
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import PlatformBadge from '../components/PlatformBadge';
import { Platform } from '@/../../shared/types';

/**
 * Property 3: Platform Badge Rendering
 * Validates: Requirements 1.3
 * 
 * For any identified platform, the rendered UI should contain a platform badge component 
 * with the correct platform identifier.
 */
describe('Property 3: Platform Badge Rendering', () => {
  // Generator for valid platforms
  const platformArbitrary = fc.constantFrom<Platform>(
    'youtube',
    'instagram',
    'tiktok',
    'pinterest',
    'twitter',
    'facebook',
    'reddit',
    'linkedin',
    'unknown'
  );

  it('should render a badge for any valid platform', () => {
    fc.assert(
      fc.property(platformArbitrary, (platform) => {
        const { container, unmount } = render(
          <PlatformBadge platform={platform} animated={false} />
        );

        // The badge should be rendered in the DOM
        const badge = container.querySelector('.inline-flex');
        expect(badge).toBeInTheDocument();

        // The badge should contain platform-specific content
        expect(badge).not.toBeEmptyDOMElement();

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should display the correct platform name for any platform', () => {
    fc.assert(
      fc.property(platformArbitrary, (platform) => {
        const { container, unmount } = render(
          <PlatformBadge platform={platform} animated={false} />
        );

        // Map platforms to their expected display names
        const platformNames: Record<Platform, string> = {
          youtube: 'YouTube',
          instagram: 'Instagram',
          tiktok: 'TikTok',
          pinterest: 'Pinterest',
          twitter: 'X (Twitter)',
          facebook: 'Facebook',
          reddit: 'Reddit',
          linkedin: 'LinkedIn',
          unknown: 'Unknown',
        };

        const expectedName = platformNames[platform];
        const badge = container.querySelector('.inline-flex');
        
        // The badge should contain the platform name
        expect(badge?.textContent).toContain(expectedName);

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should include an icon for any platform', () => {
    fc.assert(
      fc.property(platformArbitrary, (platform) => {
        const { container, unmount } = render(
          <PlatformBadge platform={platform} animated={false} />
        );

        // The badge should contain an SVG icon (lucide-react renders SVGs)
        const icon = container.querySelector('svg');
        expect(icon).toBeInTheDocument();

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should have platform-specific styling for any platform', () => {
    fc.assert(
      fc.property(platformArbitrary, (platform) => {
        const { container, unmount } = render(
          <PlatformBadge platform={platform} animated={false} />
        );

        const badge = container.querySelector('.inline-flex');
        
        // The badge should have inline styles (backgroundColor and borderColor)
        expect(badge).toHaveAttribute('style');
        const style = badge?.getAttribute('style');
        expect(style).toContain('background-color');
        expect(style).toContain('border-color');

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
