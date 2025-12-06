/**
 * Fast-Check Custom Generators for Property-Based Testing
 * 
 * This module provides reusable generators for common data types used across
 * the SocialVault application. All property-based tests should use these
 * generators to ensure consistency and proper test coverage.
 * 
 * Configuration: All tests run with a minimum of 100 iterations.
 */

import * as fc from 'fast-check';
import { Platform, ContentMetadata, DownloadFormat, Quality } from '../types';

// ============================================================================
// Configuration
// ============================================================================

/**
 * Default configuration for all property-based tests
 * Ensures minimum 100 iterations as specified in design document
 */
export const PBT_CONFIG = {
  numRuns: 100,
} as const;

// ============================================================================
// Platform Generators
// ============================================================================

/**
 * Generates valid platform identifiers
 */
export const platformArbitrary = fc.constantFrom<Platform>(
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

/**
 * Generates valid platform identifiers (excluding 'unknown')
 */
export const supportedPlatformArbitrary = fc.constantFrom<Platform>(
  'youtube',
  'instagram',
  'tiktok',
  'pinterest',
  'twitter',
  'facebook',
  'reddit',
  'linkedin'
);

// ============================================================================
// URL Generators
// ============================================================================

/**
 * Generates valid HTTP/HTTPS URLs
 */
export const validUrlArbitrary = fc.tuple(
  fc.constantFrom('http://', 'https://', ''),
  fc.string({ minLength: 1, maxLength: 20 }).filter(s => /^[a-z0-9-]+$/i.test(s)),
  fc.constantFrom('.com', '.org', '.net', '.io', '.co', '.edu'),
  fc.option(
    fc.string({ maxLength: 30 }).filter(s => /^\/[a-z0-9\/-]*$/i.test(s) || s === ''),
    { nil: '' }
  )
).map(([protocol, domain, tld, path]) => {
  const baseUrl = `${domain}${tld}${path || ''}`;
  return protocol ? `${protocol}${baseUrl}` : baseUrl;
});

/**
 * Generates YouTube URLs (various formats)
 */
export const youtubeUrlArbitrary = fc.oneof(
  // Standard watch URLs
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constantFrom('www.', ''),
    fc.constant('youtube.com/watch?v='),
    fc.string({ minLength: 11, maxLength: 11 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s))
  ).map(([protocol, www, base, id]) => `${protocol}${www}${base}${id}`),
  // Short URLs
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constant('youtu.be/'),
    fc.string({ minLength: 11, maxLength: 11 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s))
  ).map(([protocol, base, id]) => `${protocol}${base}${id}`),
  // Shorts URLs
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constantFrom('www.', ''),
    fc.constant('youtube.com/shorts/'),
    fc.string({ minLength: 11, maxLength: 11 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s))
  ).map(([protocol, www, base, id]) => `${protocol}${www}${base}${id}`)
);

/**
 * Generates Instagram URLs (posts, reels, TV)
 */
export const instagramUrlArbitrary = fc.tuple(
  fc.constantFrom('https://', 'http://', ''),
  fc.constantFrom('www.', ''),
  fc.constant('instagram.com/'),
  fc.constantFrom('p/', 'reel/', 'tv/'),
  fc.string({ minLength: 5, maxLength: 15 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s))
).map(([protocol, www, base, type, id]) => `${protocol}${www}${base}${type}${id}/`);

/**
 * Generates TikTok URLs (standard and short formats)
 */
export const tiktokUrlArbitrary = fc.oneof(
  // Standard video URLs
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constantFrom('www.', ''),
    fc.constant('tiktok.com/@'),
    fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
    fc.constant('/video/'),
    fc.integer({ min: 1000000000000000000, max: 9999999999999999999 })
  ).map(([protocol, www, base, user, video, id]) => `${protocol}${www}${base}${user}${video}${id}`),
  // Short URLs
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constantFrom('vm.', 'vt.'),
    fc.constant('tiktok.com/'),
    fc.string({ minLength: 5, maxLength: 10 }).filter(s => /^[a-zA-Z0-9]+$/.test(s))
  ).map(([protocol, subdomain, base, id]) => `${protocol}${subdomain}${base}${id}`)
);

