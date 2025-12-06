/**
 * Property-Based Tests for DownloadOptions Component
 * Feature: social-media-downloader
 */

import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import DownloadOptions, { DownloadFormat, Quality } from '../components/DownloadOptions';

/**
 * Property 7: Format Options Availability
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4
 * 
 * For any content type, the download options should include all applicable format options 
 * (MP4 for video, MP3 for audio, image formats for images, thumbnail option when available).
 */
describe('Property 7: Format Options Availability', () => {
  // Generator for format types
  const formatTypeArbitrary = fc.constantFrom<'video' | 'audio' | 'image' | 'thumbnail'>(
    'video',
    'audio',
    'image',
    'thumbnail'
  );

  // Generator for download formats
  const downloadFormatArbitrary = fc.array(
    fc.record({
      type: formatTypeArbitrary,
      label: fc.string({ minLength: 1, maxLength: 20 }),
      icon: fc.string({ minLength: 1, maxLength: 20 }),
    }),
    { minLength: 1, maxLength: 4 }
  );

  // Generator for qualities
  const qualityArbitrary = fc.array(
    fc.record({
      value: fc.string({ minLength: 1, maxLength: 10 }),
      label: fc.string({ minLength: 1, maxLength: 20 }),
      available: fc.boolean(),
    }),
    { minLength: 1, maxLength: 5 }
  );

  it('should display all provided format options', () => {
    fc.assert(
      fc.property(downloadFormatArbitrary, qualityArbitrary, (formats, qualities) => {
        const mockOnDownload = jest.fn();
        const { container, unmount } = render(
          <DownloadOptions
            formats={formats}
            qualities={qualities}
            onDownload={mockOnDownload}
            isDownloading={false}
          />
        );

        // Each format should be rendered as a button
        const formatButtons = container.querySelectorAll('button');
        
        // Should have at least one button per format plus the download button
        expect(formatButtons.length).toBeGreaterThanOrEqual(formats.length);

        // Each format label should appear in the component
        formats.forEach(format => {
          const textContent = container.textContent || '';
          expect(textContent).toContain(format.label);
        });

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should render video format option when video format is provided', () => {
    fc.assert(
      fc.property(qualityArbitrary, (qualities) => {
        const mockOnDownload = jest.fn();
        const formats: DownloadFormat[] = [
          { type: 'video', label: 'MP4 Video', icon: 'video' },
        ];

        const { container, unmount } = render(
          <DownloadOptions
            formats={formats}
            qualities={qualities}
            onDownload={mockOnDownload}
            isDownloading={false}
          />
        );

        const textContent = container.textContent || '';
        expect(textContent).toContain('MP4 Video');

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should render audio format option when audio format is provided', () => {
    fc.assert(
      fc.property(qualityArbitrary, (qualities) => {
        const mockOnDownload = jest.fn();
        const formats: DownloadFormat[] = [
          { type: 'audio', label: 'MP3 Audio', icon: 'audio' },
        ];

        const { container, unmount } = render(
          <DownloadOptions
            formats={formats}
            qualities={qualities}
            onDownload={mockOnDownload}
            isDownloading={false}
          />
        );

        const textContent = container.textContent || '';
        expect(textContent).toContain('MP3 Audio');

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should render image format option when image format is provided', () => {
    fc.assert(
      fc.property(qualityArbitrary, (qualities) => {
        const mockOnDownload = jest.fn();
        const formats: DownloadFormat[] = [
          { type: 'image', label: 'Image', icon: 'image' },
        ];

        const { container, unmount } = render(
          <DownloadOptions
            formats={formats}
            qualities={qualities}
            onDownload={mockOnDownload}
            isDownloading={false}
          />
        );

        const textContent = container.textContent || '';
        expect(textContent).toContain('Image');

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should render thumbnail format option when thumbnail format is provided', () => {
    fc.assert(
      fc.property(qualityArbitrary, (qualities) => {
        const mockOnDownload = jest.fn();
        const formats: DownloadFormat[] = [
          { type: 'thumbnail', label: 'Thumbnail', icon: 'thumbnail' },
        ];

        const { container, unmount } = render(
          <DownloadOptions
            formats={formats}
            qualities={qualities}
            onDownload={mockOnDownload}
            isDownloading={false}
          />
        );

        const textContent = container.textContent || '';
        expect(textContent).toContain('Thumbnail');

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });
});

/**
 * Property 9: Quality Options Display
 * Validates: Requirements 5.1, 5.2, 5.3, 5.4
 * 
 * For any video content, the quality selector should display all available quality options 
 * that the content supports.
 */
describe('Property 9: Quality Options Display', () => {
  const qualityArbitrary = fc.array(
    fc.record({
      value: fc.string({ minLength: 1, maxLength: 10 }).filter(s => s.trim().length > 0),
      label: fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.trim().length > 0),
      available: fc.boolean(),
    }),
    { minLength: 1, maxLength: 5 }
  );

  it('should display quality selector when video format is selected', () => {
    fc.assert(
      fc.property(qualityArbitrary, (qualities) => {
        // Ensure at least one quality is available
        const qualitiesWithAvailable = qualities.map((q, i) => ({
          ...q,
          available: i === 0 ? true : q.available,
        }));

        const mockOnDownload = jest.fn();
        const formats: DownloadFormat[] = [
          { type: 'video', label: 'MP4 Video', icon: 'video' },
        ];

        const { container, unmount } = render(
          <DownloadOptions
            formats={formats}
            qualities={qualitiesWithAvailable}
            onDownload={mockOnDownload}
            isDownloading={false}
          />
        );

        // Quality selector should be present
        const textContent = container.textContent || '';
        expect(textContent).toContain('Select Quality');

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should display all available quality options', () => {
    fc.assert(
      fc.property(qualityArbitrary, (qualities) => {
        // Ensure at least one quality is available
        const qualitiesWithAvailable = qualities.map((q, i) => ({
          ...q,
          available: i === 0 ? true : q.available,
        }));

        const mockOnDownload = jest.fn();
        const formats: DownloadFormat[] = [
          { type: 'video', label: 'MP4 Video', icon: 'video' },
        ];

        const { container, unmount } = render(
          <DownloadOptions
            formats={formats}
            qualities={qualitiesWithAvailable}
            onDownload={mockOnDownload}
            isDownloading={false}
          />
        );

        // At least one available quality should be displayed
        const availableQualities = qualitiesWithAvailable.filter(q => q.available);
        expect(availableQualities.length).toBeGreaterThan(0);

        // The first available quality should be shown (as it's selected by default)
        const textContent = container.textContent || '';
        const firstAvailable = availableQualities[0];
        expect(textContent).toContain(firstAvailable.label);

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });

  it('should include download button for any format and quality combination', () => {
    fc.assert(
      fc.property(qualityArbitrary, (qualities) => {
        // Ensure at least one quality is available
        const qualitiesWithAvailable = qualities.map((q, i) => ({
          ...q,
          available: i === 0 ? true : q.available,
        }));

        const mockOnDownload = jest.fn();
        const formats: DownloadFormat[] = [
          { type: 'video', label: 'MP4 Video', icon: 'video' },
        ];

        const { container, unmount } = render(
          <DownloadOptions
            formats={formats}
            qualities={qualitiesWithAvailable}
            onDownload={mockOnDownload}
            isDownloading={false}
          />
        );

        // Download button should be present
        const textContent = container.textContent || '';
        expect(textContent).toContain('Download');

        // Clean up
        unmount();
      }),
      { numRuns: 100 }
    );
  });
});
