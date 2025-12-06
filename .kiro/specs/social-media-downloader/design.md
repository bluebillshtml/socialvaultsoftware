# Design Document

## Overview

SocialVault is a full-stack social media downloader application that provides a unified interface for downloading public content from multiple platforms. The system consists of a Next.js-based web application with API routes for backend processing, an Expo-based mobile application, and a modular extraction engine that handles platform-specific content retrieval. The architecture emphasizes modularity, maintainability, and legal compliance while delivering a polished user experience that matches the reference design aesthetic.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────────────┐    ┌──────────────────────────┐  │
│  │   Next.js Web App    │    │   Expo Mobile App        │  │
│  │   (React + Tailwind) │    │   (React Native)         │  │
│  └──────────────────────┘    └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer (Next.js)                     │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  /api/detect     - Platform detection                │  │
│  │  /api/metadata   - Fetch content metadata            │  │
│  │  /api/download   - Process download requests         │  │
│  │  /api/formats    - Get available formats/qualities   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Business Logic Layer                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Platform Detector    - URL pattern matching         │  │
│  │  Metadata Extractor   - Content info retrieval       │  │
│  │  Download Engine      - Content download orchestration│ │
│  │  Format Converter     - Quality/format conversion    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  Platform Extractors Layer                   │
│  ┌────────┬────────┬────────┬────────┬────────┬────────┐  │
│  │YouTube │Instagram│TikTok │Pinterest│   X   │Facebook│  │
│  ├────────┼────────┼────────┼────────┼────────┼────────┤  │
│  │ Reddit │LinkedIn│ Future │ Future │ Future │ Future │  │
│  └────────┴────────┴────────┴────────┴────────┴────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend (Web):**
- Next.js 14+ (App Router)
- React 18+
- TypeScript
- TailwindCSS
- Framer Motion (animations)
- Lucide React (icons)

**Frontend (Mobile):**
- Expo SDK 50+
- React Native
- TypeScript
- NativeWind (Tailwind for React Native)
- React Native Reanimated

**Backend:**
- Next.js API Routes
- Node.js runtime
- TypeScript

**Download Libraries:**
- ytdl-core (YouTube)
- instagram-url-direct (Instagram)
- @tobyg74/tiktok-api-dl (TikTok)
- axios (HTTP requests)
- cheerio (HTML parsing for fallback scraping)

**Storage & Caching:**
- File system (temporary downloads)
- Optional: Supabase Storage for caching metadata

## Components and Interfaces

### Frontend Components (Web)

#### 1. Layout Component
```typescript
interface LayoutProps {
  children: React.ReactNode;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
}
```
- Provides consistent header, footer, and theme wrapper
- Manages global theme state
- Applies background gradients and effects

#### 2. InputBar Component
```typescript
interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  error?: string;
}
```
- Styled input field matching reference design
- Auto-focus on mount
- Paste detection and validation
- Loading state with animated indicator

#### 3. PlatformBadge Component
```typescript
interface PlatformBadgeProps {
  platform: Platform;
  animated?: boolean;
}

type Platform = 'youtube' | 'instagram' | 'tiktok' | 'pinterest' | 
                'twitter' | 'facebook' | 'reddit' | 'linkedin' | 'unknown';
```
- Displays platform icon and name
- Color-coded by platform
- Fade-in animation

#### 4. MetadataCard Component
```typescript
interface MetadataCardProps {
  title: string;
  thumbnail: string;
  author: string;
  duration?: string;
  platform: Platform;
}
```
- Glass-morphism card design
- Thumbnail with lazy loading
- Metadata display with icons
- Hover effects

#### 5. DownloadOptions Component
```typescript
interface DownloadOptionsProps {
  formats: DownloadFormat[];
  qualities: Quality[];
  onDownload: (format: string, quality: string) => void;
  isDownloading: boolean;
}

interface DownloadFormat {
  type: 'video' | 'audio' | 'image' | 'thumbnail';
  label: string;
  icon: string;
}

interface Quality {
  value: string;
  label: string;
  available: boolean;
}
```
- Grid layout for format options
- Quality selector dropdown
- Download button with progress
- Disabled states for unavailable options

#### 6. ProgressIndicator Component
```typescript
interface ProgressIndicatorProps {
  progress: number;
  status: 'idle' | 'fetching' | 'downloading' | 'complete' | 'error';
  message?: string;
}
```
- Animated progress bar
- Status messages
- Success/error states with icons

