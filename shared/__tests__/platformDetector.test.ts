/**
 * Property-Based Tests for Platform Detection
 * Feature: social-media-downloader, Property 2: Platform Detection Accuracy
 * Validates: Requirements 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8
 */

import * as fc from 'fast-check';
import { detectPlatform, URL_PATTERNS, validatePlatformUrl } from '../platformDetector';
import { Platform } from '../types';
import {
  DEFAULT_PBT_PARAMS,
  youtubeUrlArbitrary,
  instagramUrlArbitrary,
  tiktokUrlArbitrary,
  pinterestUrlArbitrary,
  twitterUrlArbitrary,
  facebookUrlArbitrary,
  redditUrlArbitrary,
  linkedinUrlArbitrary,
  invalidUrlArbitrary
} from './testUtils';

describe('Platform Detector', () => {
  describe('Property 2: Platform Detection Accuracy', () => {
    /**
     * Feature: social-media-downloader, Property 2: Platform Detection Accuracy
     * For any valid social media URL from supported platforms (YouTube, Instagram, TikTok, 
     * Pinterest, X, Facebook, Reddit, LinkedIn), the platform detector should correctly 
     * identify the source platform.
     */
    it('should correctly detect YouTube URLs', () => {
      fc.assert(
        fc.property(youtubeUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('youtube');
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should correctly detect Instagram URLs', () => {
      fc.assert(
        fc.property(instagramUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('instagram');
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should correctly detect TikTok URLs', () => {
      fc.assert(
        fc.property(tiktokUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('tiktok');
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should correctly detect Pinterest URLs', () => {
      fc.assert(
        fc.property(pinterestUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('pinterest');
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should correctly detect X/Twitter URLs', () => {
      fc.assert(
        fc.property(twitterUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('twitter');
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should correctly detect Facebook URLs', () => {
      fc.assert(
        fc.property(facebookUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('facebook');
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should correctly detect Reddit URLs', () => {
      fc.assert(
        fc.property(redditUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('reddit');
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should correctly detect LinkedIn URLs', () => {
      fc.assert(
        fc.property(linkedinUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('linkedin');
        }),
        DEFAULT_PBT_PARAMS
      );
    });

    it('should return unknown for invalid or unsupported URLs', () => {
      fc.assert(
        fc.property(invalidUrlArbitrary, (url) => {
          const result = detectPlatform(url);
          expect(result).toBe('unknown');
        }),
        DEFAULT_PBT_PARAMS
      );
    });
  });

  describe('Specific platform detection tests', () => {
    it('should detect YouTube URLs', () => {
      expect(detectPlatform('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube');
      expect(detectPlatform('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube');
      expect(detectPlatform('youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube');
      expect(detectPlatform('https://www.youtube.com/shorts/abc123def45')).toBe('youtube');
    });

    it('should detect Instagram URLs', () => {
      expect(detectPlatform('https://www.instagram.com/p/ABC123/')).toBe('instagram');
      expect(detectPlatform('https://www.instagram.com/reel/XYZ789/')).toBe('instagram');
      expect(detectPlatform('instagram.com/p/ABC123/')).toBe('instagram');
    });

    it('should detect TikTok URLs', () => {
      expect(detectPlatform('https://www.tiktok.com/@user/video/1234567890123456789')).toBe('tiktok');
      expect(detectPlatform('https://vm.tiktok.com/ABC123/')).toBe('tiktok');
      expect(detectPlatform('tiktok.com/@user/video/1234567890123456789')).toBe('tiktok');
    });

    it('should detect Pinterest URLs', () => {
      expect(detectPlatform('https://www.pinterest.com/pin/123456789012345/')).toBe('pinterest');
      expect(detectPlatform('pinterest.com/pin/123456789012345/')).toBe('pinterest');
    });

    it('should detect X/Twitter URLs', () => {
      expect(detectPlatform('https://twitter.com/username/status/1234567890123456789')).toBe('twitter');
      expect(detectPlatform('https://x.com/username/status/1234567890123456789')).toBe('twitter');
      expect(detectPlatform('twitter.com/username/status/1234567890123456789')).toBe('twitter');
    });

    it('should detect Facebook URLs', () => {
      expect(detectPlatform('https://www.facebook.com/username/posts/123456789012345')).toBe('facebook');
      expect(detectPlatform('https://www.facebook.com/username/videos/123456789012345')).toBe('facebook');
      expect(detectPlatform('https://fb.watch/abc123/')).toBe('facebook');
    });

    it('should detect Reddit URLs', () => {
      expect(detectPlatform('https://www.reddit.com/r/subreddit/comments/abc123/title/')).toBe('reddit');
      expect(detectPlatform('reddit.com/r/programming/comments/xyz789/post_title/')).toBe('reddit');
    });

    it('should detect LinkedIn URLs', () => {
      expect(detectPlatform('https://www.linkedin.com/posts/username_activity-123456789')).toBe('linkedin');
      expect(detectPlatform('https://www.linkedin.com/feed/update/urn:li:activity:1234567890123456789')).toBe('linkedin');
    });

    it('should return unknown for unsupported platforms', () => {
      expect(detectPlatform('')).toBe('unknown');
      expect(detectPlatform('   ')).toBe('unknown');
      expect(detectPlatform('not a url')).toBe('unknown');
      expect(detectPlatform('https://unsupported.com/video/123')).toBe('unknown');
    });
  });

  describe('validatePlatformUrl', () => {
    it('should validate URLs against specific platforms', () => {
      expect(validatePlatformUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'youtube')).toBe(true);
      expect(validatePlatformUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ', 'instagram')).toBe(false);
      expect(validatePlatformUrl('https://www.instagram.com/p/ABC123/', 'instagram')).toBe(true);
      expect(validatePlatformUrl('https://www.instagram.com/p/ABC123/', 'youtube')).toBe(false);
    });
  });
});
