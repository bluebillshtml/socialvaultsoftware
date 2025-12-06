/**
 * Property-Based Tests for URL Validation
 * Feature: social-media-downloader, Property 1: URL Validation Correctness
 * Validates: Requirements 1.1
 */

import * as fc from 'fast-check';
import { validateURL } from '../urlValidator';
import { 
  DEFAULT_PBT_PARAMS,
  validUrlArbitrary,
  emptyStringArbitrary,
  invalidUrlArbitrary
} from './testUtils';

describe('URL Validator', () => {
  describe('Property 1: URL Validation Correctness', () => {
    /**
     * Feature: social-media-downloader, Property 1: URL Validation Correctness
     * For any string input, the URL validator should correctly identify valid URLs
     * and reject invalid ones, where valid URLs match standard URL format patterns.
     */
    it('should accept valid HTTP/HTTPS URLs', () => {
      fc.assert(
        fc.property(validUrlArbitrary, (url) => {
          const result = validateURL(url);
          // Valid URLs should be accepted
          expect(result).toBe(true);
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should reject empty strings and whitespace-only strings', () => {
      fc.assert(
        fc.property(emptyStringArbitrary, (url) => {
          const result = validateURL(url);
          expect(result).toBe(false);
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should reject dangerous protocols', () => {
      fc.assert(
        fc.property(invalidUrlArbitrary, (url) => {
          const result = validateURL(url);
          expect(result).toBe(false);
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should reject malformed URLs without domain extension', () => {
      const noDomainExtensionArbitrary = fc.tuple(
        fc.constantFrom('http://', 'https://', ''),
        fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/i.test(s))
      ).map(([protocol, domain]) => `${protocol}${domain}`);

      fc.assert(
        fc.property(noDomainExtensionArbitrary, (url) => {
          const result = validateURL(url);
          // URLs without domain extension should be rejected
          expect(result).toBe(false);
        }),
        DEFAULT_PBT_PARAMS
      );
    });
  });

  describe('Specific edge cases', () => {
    it('should reject empty string', () => {
      expect(validateURL('')).toBe(false);
    });

    it('should reject whitespace-only string', () => {
      expect(validateURL('   ')).toBe(false);
      expect(validateURL('\t\n')).toBe(false);
    });

    it('should reject dangerous protocols', () => {
      expect(validateURL('file:///etc/passwd')).toBe(false);
      expect(validateURL('javascript:alert(1)')).toBe(false);
      expect(validateURL('data:text/html,<script>alert(1)</script>')).toBe(false);
      expect(validateURL('vbscript:msgbox')).toBe(false);
    });

    it('should accept valid URLs with protocol', () => {
      expect(validateURL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(validateURL('http://instagram.com/p/ABC123/')).toBe(true);
      expect(validateURL('https://tiktok.com/@user/video/123')).toBe(true);
    });

    it('should accept valid URLs without protocol', () => {
      expect(validateURL('www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(validateURL('instagram.com/p/ABC123/')).toBe(true);
      expect(validateURL('tiktok.com/@user/video/123')).toBe(true);
    });

    it('should reject malformed URLs', () => {
      expect(validateURL('not a url')).toBe(false);
      expect(validateURL('http://')).toBe(false);
      expect(validateURL('https://')).toBe(false);
      expect(validateURL('ftp://example.com')).toBe(false);
    });

    it('should handle URLs with query parameters', () => {
      expect(validateURL('https://example.com?param=value')).toBe(true);
      expect(validateURL('example.com?param=value&other=123')).toBe(true);
    });

    it('should handle URLs with fragments', () => {
      expect(validateURL('https://example.com#section')).toBe(true);
      expect(validateURL('example.com/page#section')).toBe(true);
    });
  });
});