#### 7. ThemeToggle Component
```typescript
interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}
```
- Animated toggle switch
- Sun/moon icons
- Smooth transition

### Frontend Components (Mobile)

Mobile components mirror web components but use React Native primitives:
- `View` instead of `div`
- `Text` instead of `span`
- `TextInput` instead of `input`
- `TouchableOpacity` instead of `button`
- NativeWind for styling

### Backend Interfaces

#### 1. Platform Detector
```typescript
interface PlatformDetector {
  detect(url: string): Platform | null;
  validate(url: string): boolean;
}
```

#### 2. Metadata Extractor
```typescript
interface ContentMetadata {
  title: string;
  thumbnail: string;
  author: string;
  duration?: number;
  platform: Platform;
  url: string;
  availableFormats: DownloadFormat[];
  availableQualities: Quality[];
}

interface MetadataExtractor {
  extract(url: string, platform: Platform): Promise<ContentMetadata>;
}
```

#### 3. Download Engine
```typescript
interface DownloadRequest {
  url: string;
  platform: Platform;
  format: 'video' | 'audio' | 'image' | 'thumbnail';
  quality?: string;
}

interface DownloadResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}

interface DownloadEngine {
  download(request: DownloadRequest): Promise<DownloadResponse>;
}
```

#### 4. Platform Extractors
```typescript
interface PlatformExtractor {
  platform: Platform;
  extractMetadata(url: string): Promise<ContentMetadata>;
  getDownloadUrl(url: string, format: string, quality?: string): Promise<string>;
  getSupportedFormats(): DownloadFormat[];
  getSupportedQualities(): Quality[];
}
```

## Data Models

### URL Pattern Model
```typescript
interface URLPattern {
  platform: Platform;
  patterns: RegExp[];
  examples: string[];
}
```

### Download Job Model
```typescript
interface DownloadJob {
  id: string;
  url: string;
  platform: Platform;
  format: string;
  quality?: string;
  status: 'pending' | 'processing' | 'complete' | 'failed';
  progress: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}
```