/**
 * Generates Pinterest URLs
 */
export const pinterestUrlArbitrary = fc.tuple(
  fc.constantFrom('https://', 'http://', ''),
  fc.constantFrom('www.', ''),
  fc.constant('pinterest.com/pin/'),
  fc.integer({ min: 100000000000, max: 999999999999999 })
).map(([protocol, www, base, id]) => `${protocol}${www}${base}${id}/`);

/**
 * Generates X/Twitter URLs
 */
export const twitterUrlArbitrary = fc.tuple(
  fc.constantFrom('https://', 'http://', ''),
  fc.constantFrom('www.', ''),
  fc.constantFrom('twitter.com/', 'x.com/'),
  fc.string({ minLength: 3, maxLength: 15 }).filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
  fc.constant('/status/'),
  fc.integer({ min: 1000000000000000000, max: 9999999999999999999 })
).map(([protocol, www, base, user, status, id]) => `${protocol}${www}${base}${user}${status}${id}`);

/**
 * Generates Facebook URLs (posts and videos)
 */
export const facebookUrlArbitrary = fc.oneof(
  // Posts
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constantFrom('www.', ''),
    fc.constant('facebook.com/'),
    fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[a-zA-Z0-9._]+$/.test(s)),
    fc.constant('/posts/'),
    fc.integer({ min: 100000000000, max: 999999999999999 })
  ).map(([protocol, www, base, user, posts, id]) => `${protocol}${www}${base}${user}${posts}${id}`),
  // Videos
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constantFrom('www.', ''),
    fc.constant('facebook.com/'),
    fc.string({ minLength: 3, maxLength: 20 }).filter(s => /^[a-zA-Z0-9._]+$/.test(s)),
    fc.constant('/videos/'),
    fc.integer({ min: 100000000000, max: 999999999999999 })
  ).map(([protocol, www, base, user, videos, id]) => `${protocol}${www}${base}${user}${videos}${id}`)
);

/**
 * Generates Reddit URLs
 */
export const redditUrlArbitrary = fc.tuple(
  fc.constantFrom('https://', 'http://', ''),
  fc.constantFrom('www.', ''),
  fc.constant('reddit.com/r/'),
  fc.string({ minLength: 3, maxLength: 21 }).filter(s => /^[a-zA-Z0-9_]+$/.test(s)),
  fc.constant('/comments/'),
  fc.string({ minLength: 6, maxLength: 6 }).filter(s => /^[a-z0-9]+$/.test(s)),
  fc.constant('/'),
  fc.string({ minLength: 5, maxLength: 30 }).filter(s => /^[a-z0-9_]+$/.test(s))
).map(([protocol, www, base, sub, comments, id, slash, title]) => 
  `${protocol}${www}${base}${sub}${comments}${id}${slash}${title}/`
);

/**
 * Generates LinkedIn URLs (posts and feed updates)
 */
export const linkedinUrlArbitrary = fc.oneof(
  // Posts
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constantFrom('www.', ''),
    fc.constant('linkedin.com/posts/'),
    fc.string({ minLength: 10, maxLength: 50 }).filter(s => /^[a-zA-Z0-9_-]+$/.test(s))
  ).map(([protocol, www, base, id]) => `${protocol}${www}${base}${id}`),
  // Feed updates
  fc.tuple(
    fc.constantFrom('https://', 'http://', ''),
    fc.constantFrom('www.', ''),
    fc.constant('linkedin.com/feed/update/urn:li:activity:'),
    fc.integer({ min: 1000000000000000000, max: 9999999999999999999 })
  ).map(([protocol, www, base, id]) => `${protocol}${www}${base}${id}`)
);

/**
 * Generates platform-specific URLs based on platform type
 */
