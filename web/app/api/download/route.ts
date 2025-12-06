import { NextRequest, NextResponse } from 'next/server';
import { Platform } from '@socialvault/shared/types';
import { validateSecureUrl, sanitizeFilename } from '@socialvault/shared/security';
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
 * Generate a safe filename from title and format
 */
function generateFilename(title: string, format: string): string {
  const sanitized = title
    .replace(/[<>:"/\\|?*]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 100);

  const extension = format === 'video' ? 'mp4' : format === 'audio' ? 'mp3' : 'jpg';
  return `${sanitized}.${extension}`;
}

/**
 * POST /api/download
 * Initiates a download for a given URL, platform, format, and quality
 */
async function downloadHandler(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, platform, format, quality } = body;

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

    if (!format || typeof format !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_INPUT',
            message: 'Format is required and must be a string',
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

    // Get download URL
    const downloadUrl = await extractor.getDownloadUrl(sanitizedUrl, format, quality);

    // Get metadata for filename
    const metadata = await extractor.extractMetadata(sanitizedUrl);
    const unsafeFilename = generateFilename(metadata.title, format);
    const filename = sanitizeFilename(unsafeFilename);

    // Return download URL and filename
    // Note: In a production app, you might want to stream the file directly
    // or implement server-side downloading with progress tracking
    return NextResponse.json(
      {
        success: true,
        downloadUrl,
        filename,
        metadata: {
          title: metadata.title,
          platform: metadata.platform,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in /api/download:', error);

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Determine error type and appropriate response
    let errorCode = 'DOWNLOAD_ERROR';
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
    } else if (errorMessage.includes('timeout') || errorMessage.includes('ETIMEDOUT') || errorMessage.includes('ECONNREFUSED')) {
      errorCode = 'NETWORK_TIMEOUT';
      statusCode = 504;
      retryable = true;
    } else if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
      errorCode = 'RATE_LIMITED';
      statusCode = 429;
      retryable = true;
    } else if (errorMessage.includes('quality') || errorMessage.includes('format')) {
      errorCode = 'INVALID_FORMAT';
      statusCode = 400;
      retryable = false;
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: errorCode,
          message: `Failed to initiate download: ${errorMessage}`,
          retryable,
        },
      },
      { status: statusCode }
    );
  }
}

// Export with rate limiting middleware
export const POST = withRateLimit(downloadHandler);