### Theme Configuration Model
```typescript
interface ThemeConfig {
  mode: 'light' | 'dark';
  colors: {
    background: string;
    foreground: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    error: string;
    success: string;
  };
  fonts: {
    primary: string;
    secondary: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: URL Validation Correctness
*For any* string input, the URL validator should correctly identify valid URLs and reject invalid ones, where valid URLs match standard URL format patterns.
**Validates: Requirements 1.1**

### Property 2: Platform Detection Accuracy
*For any* valid social media URL from supported platforms (YouTube, Instagram, TikTok, Pinterest, X, Facebook, Reddit, LinkedIn), the platform detector should correctly identify the source platform.
**Validates: Requirements 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**

### Property 3: Platform Badge Rendering
*For any* identified platform, the rendered UI should contain a platform badge component with the correct platform identifier.
**Validates: Requirements 1.3**

### Property 4: Invalid URL Error Handling
*For any* invalid URL input, the system should display an error message containing guidance text.
**Validates: Requirements 1.4**

### Property 5: Metadata Completeness
*For any* successfully fetched content, the metadata should include all required fields: title, thumbnail, author, and duration (for video content).
**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

### Property 6: Metadata Display Completeness
*For any* metadata object, the rendered preview card should display all metadata fields present in the object.
**Validates: Requirements 3.5**

### Property 7: Format Options Availability
*For any* content type, the download options should include all applicable format options (MP4 for video, MP3 for audio, image formats for images, thumbnail option when available).
**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

### Property 8: Carousel Image Completeness
*For any* content with multiple images in a carousel, the download options should include all images in the set.
**Validates: Requirements 4.5**

### Property 9: Quality Options Display
*For any* video content, the quality selector should display all available quality options that the content supports.
**Validates: Requirements 5.1, 5.2, 5.3, 5.4**

### Property 10: Quality Selection Respect
*For any* download request with a specified quality, the downloaded content should match the requested quality level.
**Validates: Requirements 5.5**

### Property 11: TikTok Watermark Removal
*For any* TikTok video URL, the download engine should attempt to fetch the watermark-free version first.
**Validates: Requirements 6.1**

### Property 12: TikTok Image Set Completeness
*For any* TikTok content with multiple images, the download should include all images in the set.
**Validates: Requirements 6.2**

### Property 13: Watermark Fallback Notification
*For any* TikTok download where watermark-free content is unavailable, the system should notify the user and offer the watermarked version as an alternative.
**Validates: Requirements 6.3**

### Property 14: Progress Updates During Download
*For any* active download, the progress indicator value should increase monotonically from 0 to 100 over time.
**Validates: Requirements 7.2**

### Property 15: Download Error Handling
*For any* failed download, the system should display an error message that includes a retry option.
**Validates: Requirements 7.4**

### Property 16: Multiple Download Tracking
*For any* set of concurrent downloads, each download should have its own independent progress indicator.
**Validates: Requirements 7.5**

### Property 17: Responsive Layout Adaptation
*For any* viewport width (desktop, tablet, mobile), the web app should render a layout appropriate for that screen size.
**Validates: Requirements 8.1, 8.2, 8.3**

### Property 18: Dynamic Viewport Response
*For any* viewport resize event, the layout should update to match the new viewport dimensions.
**Validates: Requirements 8.4**

### Property 19: PWA Offline Functionality
*For any* cached content, the PWA should be able to display that content when offline.
**Validates: Requirements 8.5**

### Property 20: Cross-Platform Feature Parity
*For any* feature available in the web app, the mobile app should provide equivalent functionality.
**Validates: Requirements 9.1**

### Property 21: Cross-Platform Theme Consistency
*For any* theme configuration, the web app and mobile app should use identical color values and styling.
**Validates: Requirements 9.2**

### Property 22: System Theme Detection
*For any* system theme preference (light or dark), the app should initialize with the matching theme on first load.
**Validates: Requirements 10.1**

### Property 23: Theme Toggle Correctness
*For any* theme toggle action, the app should switch between light and dark themes with corresponding color value changes.
**Validates: Requirements 10.2, 10.3**

### Property 24: Theme Persistence
*For any* theme selection, the preference should persist across app restarts and be restored on next launch.
**Validates: Requirements 10.4**

### Property 25: Public Endpoint Access Only
*For any* content extraction request, the download engine should not use authentication tokens or credentials.
**Validates: Requirements 11.1, 11.2, 11.3**

### Property 26: Rate Limit Compliance
*For any* sequence of rapid extraction requests, the system should throttle requests to respect platform rate limits.
**Validates: Requirements 11.4**

### Property 27: Extraction Error Handling
*For any* blocked or failed extraction attempt, the system should return a graceful error response without crashing.
**Validates: Requirements 11.5**

### Property 28: Animation Presence
*For any* UI element that appears, disappears, or changes state, the element should have animation classes or styles applied.
**Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

### Property 29: Design System Color Consistency
*For any* rendered component, the background colors, borders, and gradients should match the design system values (background: #05040A, borders: white/10, gradients: purple/blue/orange).
**Validates: Requirements 13.1, 13.2, 13.4, 13.5**

### Property 30: Design System Typography Consistency
*For any* text element, the font family should be either Geist or Jakarta Sans as specified in the design system.
**Validates: Requirements 13.3**

### Property 31: Design System Spacing Consistency
*For any* component layout, the spacing and border radius values should match the design system specifications.
**Validates: Requirements 13.6, 13.7**

## Error Handling

### Error Categories

1. **Input Validation Errors**
   - Invalid URL format
   - Unsupported platform
   - Empty input
   - Malformed URLs

2. **Network Errors**
   - Connection timeout
   - DNS resolution failure
   - SSL/TLS errors
   - Rate limiting (429)
   - Server errors (5xx)

3. **Content Extraction Errors**
   - Content not found (404)
   - Private/restricted content (403)
   - Platform API changes
   - Parsing failures
   - Missing metadata

4. **Download Errors**
   - Insufficient storage
   - File write failures
   - Corrupted downloads
   - Quality not available
   - Format conversion failures

5. **System Errors**
   - Out of memory
   - Process crashes
   - Dependency failures

### Error Handling Strategy

**Client-Side:**
- Display user-friendly error messages
- Provide actionable suggestions (e.g., "Check your internet connection")
- Offer retry mechanisms
- Log errors to console for debugging
- Graceful degradation (show partial data if available)

**Server-Side:**
- Structured error responses with error codes
- Detailed logging for debugging
- Retry logic with exponential backoff
- Fallback to alternative extraction methods
- Circuit breaker pattern for failing services

**Error Response Format:**
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    retryable: boolean;
  };
}
```

## Testing Strategy

### Unit Testing

**Framework:** Jest + React Testing Library (Web), Jest + React Native Testing Library (Mobile)