export const platformSpecificUrlArbitrary = (platform: Platform) => {
  switch (platform) {
    case 'youtube':
      return youtubeUrlArbitrary;
    case 'instagram':
      return instagramUrlArbitrary;
    case 'tiktok':
      return tiktokUrlArbitrary;
    case 'pinterest':
      return pinterestUrlArbitrary;
    case 'twitter':
      return twitterUrlArbitrary;
    case 'facebook':
      return facebookUrlArbitrary;
    case 'reddit':
      return redditUrlArbitrary;
    case 'linkedin':
      return linkedinUrlArbitrary;
    default:
      return validUrlArbitrary;
  }
};

/**
 * Generates any supported social media URL
 */
export const socialMediaUrlArbitrary = fc.oneof(
  youtubeUrlArbitrary,
  instagramUrlArbitrary,
  tiktokUrlArbitrary,
  pinterestUrlArbitrary,
  twitterUrlArbitrary,
  facebookUrlArbitrary,
  redditUrlArbitrary,
  linkedinUrlArbitrary
);

/**
 * Generates invalid URLs (empty, whitespace, malformed, dangerous protocols)
 */
export const invalidUrlArbitrary = fc.oneof(
  fc.constant(''),
  fc.constant('   '),
  fc.constant('not a url'),
  fc.string({ minLength: 1, maxLength: 20 }).filter(s => !s.includes('.')),
  fc.tuple(
    fc.constantFrom('file://', 'javascript:', 'data:', 'vbscript:'),
    fc.string({ minLength: 1, maxLength: 20 })
  ).map(([protocol, rest]) => `${protocol}${rest}`)
);

// ============================================================================
// Format and Quality Generators
// ============================================================================

/**
 * Generates download format options
 */
export const formatArbitrary = fc.constantFrom<DownloadFormat>(
  { type: 'video', label: 'Video (MP4)', icon: 'video' },
  { type: 'audio', label: 'Audio (MP3)', icon: 'audio' },
  { type: 'image', label: 'Image', icon: 'image' },
  { type: 'thumbnail', label: 'Thumbnail', icon: 'thumbnail' }
);

/**
 * Generates quality options
 */
export const qualityArbitrary = fc.oneof(
  fc.record({
    value: fc.constant('1080p'),
    label: fc.constant('1080p (Full HD)'),
    available: fc.boolean()
  }),
  fc.record({
    value: fc.constant('720p'),
    label: fc.constant('720p (HD)'),
    available: fc.boolean()
  }),
  fc.record({
    value: fc.constant('480p'),
    label: fc.constant('480p (SD)'),
    available: fc.boolean()
  }),
  fc.record({
    value: fc.constant('360p'),
    label: fc.constant('360p'),
    available: fc.boolean()
  }),
  fc.record({
    value: fc.constant('best'),
    label: fc.constant('Best Available'),
    available: fc.constant(true)
  })
) as fc.Arbitrary<Quality>;

// ============================================================================
// Metadata Generators
// ============================================================================

/**
 * Generates valid content metadata
 */
export const metadataArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  thumbnail: fc.webUrl(),
  author: fc.string({ minLength: 1, maxLength: 50 }),
  duration: fc.option(fc.integer({ min: 0, max: 7200 }), { nil: undefined }),
  platform: supportedPlatformArbitrary,
  url: socialMediaUrlArbitrary,
  availableFormats: fc.array(formatArbitrary, { minLength: 0, maxLength: 4 }),
  availableQualities: fc.array(qualityArbitrary, { minLength: 0, maxLength: 5 })
}) as fc.Arbitrary<ContentMetadata>;

/**
 * Generates video metadata (with duration)
 */
export const videoMetadataArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  thumbnail: fc.webUrl(),
  author: fc.string({ minLength: 1, maxLength: 50 }),
  duration: fc.integer({ min: 1, max: 7200 }),
  platform: fc.constantFrom<Platform>('youtube', 'tiktok', 'facebook', 'reddit'),
  url: socialMediaUrlArbitrary,
  availableFormats: fc.array(formatArbitrary, { minLength: 1, maxLength: 4 }),
  availableQualities: fc.array(qualityArbitrary, { minLength: 1, maxLength: 5 })
}) as fc.Arbitrary<ContentMetadata>;

