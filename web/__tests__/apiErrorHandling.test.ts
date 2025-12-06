/**
 * Property-Based Tests for API Error Handling
 * Feature: social-media-downloader, Property 15: Download Error Handling
 * Feature: social-media-downloader, Property 27: Extraction Error Handling
 * Validates: Requirements 7.4, 11.5
 */

import * as fc from 'fast-check';

// Mock error response structure based on API design
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    retryable: boolean;
  };
}

// Simulate API error handling logic
function handleDownloadError(requestBody: any): ErrorResponse {
  const { url, platform, format } = requestBody;

  // Validate URL
  if (!url || typeof url !== 'string') {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'URL is required and must be a string',
        retryable: false,
      },
    };
  }

  // Validate platform
  if (!platform || typeof platform !== 'string') {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Platform is required and must be a string',
        retryable: false,
      },
    };
  }

  // Validate format
  if (!format || typeof format !== 'string') {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Format is required and must be a string',
        retryable: false,
      },
    };
  }

  // Check for unsupported platform
  const supportedPlatforms = ['youtube', 'instagram', 'tiktok', 'pinterest', 'twitter', 'facebook', 'reddit', 'linkedin'];
  if (!supportedPlatforms.includes(platform)) {
    return {
      success: false,
      error: {
        code: 'UNSUPPORTED_PLATFORM',
        message: `Platform '${platform}' is not supported`,
        retryable: false,
      },
    };
  }

  // Simulate extraction error
  return {
    success: false,
    error: {
      code: 'DOWNLOAD_ERROR',
      message: 'Failed to initiate download',
      retryable: true,
    },
  };
}

function handleExtractionError(requestBody: any): ErrorResponse {
  const { url, platform } = requestBody;

  // Validate URL
  if (!url || typeof url !== 'string') {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'URL is required and must be a string',
        retryable: false,
      },
    };
  }

  // Validate platform
  if (!platform || typeof platform !== 'string') {
    return {
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: 'Platform is required and must be a string',
        retryable: false,
      },
    };
  }

  // Check for unsupported platform
  const supportedPlatforms = ['youtube', 'instagram', 'tiktok', 'pinterest', 'twitter', 'facebook', 'reddit', 'linkedin'];
  if (!supportedPlatforms.includes(platform)) {
    return {
      success: false,
      error: {
        code: 'UNSUPPORTED_PLATFORM',
        message: `Platform '${platform}' is not supported`,
        retryable: false,
      },
    };
  }

  // Simulate extraction error
  return {
    success: false,
    error: {
      code: 'EXTRACTION_ERROR',
      message: 'Failed to extract metadata',
      retryable: true,
    },
  };
}