**Unit Test Coverage:**
- URL validation functions
- Platform detection logic
- Metadata parsing functions
- Format/quality selection logic
- Theme toggle functionality
- Component rendering (snapshots)
- Utility functions (URL parsing, format conversion)

**Example Unit Tests:**
- Test that `validateURL()` returns true for valid URLs
- Test that `detectPlatform()` returns 'youtube' for YouTube URLs
- Test that `MetadataCard` renders all provided metadata fields
- Test that `ThemeToggle` switches theme state on click

### Property-Based Testing

**Framework:** fast-check (JavaScript/TypeScript property-based testing library)

**Configuration:**
- Minimum 100 iterations per property test
- Use custom generators for URLs, metadata, and content types
- Tag each test with the corresponding design property number

**Property Test Requirements:**
- Each correctness property MUST be implemented as a SINGLE property-based test
- Each test MUST be tagged with: `**Feature: social-media-downloader, Property {number}: {property_text}**`
- Tests MUST use fast-check's `fc.assert()` with appropriate generators

**Example Property Tests:**
- Generate random valid/invalid URLs and test validation
- Generate URLs from all platforms and test detection accuracy
- Generate random metadata objects and test display completeness
- Generate random viewport sizes and test responsive behavior

### Integration Testing

**Framework:** Playwright (E2E testing)

**Integration Test Scenarios:**
- Full user flow: paste URL → view metadata → select format → download
- Theme switching across multiple pages
- Mobile app navigation and functionality
- API endpoint integration
- Error recovery flows

### Test Data

**Test URLs for Each Platform:**
```typescript
const TEST_URLS = {
  youtube: [
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ'
  ],
  instagram: [
    'https://www.instagram.com/p/ABC123/',
    'https://www.instagram.com/reel/XYZ789/'
  ],
  tiktok: [
    'https://www.tiktok.com/@user/video/1234567890',
    'https://vm.tiktok.com/ABC123/'
  ],
  // ... other platforms
};
```

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading**
   - Code splitting for platform extractors
   - Lazy load images and thumbnails
   - Dynamic imports for heavy dependencies

2. **Caching**
   - Cache metadata for recently accessed URLs (5-minute TTL)
   - Cache platform detection results
   - Service worker caching for PWA

3. **Streaming**
   - Stream large video downloads
   - Progressive metadata loading
   - Chunked file transfers

4. **Parallel Processing**
   - Concurrent metadata extraction for multiple URLs
   - Parallel quality option fetching
   - Multi-threaded download processing (where supported)

5. **Resource Management**
   - Cleanup temporary files after download
   - Limit concurrent downloads (max 3)
   - Memory-efficient video processing

### Performance Targets

- Initial page load: < 2 seconds
- Platform detection: < 100ms
- Metadata fetch: < 3 seconds
- Download initiation: < 1 second
- UI interactions: < 100ms response time

## Security Considerations

### Input Sanitization
- Validate and sanitize all URL inputs
- Prevent XSS through proper escaping
- Limit URL length (max 2048 characters)
- Block file:// and javascript: protocols

### Rate Limiting
- Client-side: Max 10 requests per minute per user
- Server-side: Max 100 requests per hour per IP
- Implement exponential backoff for retries

### Content Security
- Validate downloaded file types
- Scan for malicious content (if possible)
- Limit file sizes (max 500MB)
- Use HTTPS for all external requests

### Data Privacy
- No user authentication required
- No personal data collection
- No tracking or analytics (optional)
- Temporary file cleanup after download

## Deployment Strategy

### Web Application
- Deploy to Vercel or Netlify
- Environment variables for API keys (if needed)
- CDN for static assets
- Automatic HTTPS

### Mobile Application
- Build with EAS (Expo Application Services)
- Deploy to App Store and Google Play
- Over-the-air updates for non-native changes
- Separate staging and production builds

### CI/CD Pipeline
- Automated testing on pull requests
- Linting and type checking
- Build verification
- Automated deployment on merge to main

## Future Enhancements

1. **Additional Platforms**
   - Vimeo
   - Dailymotion
   - Twitch clips
   - Snapchat Spotlight

2. **Advanced Features**
   - Batch downloads (multiple URLs)
   - Playlist/album downloads
   - Subtitle downloads
   - Video trimming/editing
   - Format conversion options

3. **User Features**
   - Download history
   - Favorites/bookmarks
   - Custom quality presets
   - Scheduled downloads

4. **Technical Improvements**
   - WebAssembly for faster processing
   - P2P download acceleration
   - Advanced caching strategies
   - Real-time collaboration features