/**
 * Generates image metadata (without duration)
 */
export const imageMetadataArbitrary = fc.record({
  title: fc.string({ minLength: 1, maxLength: 100 }),
  thumbnail: fc.webUrl(),
  author: fc.string({ minLength: 1, maxLength: 50 }),
  duration: fc.constant(undefined),
  platform: fc.constantFrom<Platform>('instagram', 'pinterest', 'twitter'),
  url: socialMediaUrlArbitrary,
  availableFormats: fc.array(
    fc.constantFrom<DownloadFormat>(
      { type: 'image', label: 'Image', icon: 'image' },
      { type: 'thumbnail', label: 'Thumbnail', icon: 'thumbnail' }
    ),
    { minLength: 1, maxLength: 2 }
  ),
  availableQualities: fc.constant([])
}) as fc.Arbitrary<ContentMetadata>;

/**
 * Generates available quality options (only available ones)
 */
export const availableQualityArbitrary = fc.oneof(
  fc.constant({ value: '1080p', label: '1080p (Full HD)', available: true }),
  fc.constant({ value: '720p', label: '720p (HD)', available: true }),
  fc.constant({ value: '480p', label: '480p (SD)', available: true }),
  fc.constant({ value: '360p', label: '360p', available: true }),
  fc.constant({ value: 'best', label: 'Best Available', available: true })
) as fc.Arbitrary<Quality>;

// ============================================================================
// Theme Generators
// ============================================================================

/**
 * Generates theme mode values
 */
export const themeArbitrary = fc.constantFrom('light', 'dark');

/**
 * Generates viewport dimensions
 */
export const viewportArbitrary = fc.record({
  width: fc.integer({ min: 320, max: 2560 }),
  height: fc.integer({ min: 568, max: 1440 })
});

/**
 * Generates mobile viewport dimensions
 */
export const mobileViewportArbitrary = fc.record({
  width: fc.integer({ min: 320, max: 639 }),
  height: fc.integer({ min: 568, max: 1024 })
});

/**
 * Generates tablet viewport dimensions
 */
export const tabletViewportArbitrary = fc.record({
  width: fc.integer({ min: 640, max: 1023 }),
  height: fc.integer({ min: 768, max: 1366 })
});

/**
 * Generates desktop viewport dimensions
 */
export const desktopViewportArbitrary = fc.record({
  width: fc.integer({ min: 1024, max: 2560 }),
  height: fc.integer({ min: 768, max: 1440 })
});

// ============================================================================
// Progress and Status Generators
// ============================================================================

/**
 * Generates progress values (0-100)
 */
export const progressArbitrary = fc.integer({ min: 0, max: 100 });

/**
 * Generates download status values
 */
export const downloadStatusArbitrary = fc.constantFrom(
  'idle',
  'fetching',
  'downloading',
  'complete',
  'error'
);

// ============================================================================
// Utility Generators
// ============================================================================

/**
 * Generates non-empty strings
 */
export const nonEmptyStringArbitrary = fc.string({ minLength: 1, maxLength: 100 });

/**
 * Generates empty or whitespace-only strings
 */
export const emptyStringArbitrary = fc.oneof(
  fc.constant(''),
  fc.string({ minLength: 1, maxLength: 10 }).filter(s => /^\s+$/.test(s))
);

/**
 * Generates alphanumeric strings
 */
export const alphanumericArbitrary = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => /^[a-zA-Z0-9]+$/.test(s));

/**
 * Generates file sizes in bytes
 */
export const fileSizeArbitrary = fc.integer({ min: 1024, max: 524288000 }); // 1KB to 500MB

/**
 * Generates timestamps
 */
export const timestampArbitrary = fc.date({ min: new Date('2020-01-01'), max: new Date('2025-12-31') });
