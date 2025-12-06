import { NextRequest, NextResponse } from 'next/server';
import { Platform, ContentMetadata } from '@socialvault/shared/types';
import { validateSecureUrl } from '@socialvault/shared/security';
import { withRateLimit } from '../../../lib/rateLimitMiddleware';
import type { PlatformExtractor } from '@socialvault/shared/extractors';

// Simple in-memory cache with TTL
interface CacheEntry {
  data: ContentMetadata;
  timestamp: number;
}

const metadataCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get extractor instance for a given platform using dynamic imports (code splitting)
 */
async function getExtractor(platform: Platform): Promise<PlatformExtractor | null> {
  switch (platform) {
    case 'youtube': {
      const { YouTubeExtractor } = await import('@socialvault/shared/extractors/YouTubeExtractor');
      return new YouTubeExtractor();
    }
    case 'instagram': {
      const { InstagramExtractor } = await import('@socialvault/shared/extractors/InstagramExtractor');
      return new InstagramExtractor();
    }
    case 'tiktok': {
      const { TikTokExtractor } = await import('@socialvault/shared/extractors/TikTokExtractor');
      return new TikTokExtractor();
    }
    case 'pinterest': {
      const { PinterestExtractor } = await import('@socialvault/shared/extractors/PinterestExtractor');
      return new PinterestExtractor();
    }
    case 'twitter': {
      const { XExtractor } = await import('@socialvault/shared/extractors/XExtractor');
      return new XExtractor();
    }
    case 'facebook': {
      const { FacebookExtractor } = await import('@socialvault/shared/extractors/FacebookExtractor');
      return new FacebookExtractor();
    }
    case 'reddit': {
      const { RedditExtractor } = await import('@socialvault/shared/extractors/RedditExtractor');
      return new RedditExtractor();
    }
    case 'linkedin': {
      const { LinkedInExtractor } = await import('@socialvault/shared/extractors/LinkedInExtractor');
      return new LinkedInExtractor();
    }
    default:
      return null;
  }
}

/**
 * Get cached metadata if available and not expired
 */
function getCachedMetadata(cacheKey: string): ContentMetadata | null {
  const cached = metadataCache.get(cacheKey);
  
  if (!cached) {
    return null;
  }

  const now = Date.now();
  const age = now - cached.timestamp;

  if (age > CACHE_TTL) {
    // Cache expired, remove it
    metadataCache.delete(cacheKey);
    return null;
  }

  return cached.data;
}

/**
 * Store metadata in cache
 */
function cacheMetadata(cacheKey: string, metadata: ContentMetadata) {
  metadataCache.set(cacheKey, {
    data: metadata,
    timestamp: Date.now(),
  });
}

/**
 * POST /api/metadata
 * Extracts metadata from a social media URL
 */
async function metadataHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, platform } = body;

    // Validate input
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'URL is required and must be a string',
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    // Security validation
    const securityCheck = validateSecureUrl(url);
    if (!securityCheck.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'SECURITY_ERROR',
            message: securityCheck.error || 'URL failed security validation',
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    const sanitizedUrl = securityCheck.sanitized!;

    if (!platform || typeof platform !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Platform is required and must be a string',
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${platform}:${sanitizedUrl}`;
    const cachedMetadata = getCachedMetadata(cacheKey);

    if (cachedMetadata) {
      return NextResponse.json(
        {
          success: true,
          metadata: cachedMetadata,
          cached: true,
        },
        { status: 200 }
      );
    }

    // Get appropriate extractor
    const extractor = await getExtractor(platform as Platform);

    if (!extractor) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNSUPPORTED_PLATFORM',
            message: `Platform '${platform}' is not supported`,
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    // Extract metadata
    const metadata = await extractor.extractMetadata(sanitizedUrl);

    // Cache the result
    cacheMetadata(cacheKey, metadata);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        metadata,
        cached: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/metadata:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Determine error type and appropriate response
    let errorCode = 'EXTRACTION_ERROR';
    let statusCode = 500;
    let retryable = true;

    // Handle specific error cases
    if (errorMessage.includes('404') || errorMessage.includes('not found')) {
      errorCode = 'CONTENT_NOT_FOUND';
      statusCode = 404;
      retryable = false;
    } else if (errorMessage.includes('403') || errorMessage.includes('private') || errorMessage.includes('forbidden')) {
      errorCode = 'PRIVATE_CONTENT';
      statusCode = 403;
      retryable = false;
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT')) {
      errorCode = 'NETWORK_TIMEOUT';
      statusCode = 504;
      retryable = true;
    } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      errorCode = 'RATE_LIMITED';
      statusCode = 429;
      retryable = true;
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message: `Failed to extract metadata: ${errorMessage}`,
          retryable,
        },
      },
      { status: statusCode }
    );
  }
}

// Export with rate limiting middleware
export const POST = withRateLimit(metadataHandler);
