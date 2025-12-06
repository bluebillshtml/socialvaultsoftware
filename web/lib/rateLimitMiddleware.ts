import { NextRequest, NextResponse } from 'next/server';
import { serverRateLimiter } from '@socialvault/shared/rateLimiter';

/**
 * Get client IP from request
 */
function getClientIp(request: NextRequest): string {
  // Try various headers for IP address
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback to a default identifier
  return 'unknown';
}

/**
 * Rate limit middleware for API routes
 */
export function withRateLimit(
  handler: (request: NextRequest) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const ip = getClientIp(request);

    // Check rate limit
    if (!serverRateLimiter.isAllowed(ip)) {
      const retryAfter = Math.ceil(serverRateLimiter.getRetryAfter(ip) / 1000);

      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many requests. Please try again later.',
            retryable: true,
            retryAfter,
          },
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Remaining': '0',
          },
        }
      );
    }

    // Add rate limit headers
    const remaining = serverRateLimiter.getRemaining(ip);
    const response = await handler(request);

    response.headers.set('X-RateLimit-Remaining', remaining.toString());

    return response;
  };
}
