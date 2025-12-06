import { NextRequest, NextResponse } from 'next/server';
import { Platform } from '@socialvault/shared/types';
import { validateSecureUrl } from '@socialvault/shared/security';
import { withRateLimit } from '../../../lib/rateLimitMiddleware';
import type { PlatformExtractor } from '@socialvault/shared/extractors';

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
 * POST /api/formats
 * Returns available formats and qualities for a given URL and platform
 */
async function formatsHandler(request: NextRequest) {
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

    // Get supported formats and qualities
    const formats = extractor.getSupportedFormats();
    const qualities = extractor.getSupportedQualities();

    // Return success response
    return NextResponse.json(
      {
        success: true,
        formats,
        qualities,
        platform,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/formats:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: `Failed to get formats: ${errorMessage}`,
          retryable: true,
        },
      },
      { status: 500 }
    );
  }
}

// Export with rate limiting middleware
export const POST = withRateLimit(formatsHandler);
