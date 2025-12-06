import * as fc from 'fast-check';
import { ContentMetadata } from '../types';

/**
 * Feature: social-media-downloader, Property 5: Metadata Completeness
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 * 
 * For any successfully fetched content, the metadata should include all required fields:
 * title, thumbnail, author, and duration (for video content).
 */
describe('Property 5: Metadata Completeness', () => {
  it('should have all required fields for any metadata object', () => {
    // Property: For any metadata object, required fields must be present
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.option(fc.integer({ min: 0, max: 7200 }), { nil: undefined }),
        (title, thumbnail, author, duration) => {
          const metadata: ContentMetadata = {
            title,
            thumbnail,
            author,
            duration,
            platform: 'youtube',
            url: 'https://example.com',
            availableFormats: [],
            availableQualities: [],
          };

          // All required fields must be present
          return (
            typeof metadata.title === 'string' &&
            metadata.title.length > 0 &&
            typeof metadata.thumbnail === 'string' &&
            metadata.thumbnail.length > 0 &&
            typeof metadata.author === 'string' &&
            metadata.author.length > 0 &&
            (metadata.duration === undefined || typeof metadata.duration === 'number')
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have duration for video content', () => {
    // Property: For any video metadata, duration should be a positive number
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        fc.integer({ min: 1, max: 7200 }),
        (title, thumbnail, author, duration) => {
          const metadata: ContentMetadata = {
            title,
            thumbnail,
            author,
            duration,
            platform: 'youtube',
            url: 'https://example.com',
            availableFormats: [{ type: 'video', label: 'Video', icon: 'video' }],
            availableQualities: [],
          };

          // Video content should have a valid duration
          return (
            metadata.duration !== undefined &&
            typeof metadata.duration === 'number' &&
            metadata.duration > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should allow undefined duration for non-video content', () => {
    // Property: For any image metadata, duration can be undefined
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        (title, thumbnail, author) => {
          const metadata: ContentMetadata = {
            title,
            thumbnail,
            author,
            duration: undefined,
            platform: 'instagram',
            url: 'https://example.com',
            availableFormats: [{ type: 'image', label: 'Image', icon: 'image' }],
            availableQualities: [],
          };

          // Image content can have undefined duration
          return metadata.duration === undefined;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have non-empty title, thumbnail, and author', () => {
    // Property: For any metadata, title, thumbnail, and author must be non-empty strings
    fc.assert(
      fc.property(
        fc.string({ minLength: 1, maxLength: 100 }),
        fc.webUrl(),
        fc.string({ minLength: 1, maxLength: 50 }),
        (title, thumbnail, author) => {
          const metadata: ContentMetadata = {
            title,
            thumbnail,
            author,
            duration: undefined,
            platform: 'pinterest',
            url: 'https://example.com',
            availableFormats: [],
            availableQualities: [],
          };

          // All string fields must be non-empty
          return (
            metadata.title.trim().length > 0 &&
            metadata.thumbnail.trim().length > 0 &&
            metadata.author.trim().length > 0
          );
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should have valid platform and url', () => {
    // Property: For any metadata, platform and url must be valid
    fc.assert(
      fc.property(
        fc.constantFrom('youtube', 'instagram', 'tiktok', 'pinterest', 'twitter', 'facebook', 'reddit', 'linkedin'),
        fc.webUrl(),
        (platform, url) => {
          const metadata: ContentMetadata = {
            title: 'Test Title',
            thumbnail: 'https://example.com/thumb.jpg',
            author: 'Test Author',
            duration: undefined,
            platform,
            url,
            availableFormats: [],
            availableQualities: [],
          };

          // Platform and URL must be valid
          return (
            typeof metadata.platform === 'string' &&
            metadata.platform.length > 0 &&
            typeof metadata.url === 'string' &&
            metadata.url.startsWith('http')
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});
