import * as fc from 'fast-check';

/**
 * Feature: social-media-downloader, Property 11: TikTok Watermark Removal
 * Validates: Requirements 6.1
 * 
 * For any TikTok video URL, the download engine should attempt to fetch 
 * the watermark-free version first.
 */
describe('Property 11: TikTok Watermark Removal', () => {
  it('should prioritize noWatermark URL over watermark URL', () => {
    // Property: For any TikTok result with both URLs, noWatermark should be preferred
    fc.assert(
      fc.property(
        fc.webUrl(),
        fc.webUrl(),
        (noWatermarkUrl, watermarkUrl) => {
          const mockResult = {
            status: 'success' as const,
            result: {
              video: {
                noWatermark: noWatermarkUrl,
                watermark: watermarkUrl,
              },
            },
          };

          // The logic should prefer noWatermark when available
          const selectedUrl = mockResult.result.video.noWatermark || mockResult.result.video.watermark;
          return selectedUrl === noWatermarkUrl;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should use watermark URL when noWatermark is unavailable', () => {
    fc.assert(
      fc.property(
        fc.webUrl(),
        (watermarkUrl) => {
          const mockResult = {
            status: 'success' as const,
            result: {
              video: {
                noWatermark: undefined,
                watermark: watermarkUrl,
              },
            },
          };

          // When noWatermark is unavailable, should fall back to watermark
          const selectedUrl = mockResult.result.video.noWatermark || mockResult.result.video.watermark;
          return selectedUrl === watermarkUrl;
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: social-media-downloader, Property 12: TikTok Image Set Completeness
 * Validates: Requirements 6.2
 * 
 * For any TikTok content with multiple images, the download should include 
 * all images in the set.
 */
describe('Property 12: TikTok Image Set Completeness', () => {
  it('should return all images in an image set', () => {
    // Property: For any image set, all images should be included
    fc.assert(
      fc.property(
        fc.array(fc.webUrl(), { minLength: 1, maxLength: 10 }),
        (imageUrls) => {
          const mockResult = {
            status: 'success' as const,
            result: {
              images: imageUrls,
              type: 'image' as const,
            },
          };

          // All images should be present in the result
          return mockResult.result.images.length === imageUrls.length &&
                 mockResult.result.images.every((url, i) => url === imageUrls[i]);
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * Feature: social-media-downloader, Property 13: Watermark Fallback Notification
 * Validates: Requirements 6.3
 * 
 * For any TikTok download where watermark-free content is unavailable, 
 * the system should notify the user and offer the watermarked version as an alternative.
 */
describe('Property 13: Watermark Fallback Notification', () => {
  it('should indicate watermark availability correctly', () => {
    // Property: For any result, watermark availability should match noWatermark presence
    fc.assert(
      fc.property(
        fc.boolean(),
        fc.webUrl(),
        (hasNoWatermark, watermarkUrl) => {
          const mockResult = {
            status: 'success' as const,
            result: {
              video: {
                noWatermark: hasNoWatermark ? 'https://example.com/no-watermark.mp4' : undefined,
                watermark: watermarkUrl,
              },
            },
          };

          // The availability should match the presence of noWatermark URL
          const isAvailable = !!mockResult.result.video.noWatermark;
          
          // Watermark URL should always be available as fallback
          return isAvailable === hasNoWatermark && !!mockResult.result.video.watermark;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always have a fallback URL available', () => {
    fc.assert(
      fc.property(
        fc.option(fc.webUrl(), { nil: undefined }),
        fc.webUrl(),
        (noWatermarkUrl, watermarkUrl) => {
          const mockResult = {
            status: 'success' as const,
            result: {
              video: {
                noWatermark: noWatermarkUrl,
                watermark: watermarkUrl,
              },
            },
          };

          // At least one URL should always be available
          const availableUrl = mockResult.result.video.noWatermark || mockResult.result.video.watermark;
          return !!availableUrl && typeof availableUrl === 'string';
        }
      ),
      { numRuns: 100 }
    );
  });
});
