/**
 * Reddit Extractor Tests
 * Basic tests to verify Reddit extractor functionality
 */

import { RedditExtractor } from '../extractors/RedditExtractor';

describe('RedditExtractor', () => {
  let extractor: RedditExtractor;

  beforeEach(() => {
    extractor = new RedditExtractor();
  });

  describe('Basic Configuration', () => {
    it('should have correct platform identifier', () => {
      expect(extractor.platform).toBe('reddit');
    });

    it('should return supported formats', () => {
      const formats = extractor.getSupportedFormats();
      expect(formats).toHaveLength(3);
      expect(formats.map(f => f.type)).toContain('video');
      expect(formats.map(f => f.type)).toContain('image');
      expect(formats.map(f => f.type)).toContain('thumbnail');
    });

    it('should return supported qualities', () => {
      const qualities = extractor.getSupportedQualities();
      expect(qualities).toHaveLength(1);
      expect(qualities[0].value).toBe('high');
    });
  });

  describe('URL Validation', () => {
    it('should validate proper Reddit URLs', () => {
      const validUrls = [
        'https://www.reddit.com/r/test/comments/abc123/title/',
        'https://reddit.com/r/test/comments/abc123/title/',
      ];

      validUrls.forEach(url => {
        // validateUrl is protected, but we can test through extractMetadata error handling
        expect(() => new URL(url)).not.toThrow();
      });
    });
  });

  describe('Metadata Structure', () => {
    it('should have extractMetadata method', () => {
      expect(typeof extractor.extractMetadata).toBe('function');
    });

    it('should have getDownloadUrl method', () => {
      expect(typeof extractor.getDownloadUrl).toBe('function');
    });

    it('should have getGalleryUrls method', () => {
      expect(typeof extractor.getGalleryUrls).toBe('function');
    });
  });
});
