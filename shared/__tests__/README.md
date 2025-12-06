# Property-Based Testing with Fast-Check

This directory contains property-based tests and reusable test utilities for the SocialVault application.

## Overview

Property-based testing (PBT) is a testing methodology where you define properties that should hold true for all inputs, and the testing framework generates random inputs to verify those properties. We use [fast-check](https://github.com/dubzzz/fast-check) for property-based testing in TypeScript.

## Configuration

All property-based tests are configured to run with a **minimum of 100 iterations** as specified in the design document. This ensures thorough coverage of the input space.

## File Structure

```
__tests__/
├── README.md                    # This file
├── testUtils.ts                 # Main export point
├── testGenerators.ts            # Custom generators for all data types
├── fastCheckConfig.ts           # Configuration and helper functions
├── urlValidator.test.ts         # URL validation tests
├── platformDetector.test.ts     # Platform detection tests
├── metadataCompleteness.test.ts # Metadata tests
└── ...                          # Other test files
```

## Usage

### Basic Example

```typescript
import { fc, PBT_CONFIG, youtubeUrlArbitrary } from './testUtils';

describe('YouTube URL Processing', () => {
  it('should handle all YouTube URL formats', () => {
    fc.assert(
      fc.property(youtubeUrlArbitrary, (url) => {
        const result = processYouTubeUrl(url);
        return result !== null;
      }),
      PBT_CONFIG // Ensures 100 iterations
    );
  });
});
```

### Using Custom Generators

```typescript
import { 
  fc, 
  PBT_CONFIG,
  platformArbitrary,
  metadataArbitrary,
  socialMediaUrlArbitrary 
} from './testUtils';

describe('Metadata Extraction', () => {
  it('should extract metadata for any platform', () => {
    fc.assert(
      fc.property(
        platformArbitrary,
        socialMediaUrlArbitrary,
        (platform, url) => {
          const metadata = extractMetadata(url, platform);
          return metadata.title.length > 0;
        }
      ),
      PBT_CONFIG
    );
  });
});
```

### Async Properties

```typescript
import { fc, runAsyncProperty, youtubeUrlArbitrary } from './testUtils';

describe('Async Download', () => {
  it('should download content from any URL', async () => {
    await runAsyncProperty(
      fc.asyncProperty(youtubeUrlArbitrary, async (url) => {
        const result = await downloadContent(url);
        return result.success === true;
      })
    );
  });
});
```

## Available Generators

### Platform Generators

- `platformArbitrary` - All platforms including 'unknown'
- `supportedPlatformArbitrary` - Only supported platforms (excludes 'unknown')

### URL Generators

- `validUrlArbitrary` - Valid HTTP/HTTPS URLs
- `invalidUrlArbitrary` - Invalid URLs (empty, malformed, dangerous protocols)
- `socialMediaUrlArbitrary` - Any supported social media URL
- `youtubeUrlArbitrary` - YouTube URLs (watch, shorts, youtu.be)
- `instagramUrlArbitrary` - Instagram URLs (posts, reels, TV)
- `tiktokUrlArbitrary` - TikTok URLs (standard and short)
- `pinterestUrlArbitrary` - Pinterest pin URLs
- `twitterUrlArbitrary` - X/Twitter status URLs
- `facebookUrlArbitrary` - Facebook posts and videos
- `redditUrlArbitrary` - Reddit post URLs
- `linkedinUrlArbitrary` - LinkedIn posts and updates
- `platformSpecificUrlArbitrary(platform)` - URLs for a specific platform

### Metadata Generators

- `metadataArbitrary` - Complete content metadata
- `videoMetadataArbitrary` - Video metadata (with duration)
- `imageMetadataArbitrary` - Image metadata (without duration)

### Format and Quality Generators

- `formatArbitrary` - Download format options
- `qualityArbitrary` - Quality options (with availability)
- `availableQualityArbitrary` - Only available quality options

### Theme and UI Generators

- `themeArbitrary` - Theme modes ('light' or 'dark')
- `viewportArbitrary` - Any viewport dimensions
- `mobileViewportArbitrary` - Mobile viewport dimensions (320-639px)
- `tabletViewportArbitrary` - Tablet viewport dimensions (640-1023px)
- `desktopViewportArbitrary` - Desktop viewport dimensions (1024px+)

### Progress and Status Generators

- `progressArbitrary` - Progress values (0-100)
- `downloadStatusArbitrary` - Download status values

### Utility Generators

- `nonEmptyStringArbitrary` - Non-empty strings
- `emptyStringArbitrary` - Empty or whitespace strings
- `alphanumericArbitrary` - Alphanumeric strings
- `fileSizeArbitrary` - File sizes (1KB to 500MB)
- `timestampArbitrary` - Date timestamps

## Configuration Options

### Default Configuration

```typescript
import { PBT_CONFIG } from './testUtils';

// Uses 100 iterations (minimum required)
fc.assert(property, PBT_CONFIG);
```

### Thorough Testing

```typescript
import { THOROUGH_PBT_PARAMS } from './testUtils';

// Uses 500 iterations for critical components
fc.assert(property, THOROUGH_PBT_PARAMS);
```

### Quick Testing (Development)

```typescript
import { QUICK_PBT_PARAMS } from './testUtils';

// Uses 20 iterations for faster feedback during development
fc.assert(property, QUICK_PBT_PARAMS);
```

### Scenario-Specific Configuration

```typescript
import { TEST_SCENARIOS } from './testUtils';

// URL validation with 150 iterations
fc.assert(property, TEST_SCENARIOS.urlValidation);

// Security tests with 300 iterations
fc.assert(property, TEST_SCENARIOS.security);
```

## Reproducing Failures

When a property test fails, fast-check provides a seed value. Use it to reproduce the failure:

```typescript
import { withSeed, DEFAULT_PBT_PARAMS } from './testUtils';

// Reproduce a specific failure
fc.assert(property, withSeed(1234567890, DEFAULT_PBT_PARAMS));
```

## Debugging

Enable verbose output to see all generated values:

```typescript
import { withVerbose, DEFAULT_PBT_PARAMS } from './testUtils';

fc.assert(property, withVerbose(DEFAULT_PBT_PARAMS));
```

## Best Practices

1. **Always use PBT_CONFIG** - Ensures minimum 100 iterations
2. **Use specific generators** - Don't generate overly broad inputs
3. **Filter invalid inputs** - Use `.filter()` to exclude edge cases outside the domain
4. **Tag tests with property numbers** - Reference design document properties
5. **Test one property at a time** - Keep properties focused and simple
6. **Combine with unit tests** - Use both property tests and example-based tests

## Property Test Format

All property tests should follow this format:

```typescript
/**
 * Feature: social-media-downloader, Property X: Property Name
 * Validates: Requirements X.Y
 * 
 * Description of what the property tests.
 */
it('should satisfy property X', () => {
  fc.assert(
    fc.property(
      // generators
      (generatedValues) => {
        // test logic
        return assertion;
      }
    ),
    PBT_CONFIG
  );
});
```

## Common Patterns

### Testing URL Validation

```typescript
fc.assert(
  fc.property(validUrlArbitrary, (url) => {
    return validateURL(url) === true;
  }),
  PBT_CONFIG
);
```

### Testing Platform Detection

```typescript
fc.assert(
  fc.property(youtubeUrlArbitrary, (url) => {
    return detectPlatform(url) === 'youtube';
  }),
  PBT_CONFIG
);
```

### Testing Metadata Completeness

```typescript
fc.assert(
  fc.property(metadataArbitrary, (metadata) => {
    return (
      metadata.title.length > 0 &&
      metadata.author.length > 0 &&
      metadata.thumbnail.length > 0
    );
  }),
  PBT_CONFIG
);
```

### Testing UI Components

```typescript
fc.assert(
  fc.property(
    mobileViewportArbitrary,
    ({ width, height }) => {
      setViewportSize(width, height);
      const { container } = render(<Component />);
      return container.querySelector('.mobile-layout') !== null;
    }
  ),
  PBT_CONFIG
);
```

## Resources

- [fast-check Documentation](https://github.com/dubzzz/fast-check/tree/main/documentation)
- [Property-Based Testing Guide](https://github.com/dubzzz/fast-check/blob/main/documentation/Guides.md)
- [Design Document](../../.kiro/specs/social-media-downloader/design.md) - See Correctness Properties section