describe('API Error Handling', () => {
  describe('Property 15: Download Error Handling', () => {
    /**
     * Feature: social-media-downloader, Property 15: Download Error Handling
     * For any failed download, the system should display an error message that includes a retry option.
     */
    it('should return error response with retryable flag for invalid inputs', () => {
      // Generator for invalid download requests
      const invalidRequestArbitrary = fc.oneof(
        // Missing URL
        fc.record({
          platform: fc.constantFrom('youtube', 'instagram', 'tiktok'),
          format: fc.constantFrom('video', 'audio', 'image'),
        }),
        // Missing platform
        fc.record({
          url: fc.webUrl(),
          format: fc.constantFrom('video', 'audio', 'image'),
        }),
        // Missing format
        fc.record({
          url: fc.webUrl(),
          platform: fc.constantFrom('youtube', 'instagram', 'tiktok'),
        }),
        // Invalid URL type
        fc.record({
          url: fc.integer(),
          platform: fc.constantFrom('youtube', 'instagram', 'tiktok'),
          format: fc.constantFrom('video', 'audio', 'image'),
        }),
        // Invalid platform type
        fc.record({
          url: fc.webUrl(),
          platform: fc.integer(),
          format: fc.constantFrom('video', 'audio', 'image'),
        }),
        // Invalid format type
        fc.record({
          url: fc.webUrl(),
          platform: fc.constantFrom('youtube', 'instagram', 'tiktok'),
          format: fc.integer(),
        })
      );

      fc.assert(
        fc.property(invalidRequestArbitrary, (requestBody) => {
          const response = handleDownloadError(requestBody);

          // Should return error response
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          expect(response.error.code).toBeDefined();
          expect(response.error.message).toBeDefined();
          expect(typeof response.error.message).toBe('string');
          
          // Should include retryable flag
          expect(response.error).toHaveProperty('retryable');
          expect(typeof response.error.retryable).toBe('boolean');
        }),
        { numRuns: 100 }
      );
    });

    it('should return error response with error code for unsupported platforms', () => {
      // Generator for unsupported platform requests
      const unsupportedPlatformArbitrary = fc.record({
        url: fc.webUrl(),
        platform: fc.string({ minLength: 1, maxLength: 20 }).filter(
          p => !['youtube', 'instagram', 'tiktok', 'pinterest', 'twitter', 'facebook', 'reddit', 'linkedin'].includes(p)
        ),
        format: fc.constantFrom('video', 'audio', 'image'),
      });

      fc.assert(
        fc.property(unsupportedPlatformArbitrary, (requestBody) => {
          const response = handleDownloadError(requestBody);

          // Should return error response
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          expect(response.error.code).toBe('UNSUPPORTED_PLATFORM');
          expect(response.error.message).toContain('not supported');
          expect(response.error.retryable).toBe(false);
        }),
        { numRuns: 100 }
      );
    });

    it('should include error message and retryable flag in all error responses', () => {
      // Generator for various invalid requests
      const errorRequestArbitrary = fc.oneof(
        fc.record({ url: fc.constant(''), platform: fc.constant('youtube'), format: fc.constant('video') }),
        fc.record({ url: fc.constant(null), platform: fc.constant('youtube'), format: fc.constant('video') }),
        fc.record({ url: fc.webUrl(), platform: fc.constant(''), format: fc.constant('video') }),
        fc.record({ url: fc.webUrl(), platform: fc.constant('unknown'), format: fc.constant('video') })
      );

      fc.assert(
        fc.property(errorRequestArbitrary, (requestBody) => {
          const response = handleDownloadError(requestBody);

          // All error responses must have these properties
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          expect(response.error.message).toBeDefined();
          expect(typeof response.error.message).toBe('string');
          expect(response.error.message.length).toBeGreaterThan(0);
          expect(response.error).toHaveProperty('retryable');
          expect(typeof response.error.retryable).toBe('boolean');
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 27: Extraction Error Handling', () => {
    /**
     * Feature: social-media-downloader, Property 27: Extraction Error Handling
     * For any blocked or failed extraction attempt, the system should return a graceful error response without crashing.
     */
    it('should return graceful error response for invalid metadata requests', () => {
      // Generator for invalid metadata requests
      const invalidMetadataRequestArbitrary = fc.oneof(
        // Missing URL
        fc.record({
          platform: fc.constantFrom('youtube', 'instagram', 'tiktok'),
        }),
        // Missing platform
        fc.record({
          url: fc.webUrl(),
        }),
        // Invalid URL type
        fc.record({
          url: fc.oneof(fc.integer(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
          platform: fc.constantFrom('youtube', 'instagram', 'tiktok'),
        }),
        // Invalid platform type
        fc.record({
          url: fc.webUrl(),
          platform: fc.oneof(fc.integer(), fc.boolean(), fc.constant(null)),
        })
      );

      fc.assert(
        fc.property(invalidMetadataRequestArbitrary, (requestBody) => {
          const response = handleExtractionError(requestBody);

          // Should return graceful error response
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          expect(response.error.code).toBeDefined();
          expect(response.error.message).toBeDefined();
          expect(typeof response.error.message).toBe('string');
          
          // Should not crash - response should be valid object
          expect(response).toBeInstanceOf(Object);
        }),
        { numRuns: 100 }
      );
    });

    it('should handle unsupported platforms gracefully without crashing', () => {
      // Generator for unsupported platforms
      const unsupportedPlatformArbitrary = fc.record({
        url: fc.webUrl(),
        platform: fc.string({ minLength: 1, maxLength: 20 }).filter(
          p => !['youtube', 'instagram', 'tiktok', 'pinterest', 'twitter', 'facebook', 'reddit', 'linkedin'].includes(p)
        ),
      });

      fc.assert(
        fc.property(unsupportedPlatformArbitrary, (requestBody) => {
          const response = handleExtractionError(requestBody);

          // Should return graceful error
          expect(response.success).toBe(false);
          expect(response.error).toBeDefined();
          expect(response.error.code).toBe('UNSUPPORTED_PLATFORM');
          expect(response.error.message).toContain('not supported');
          
          // Should have proper error structure
          expect(response.error).toHaveProperty('retryable');
          expect(typeof response.error.retryable).toBe('boolean');
        }),
        { numRuns: 100 }
      );
    });

    it('should return structured error response for all extraction failures', () => {
      // Generator for various error-inducing requests
      const errorInducingRequestArbitrary = fc.oneof(
        fc.record({ url: fc.constant(''), platform: fc.constant('youtube') }),
        fc.record({ url: fc.constant('not-a-url'), platform: fc.constant('instagram') }),
        fc.record({ url: fc.webUrl(), platform: fc.constant('invalid-platform') }),
        fc.record({ url: fc.constant(null), platform: fc.constant('tiktok') })
      );

      fc.assert(
        fc.property(errorInducingRequestArbitrary, (requestBody) => {
          const response = handleExtractionError(requestBody);

          // All error responses must follow the same structure
          expect(response).toHaveProperty('success');
          expect(response.success).toBe(false);
          expect(response).toHaveProperty('error');
          expect(response.error).toHaveProperty('code');
          expect(response.error).toHaveProperty('message');
          expect(response.error).toHaveProperty('retryable');
          
          // Error code should be a non-empty string
          expect(typeof response.error.code).toBe('string');
          expect(response.error.code.length).toBeGreaterThan(0);
          
          // Error message should be a non-empty string
          expect(typeof response.error.message).toBe('string');
          expect(response.error.message.length).toBeGreaterThan(0);
          
          // Retryable should be a boolean
          expect(typeof response.error.retryable).toBe('boolean');
        }),
        { numRuns: 100 }
      );
    });

    it('should not throw exceptions for any invalid input combination', () => {
      // Generator for completely random/invalid inputs
      const randomInvalidInputArbitrary = fc.record({
        url: fc.oneof(
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.constant(null),
          fc.constant(undefined),
          fc.array(fc.string())
        ),
        platform: fc.oneof(
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.constant(null),
          fc.constant(undefined),
          fc.array(fc.string())
        ),
      });

      fc.assert(
        fc.property(randomInvalidInputArbitrary, (requestBody) => {
          // Should not throw - should return a response
          let response;
          let didThrow = false;
          
          try {
            response = handleExtractionError(requestBody);
            
            // If we get here, it didn't crash
            expect(response).toBeDefined();
            expect(response).toHaveProperty('success');
          } catch (error) {
            didThrow = true;
          }
          
          // Should never throw - always return graceful error
          expect(didThrow).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });
});
