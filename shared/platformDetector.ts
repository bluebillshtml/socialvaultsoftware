/**
 * Platform Detector Module
 * Detects social media platform from URL patterns
 */

import { Platform, URLPattern } from './types';

/**
 * URL patterns for all supported platforms
 */
export const URL_PATTERNS: URLPattern[] = [
  {
    platform: 'youtube',
    patterns: [
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i,
      /^(https?:\/\/)?(www\.)?youtube\.com\/watch\?v=.+$/i,
      /^(https?:\/\/)?(www\.)?youtu\.be\/.+$/i,
      /^(https?:\/\/)?(www\.)?youtube\.com\/shorts\/.+$/i,
      /^(https?:\/\/)?(www\.)?youtube\.com\/embed\/.+$/i,
    ],
    examples: [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://youtu.be/dQw4w9WgXcQ',
      'https://www.youtube.com/shorts/abc123',
    ],
  },
  {
    platform: 'instagram',
    patterns: [
      /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\/[^\/]+\/?.*$/i,
      /^(https?:\/\/)?(www\.)?instagram\.com\/[^\/]+\/(p|reel|tv)\/[^\/]+\/?.*$/i,
    ],
    examples: [
      'https://www.instagram.com/p/ABC123/',
      'https://www.instagram.com/reel/XYZ789/',
      'https://instagram.com/username/p/ABC123/',
    ],
  },
  {
    platform: 'tiktok',
    patterns: [
      /^(https?:\/\/)?(www\.)?tiktok\.com\/@[^\/]+\/video\/\d+.*$/i,
      /^(https?:\/\/)?(vm|vt)\.tiktok\.com\/[^\/]+\/?.*$/i,
      /^(https?:\/\/)?(www\.)?tiktok\.com\/t\/[^\/]+\/?.*$/i,
    ],
    examples: [
      'https://www.tiktok.com/@user/video/1234567890',
      'https://vm.tiktok.com/ABC123/',
      'https://www.tiktok.com/t/shortcode/',
    ],
  },
  {
    platform: 'pinterest',
    patterns: [
      /^(https?:\/\/)?(www\.)?pinterest\.(com|[a-z]{2})\/(pin|_saved)\/\d+.*$/i,
      /^(https?:\/\/)?(www\.)?pinterest\.(com|[a-z]{2})\/[^\/]+\/[^\/]+\/\d+.*$/i,
    ],
    examples: [
      'https://www.pinterest.com/pin/123456789/',
      'https://pinterest.com/username/board/123456789/',
    ],
  },
  {
    platform: 'twitter',
    patterns: [
      /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[^\/]+\/status\/\d+.*$/i,
      /^(https?:\/\/)?(www\.)?(twitter\.com|x\.com)\/[^\/]+\/statuses\/\d+.*$/i,
    ],
    examples: [
      'https://twitter.com/username/status/1234567890',
      'https://x.com/username/status/1234567890',
    ],
  },
  {
    platform: 'facebook',
    patterns: [
      /^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/[^\/]+\/(posts|videos)\/[^\/]+.*$/i,
      /^(https?:\/\/)?(www\.)?facebook\.com\/watch\/?\?v=\d+.*$/i,
      /^(https?:\/\/)?(www\.)?fb\.watch\/[^\/]+\/?.*$/i,
      /^(https?:\/\/)?(www\.)?facebook\.com\/reel\/\d+.*$/i,
    ],
    examples: [
      'https://www.facebook.com/username/posts/123456789',
      'https://www.facebook.com/username/videos/123456789',
      'https://fb.watch/abc123/',
      'https://www.facebook.com/watch/?v=123456789',
    ],
  },
  {
    platform: 'reddit',
    patterns: [
      /^(https?:\/\/)?(www\.)?reddit\.com\/r\/[^\/]+\/comments\/[^\/]+.*$/i,
      /^(https?:\/\/)?(www\.)?redd\.it\/[^\/]+\/?.*$/i,
    ],
    examples: [
      'https://www.reddit.com/r/subreddit/comments/abc123/title/',
      'https://redd.it/abc123',
    ],
  },
  {
    platform: 'linkedin',
    patterns: [
      /^(https?:\/\/)?(www\.)?linkedin\.com\/(posts|feed\/update)\/[^\/]+.*$/i,
      /^(https?:\/\/)?(www\.)?linkedin\.com\/pulse\/[^\/]+.*$/i,
    ],
    examples: [
      'https://www.linkedin.com/posts/username_activity-123456789',
      'https://www.linkedin.com/feed/update/urn:li:activity:123456789',
      'https://www.linkedin.com/pulse/article-title/',
    ],
  },
];

/**
 * Detects the platform from a given URL
 * @param url - The URL to detect the platform from
 * @returns The detected platform or 'unknown' if not recognized
 */
export function detectPlatform(url: string): Platform {
  if (!url || url.trim() === '') {
    return 'unknown';
  }

  const trimmedUrl = url.trim();

  // Check each platform's patterns
  for (const platformPattern of URL_PATTERNS) {
    for (const pattern of platformPattern.patterns) {
      if (pattern.test(trimmedUrl)) {
        return platformPattern.platform;
      }
    }
  }

  return 'unknown';
}

/**
 * Gets the URL patterns for a specific platform
 * @param platform - The platform to get patterns for
 * @returns The URL pattern object or undefined if not found
 */
export function getPlatformPatterns(platform: Platform): URLPattern | undefined {
  return URL_PATTERNS.find(p => p.platform === platform);
}

/**
 * Validates if a URL belongs to a specific platform
 * @param url - The URL to validate
 * @param platform - The expected platform
 * @returns true if the URL belongs to the platform, false otherwise
 */
export function validatePlatformUrl(url: string, platform: Platform): boolean {
  return detectPlatform(url) === platform;
}
