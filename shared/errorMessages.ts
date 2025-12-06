/**
 * Error message utilities for user-friendly error feedback
 * Implements Requirements 1.4, 7.4 - clear error messages with actionable suggestions
 */

export interface ErrorDetails {
  code: string;
  message: string;
  retryable: boolean;
  suggestions?: string[];
}

/**
 * Get user-friendly error message and suggestions based on error code
 */
export function getUserFriendlyError(errorCode: string, originalMessage?: string): ErrorDetails {
  switch (errorCode) {
    case 'INVALID_URL':
      return {
        code: errorCode,
        message: 'Invalid URL format. Please enter a valid social media URL.',
        retryable: false,
        suggestions: [
          'Make sure the URL starts with http:// or https://',
          'Check for typos in the URL',
          'Try copying the URL directly from your browser',
        ],
      };

    case 'UNSUPPORTED_PLATFORM':
      return {
        code: errorCode,
        message: 'This platform is not supported yet.',
        retryable: false,
        suggestions: [
          'We currently support YouTube, Instagram, TikTok, Pinterest, X, Facebook, Reddit, and LinkedIn',
          'Check if you pasted the correct URL',
        ],
      };

    case 'CONTENT_NOT_FOUND':
      return {
        code: errorCode,
        message: 'Content not found. The content may have been removed or the URL is incorrect.',
        retryable: false,
        suggestions: [
          'Verify the URL is correct',
          'Check if the content still exists on the platform',
          'Try accessing the content directly in your browser',
        ],
      };

    case 'PRIVATE_CONTENT':
      return {
        code: errorCode,
        message: 'This content is private or restricted. We can only download public content.',
        retryable: false,
        suggestions: [
          'Make sure the content is set to public',
          'Try logging into the platform and checking the privacy settings',
          'Some platforms require authentication which we do not support',
        ],
      };

    case 'RATE_LIMITED':
      return {
        code: errorCode,
        message: 'Rate limit exceeded. Please wait a moment and try again.',
        retryable: true,
        suggestions: [
          'Wait 1-2 minutes before trying again',
          'Avoid making too many requests in a short time',
          'The platform may be temporarily blocking requests',
        ],
      };

    case 'NETWORK_TIMEOUT':
      return {
        code: errorCode,
        message: 'Request timed out. Please check your connection and try again.',
        retryable: true,
        suggestions: [
          'Check your internet connection',
          'Try again in a few moments',
          'The platform may be experiencing issues',
        ],
      };

    case 'EXTRACTION_ERROR':
      return {
        code: errorCode,
        message: originalMessage || 'Failed to extract content information.',
        retryable: true,
        suggestions: [
          'Try again in a few moments',
          'The platform may have changed their format',
          'Check if the content is still available',
        ],
      };

    case 'DOWNLOAD_ERROR':
      return {
        code: errorCode,
        message: originalMessage || 'Failed to download content.',
        retryable: true,
        suggestions: [
          'Try again in a few moments',
          'Check your internet connection',
          'Try a different quality or format',
        ],
      };

    case 'INVALID_FORMAT':
      return {
        code: errorCode,
        message: 'The requested format or quality is not available for this content.',
        retryable: false,
        suggestions: [
          'Try a different quality option',
          'Try a different format (video, audio, image)',
          'Some content may not support all formats',
        ],
      };

    case 'SECURITY_ERROR':
      return {
        code: errorCode,
        message: originalMessage || 'URL failed security validation.',
        retryable: false,
        suggestions: [
          'Make sure the URL is from a trusted source',
          'Avoid URLs with suspicious characters',
          'Use the official platform URL',
        ],
      };

    case 'INTERNAL_ERROR':
    default:
      return {
        code: errorCode,
        message: originalMessage || 'An unexpected error occurred. Please try again.',
        retryable: true,
        suggestions: [
          'Try again in a few moments',
          'Refresh the page',
          'Contact support if the issue persists',
        ],
      };
  }
}

/**
 * Format error for display in UI
 */
export function formatErrorForDisplay(error: any): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error?.error?.message) {
    return error.error.message;
  }

  if (error?.message) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Check if an error is retryable
 */
export function isErrorRetryable(error: any): boolean {
  if (error?.error?.retryable !== undefined) {
    return error.error.retryable;
  }

  // Default to retryable for network-related errors
  const errorMessage = formatErrorForDisplay(error).toLowerCase();
  return (
    errorMessage.includes('timeout') ||
    errorMessage.includes('network') ||
    errorMessage.includes('connection') ||
    errorMessage.includes('rate limit')
  );
}
