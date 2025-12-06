/**
 * Property-Based Tests for MetadataCard Component
 * Feature: social-media-downloader
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import MetadataCard from '../components/MetadataCard';
import { Platform } from '@/../../shared/types';

/**
 * Property 6: Metadata Display Completeness
 * Validates: Requirements 3.5
 * 
 * For any metadata object, the rendered preview card should display all metadata fields 
 * present in the object.
 */
describe('Property 6: Metadata Display Completeness', () => {
  // Generator for valid platforms
  const platformArbitrary = fc.constantFrom<Platform>(
    'youtube',
    'instagram',
    'tiktok',
    'pinterest',
    'twitter',
    'facebook',
    'reddit',
    'linkedin'
  );

  // Generator for non-whitespace strings
  const nonWhitespaceString = (minLength: number, maxLength: number) =>
    fc.string({ minLength, maxLength }).filter(s => s.trim().length > 0);

  // Generator for metadata
  const metadataArbitrary = fc.record({
    title: nonWhitespaceString(1, 200),
    thumbnail: fc.webUrl(),
    author: nonWhitespaceString(1, 100),
    duration: fc.option(nonWhitespaceString(1, 20), { nil: undefined }),
    platform: platformArbitrary,
  });

  it('should display title for any metadata object', () => {
    fc.assert(
      fc.property(metadataArbitrary, (metadata) => {
        const { container, unmount } = render(
          <MetadataCard
            title={metadata.title}
            thumbnail={metadata.thumbnail}
            author={metadata.author}
            duration={metadata.duration}
            platform={metadata.platform}
          />
        );

        // The title should be displayed
        const titleElement = container.querySelector('h3');
        expect(titleElement).toBeInTheDocument();
        expect(titleElement?.textContent).toBe(metadata.title);

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should display author for any metadata object', () => {
    fc.assert(
      fc.property(metadataArbitrary, (metadata) => {
        const { container, unmount } = render(
          <MetadataCard
            title={metadata.title}
            thumbnail={metadata.thumbnail}
            author={metadata.author}
            duration={metadata.duration}
            platform={metadata.platform}
          />
        );

        // The author should be displayed - check the text content includes it
        const textContent = container.textContent || '';
        expect(textContent).toContain(metadata.author);

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should display thumbnail for any metadata object', () => {
    fc.assert(
      fc.property(metadataArbitrary, (metadata) => {
        const { container, unmount } = render(
          <MetadataCard
            title={metadata.title}
            thumbnail={metadata.thumbnail}
            author={metadata.author}
            duration={metadata.duration}
            platform={metadata.platform}
          />
        );

        // The thumbnail image should be present
        const imgElement = container.querySelector('img');
        expect(imgElement).toBeInTheDocument();
        expect(imgElement).toHaveAttribute('src', metadata.thumbnail);
        expect(imgElement).toHaveAttribute('alt', metadata.title);

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should display duration when present in metadata', () => {
    fc.assert(
      fc.property(
        nonWhitespaceString(1, 200),
        fc.webUrl(),
        nonWhitespaceString(1, 100),
        nonWhitespaceString(1, 20),
        platformArbitrary,
        (title, thumbnail, author, duration, platform) => {
          const { container, unmount } = render(
            <MetadataCard
              title={title}
              thumbnail={thumbnail}
              author={author}
              duration={duration}
              platform={platform}
            />
          );

          // The duration should be displayed when provided
          const textContent = container.textContent || '';
          expect(textContent).toContain(duration);

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not display duration when absent from metadata', () => {
    fc.assert(
      fc.property(
        nonWhitespaceString(1, 200),
        fc.webUrl(),
        nonWhitespaceString(1, 100),
        platformArbitrary,
        (title, thumbnail, author, platform) => {
          const { container, unmount } = render(
            <MetadataCard
              title={title}
              thumbnail={thumbnail}
              author={author}
              duration={undefined}
              platform={platform}
            />
          );

          // The Clock icon should not be present when duration is undefined
          const clockIcons = container.querySelectorAll('.lucide-clock');
          expect(clockIcons.length).toBe(0);

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should display all metadata fields when all are present', () => {
    fc.assert(
      fc.property(
        nonWhitespaceString(1, 200),
        fc.webUrl(),
        nonWhitespaceString(1, 100),
        nonWhitespaceString(1, 20),
        platformArbitrary,
        (title, thumbnail, author, duration, platform) => {
          const { container, unmount } = render(
            <MetadataCard
              title={title}
              thumbnail={thumbnail}
              author={author}
              duration={duration}
              platform={platform}
            />
          );

          // All fields should be present
          expect(container.querySelector('h3')?.textContent).toBe(title);
          const textContent = container.textContent || '';
          expect(textContent).toContain(author);
          expect(textContent).toContain(duration);
          expect(container.querySelector('img')).toHaveAttribute('src', thumbnail);

          // Clean up
          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
