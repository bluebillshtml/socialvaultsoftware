import { NextRequest, NextResponse } from 'next/server';
import { detectPlatform } from '@socialvault/shared/platformDetector';
import { validateURL } from '@socialvault/shared/urlValidator';
import { validateSecureUrl } from '@socialvault/shared/security';
import { withRateLimit } from '../../../lib/rateLimitMiddleware';

// Simple in-memory cache for platform detection results
interface CacheEntry {
  platform: string;
  timestamp: number;
}

const platformCache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Get cached platform detection result if available and not expired
 */
function getCachedPlatform(url: string): string | null {
  const cached = platformCache.get(url);
  
  if (!cached) {
    return null;
  }

  const now = Date.now();
  const age = now - cached.timestamp;

  if (age > CACHE_TTL) {
    // Cache expired, remove it
    platformCache.delete(url);
    return null;
  }

  return cached.platform;
}

/**
 * Store platform detection result in cache
 */
function cachePlatform(url: string, platform: string) {
  platformCache.set(url, {
    platform,
    timestamp: Date.now(),
  });
}

/**
 * POST /api/detect
 * Detects the social media platform from a given URL
 */
async function detectHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

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

    // Validate URL format
    if (!validateURL(url)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_URL',
            message: 'Invalid URL format',
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

    // Check cache first
    const cachedPlatform = getCachedPlatform(sanitizedUrl);
    if (cachedPlatform) {
      return NextResponse.json(
        {
          success: true,
          platform: cachedPlatform,
          url: sanitizedUrl,
          cached: true,
        },
        { status: 200 }
      );
    }

    // Detect platform
    const platform = detectPlatform(sanitizedUrl);

    if (platform === 'unknown') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNSUPPORTED_PLATFORM',
            message: 'Platform not supported or URL not recognized',
            retryable: false,
          },
        },
        { status: 400 }
      );
    }

    // Cache the result
    cachePlatform(sanitizedUrl, platform);

    // Return success response
    return NextResponse.json(
      {
        success: true,
        platform,
        url: sanitizedUrl,
        cached: false,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/detect:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}

// Export with rate limiting middleware
export const POST = withRateLimit(detectHandler);
