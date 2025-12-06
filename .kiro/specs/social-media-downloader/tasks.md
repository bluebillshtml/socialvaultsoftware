# Implementation Plan

- [x] 1. Set up project structure and dependencies





  - Create Next.js project with TypeScript and App Router
  - Create Expo project with TypeScript
  - Install TailwindCSS and configure for both projects
  - Install Framer Motion (web) and React Native Reanimated (mobile)
  - Install download libraries (ytdl-core, instagram-url-direct, @tobyg74/tiktok-api-dl, axios, cheerio)
  - Install fast-check for property-based testing
  - Set up shared types package for cross-platform type definitions
  - Configure ESLint and Prettier
  - _Requirements: All_

- [x] 2. Implement core utility functions and platform detection





  - [x] 2.1 Create URL validation utility


    - Write `validateURL()` function with regex patterns
    - Handle edge cases (empty strings, malformed URLs, special protocols)
    - _Requirements: 1.1_


  - [x] 2.2 Write property test for URL validation

    - **Property 1: URL Validation Correctness**
    - **Validates: Requirements 1.1**

  - [x] 2.3 Create platform detector module


    - Define URL patterns for all 8 platforms (YouTube, Instagram, TikTok, Pinterest, X, Facebook, Reddit, LinkedIn)
    - Implement `detectPlatform()` function
    - Create platform type definitions
    - _Requirements: 1.2, 2.1-2.8_

  - [x] 2.4 Write property test for platform detection


    - **Property 2: Platform Detection Accuracy**
    - **Validates: Requirements 1.2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8**

- [x] 3. Create design system and theme configuration




  - [x] 3.1 Define theme configuration


    - Create dark theme with colors from reference (#05040A background, white/10 borders)
    - Create light theme variant
    - Define typography (Geist, Jakarta Sans)
    - Define spacing and border radius scales
    - _Requirements: 13.1-13.7_


  - [x] 3.2 Set up TailwindCSS configuration

    - Configure custom colors matching reference design
    - Add custom fonts (Geist, Jakarta Sans)
    - Configure backdrop blur and glass-morphism utilities
    - Add custom gradient utilities (purple, blue, orange)
    - _Requirements: 13.1-13.7_


  - [x] 3.3 Create theme context and provider

    - Implement theme state management
    - Add system theme detection
    - Add theme persistence to localStorage
    - _Requirements: 10.1, 10.4_


  - [x] 3.4 Write property tests for theme system

    - **Property 22: System Theme Detection**
    - **Property 23: Theme Toggle Correctness**
    - **Property 24: Theme Persistence**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**


  - [x] 3.5 Write property tests for design system consistency

    - **Property 29: Design System Color Consistency**
    - **Property 30: Design System Typography Consistency**
    - **Property 31: Design System Spacing Consistency**
    - **Validates: Requirements 13.1-13.7**

- [x] 4. Build web UI components





  - [x] 4.1 Create Layout component


    - Implement header with logo and theme toggle
    - Add background gradient effects matching reference
    - Create footer
    - _Requirements: 13.1-13.7_

  - [x] 4.2 Create ThemeToggle component


    - Implement toggle switch with sun/moon icons
    - Add smooth transition animations
    - _Requirements: 10.2, 10.3, 12.1_

  - [x] 4.3 Create InputBar component


    - Style input field with glass-morphism effect
    - Add paste detection
    - Implement loading state
    - Add error display
    - _Requirements: 1.1, 1.4, 1.5_

  - [x] 4.4 Write property test for input validation UI


    - **Property 4: Invalid URL Error Handling**
    - **Validates: Requirements 1.4**

  - [x] 4.5 Create PlatformBadge component


    - Design badge with platform icon and name
    - Add color coding for each platform
    - Implement fade-in animation
    - _Requirements: 1.3, 12.1_

  - [x] 4.6 Write property test for platform badge rendering


    - **Property 3: Platform Badge Rendering**
    - **Validates: Requirements 1.3**

  - [x] 4.7 Create MetadataCard component


    - Design glass-morphism card matching reference
    - Add thumbnail with lazy loading
    - Display title, author, duration with icons
    - Add hover effects
    - _Requirements: 3.5, 12.2, 13.2_

  - [x] 4.8 Write property test for metadata display


    - **Property 6: Metadata Display Completeness**
    - **Validates: Requirements 3.5**

  - [x] 4.9 Create DownloadOptions component


    - Design grid layout for format options
    - Create quality selector dropdown
    - Add download button with loading state
    - Implement disabled states
    - _Requirements: 4.1-4.5, 5.1-5.4_

  - [x] 4.10 Write property tests for download options


    - **Property 7: Format Options Availability**
    - **Property 9: Quality Options Display**
    - **Validates: Requirements 4.1, 4.2, 4.3, 4.4, 5.1, 5.2, 5.3, 5.4**

  - [x] 4.11 Create ProgressIndicator component


    - Design animated progress bar
    - Add status messages
    - Implement success/error states with icons
    - _Requirements: 7.1-7.5, 12.4_

  - [x] 4.12 Write property tests for progress tracking


    - **Property 14: Progress Updates During Download**
    - **Property 16: Multiple Download Tracking**
    - **Validates: Requirements 7.2, 7.5**

- [ ] 5. Implement platform extractors





  - [x] 5.1 Create base extractor interface


    - Define `PlatformExtractor` interface
    - Create abstract base class with common functionality
    - _Requirements: 3.1-3.4_


  - [x] 5.2 Implement YouTube extractor

    - Use ytdl-core library
    - Extract metadata (title, thumbnail, author, duration)
    - Get available formats and qualities
    - Implement download URL generation
    - _Requirements: 2.1, 3.1-3.4, 4.1, 4.2, 5.1-5.5_



  - [x] 5.3 Implement Instagram extractor

    - Use instagram-url-direct library
    - Handle posts, reels, and carousels
    - Extract metadata
    - Support image and video downloads


    - _Requirements: 2.2, 3.1-3.4, 4.1, 4.3, 4.5_


  - [-] 5.4 Implement TikTok extractor



    - Use @tobyg74/tiktok-api-dl library
    - Implement watermark-free video download
    - Handle image sets

    - Extract metadata
    - Implement fallback to watermarked version
    - _Requirements: 2.3, 3.1-3.4, 6.1-6.3_

  - [x] 5.5 Write property tests for TikTok watermark handling

    - **Property 11: TikTok Watermark Removal**
    - **Property 12: TikTok Image Set Completeness**
    - **Property 13: Watermark Fallback Notification**
    - **Validates: Requirements 6.1, 6.2, 6.3**


  - [x] 5.6 Implement Pinterest extractor

    - Use axios + cheerio for scraping
    - Extract pin metadata
    - Get image download URLs
    - _Requirements: 2.4, 3.1-3.4, 4.3_

  - [x] 5.7 Implement X (Twitter) extractor


    - Use axios + cheerio for scraping
    - Handle images and videos
    - Extract metadata
    - _Requirements: 2.5, 3.1-3.4, 4.1, 4.3_


  - [x] 5.8 Implement Facebook extractor

    - Use axios + cheerio for public posts
    - Extract metadata
    - Handle images and videos
    - _Requirements: 2.6, 3.1-3.4, 4.1, 4.3_



  - [x] 5.9 Implement Reddit extractor




    - Use Reddit JSON API
    - Handle images, videos, and galleries
    - Extract metadata


    - _Requirements: 2.7, 3.1-3.4, 4.1, 4.3_

  - [x] 5.10 Implement LinkedIn extractor





    - Use axios + cheerio for public posts


    - Extract metadata
    - Handle images and videos
    - _Requirements: 2.8, 3.1-3.4, 4.1, 4.3_

  - [ ] 5.11 Write property test for metadata completeness
    - **Property 5: Metadata Completeness**
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.4**

- [x] 6. Create API routes


  - [x] 6.1 Implement /api/detect endpoint


    - Accept URL in request body
    - Call platform detector
    - Return platform or error
    - _Requirements: 1.2, 2.1-2.8_



  - [ ] 6.2 Implement /api/metadata endpoint
    - Accept URL and platform in request body
    - Call appropriate platform extractor
    - Return metadata or error
    - Implement caching (5-minute TTL)
    - _Requirements: 3.1-3.5_


  - [x] 6.3 Implement /api/formats endpoint

    - Accept URL and platform in request body
    - Return available formats and qualities
    - _Requirements: 4.1-4.5, 5.1-5.4_


  - [x] 6.4 Implement /api/download endpoint

    - Accept URL, platform, format, and quality in request body
    - Call appropriate platform extractor
    - Stream download to client
    - Implement progress tracking
    - Handle errors gracefully
    - _Requirements: 5.5, 7.1-7.5, 11.1-11.5_

  - [x] 6.5 Write property tests for API error handling
















    - **Property 15: Download Error Handling**
    - **Property 27: Extraction Error Handling**
    - **Validates: Requirements 7.4, 11.5**

  - [x] 6.6 Write property test for quality selection




















    - **Property 10: Quality Selection Respect**
    - **Validates: Requirements 5.5**
-

- [x] 7. Implement download engine and orchestration










  - [x] 7.1 Create download manager


    - Implement concurrent download limiting (max 3)
    - Add download queue management
    - Implement progress tracking for multiple downloads
    - _Requirements: 7.5_

  - [x] 7.2 Implement rate limiting


    - Add client-side rate limiting (10 requests/minute)
    - Add server-side rate limiting (100 requests/hour per IP)
    - Implement exponential backoff for retries
    - _Requirements: 11.4_

  - [x] 7.3 Write property tests for rate limiting



    - **Property 26: Rate Limit Compliance**
    - **Validates: Requirements 11.4**

  - [x] 7.4 Implement security measures


    - Add input sanitization
    - Validate file types
    - Limit file sizes (max 500MB)
    - Block dangerous protocols (file://, javascript:)
    - _Requirements: 11.1-11.3_

  - [x] 7.5 Write property test for security



    - **Property 25: Public Endpoint Access Only**
    - **Validates: Requirements 11.1, 11.2, 11.3**

- [x] 8. Build main page and user flow





  - [x] 8.1 Create home page


    - Implement hero section matching reference design
    - Add InputBar component
    - Add platform detection display
    - Implement metadata display section
    - Add download options section
    - Add progress indicator section
    - _Requirements: 1.1-1.5, 3.5, 4.1-4.5, 7.1-7.5_


  - [x] 8.2 Implement user flow logic

    - Connect InputBar to platform detection API
    - Fetch metadata on platform detection
    - Display metadata card
    - Fetch available formats and qualities
    - Handle download initiation
    - Track download progress
    - Handle success/error states
    - _Requirements: 1.1-1.5, 3.1-3.5, 4.1-4.5, 5.1-5.5, 7.1-7.5_


  - [x] 8.3 Add animations and transitions

    - Implement fade-in animations for components
    - Add hover effects to buttons
    - Add loading animations
    - Add error animations
    - _Requirements: 12.1-12.5_


  - [x] 8.4 Write property test for animations

    - **Property 28: Animation Presence**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5**

- [x] 9. Implement responsive design




  - [x] 9.1 Add responsive breakpoints


    - Configure Tailwind breakpoints (sm, md, lg, xl)
    - Implement mobile-first approach
    - _Requirements: 8.1-8.4_

  - [x] 9.2 Create responsive layouts


    - Implement desktop layout
    - Implement tablet layout
    - Implement mobile layout
    - Add responsive navigation
    - _Requirements: 8.1-8.4_

  - [x] 9.3 Write property tests for responsive design


    - **Property 17: Responsive Layout Adaptation**
    - **Property 18: Dynamic Viewport Response**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.4**

- [x] 10. Set up PWA functionality




  - [x] 10.1 Configure service worker

    - Create service worker for caching
    - Implement offline functionality
    - Add cache strategies
    - _Requirements: 8.5_

  - [x] 10.2 Add PWA manifest


    - Create manifest.json
    - Add app icons
    - Configure display mode
    - _Requirements: 8.5_



  - [x] 10.3 Write property test for PWA offline functionality (✓ passed)
    - **Property 19: PWA Offline Functionality**
    - **Validates: Requirements 8.5**

- [ ] 11. Build mobile app with Expo




  - [x] 11.1 Set up Expo project structure


    - Create screens directory
    - Create components directory
    - Set up navigation
    - _Requirements: 9.1-9.4_

  - [x] 11.2 Port web components to React Native


    - Convert Layout component
    - Convert ThemeToggle component
    - Convert InputBar component
    - Convert PlatformBadge component
    - Convert MetadataCard component
    - Convert DownloadOptions component
    - Convert ProgressIndicator component
    - _Requirements: 9.1_

  - [x] 11.3 Configure NativeWind


    - Set up NativeWind with same Tailwind config
    - Ensure theme consistency with web app
    - _Requirements: 9.2_

  - [x] 11.4 Write property test for cross-platform consistency


    - **Property 20: Cross-Platform Feature Parity**
    - **Property 21: Cross-Platform Theme Consistency**
    - **Validates: Requirements 9.1, 9.2**

  - [x] 11.5 Implement mobile-specific features


    - Add share functionality
    - Add file system access
    - Add native download manager integration
    - _Requirements: 9.4_

  - [x] 11.6 Set up React Native Reanimated


    - Configure animations matching web app
    - Implement fade and slide animations
    - Add gesture handlers
    - _Requirements: 12.1-12.5_

- [x] 12. Add error handling and edge cases





  - [x] 12.1 Implement comprehensive error handling


    - Add try-catch blocks to all async operations
    - Create error boundary components
    - Implement error logging
    - _Requirements: 11.5_

  - [x] 12.2 Handle edge cases


    - Empty input handling
    - Invalid URL handling
    - Network timeout handling
    - Content not found handling
    - Private content handling
    - Rate limit handling
    - _Requirements: 1.4, 7.4, 11.4, 11.5_

  - [x] 12.3 Add user feedback for errors


    - Display clear error messages
    - Provide actionable suggestions
    - Add retry buttons
    - _Requirements: 1.4, 7.4_

- [x] 13. Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.

- [x] 14. Optimize performance






  - [x] 14.1 Implement code splitting

    - Lazy load platform extractors
    - Lazy load heavy components
    - Use dynamic imports
    - _Requirements: All_


  - [x] 14.2 Add caching strategies

    - Cache metadata (5-minute TTL)
    - Cache platform detection results
    - Implement service worker caching
    - _Requirements: 3.1-3.5_

  - [x] 14.3 Optimize images and assets


    - Compress images
    - Use WebP format
    - Implement lazy loading for thumbnails
    - _Requirements: 3.2_

  - [x] 14.4 Add loading states


    - Implement skeleton screens
    - Add loading spinners
    - Show progress indicators
    - _Requirements: 7.1-7.5_
- [x] 15. Set up testing infrastructure







- [ ] 15. Set up testing infrastructure

  - [x] 15.1 Configure Jest



    - Set up Jest for Next.js
    - Set up Jest for Expo
    - Configure test coverage reporting
    - _Requirements: All_


  - [x] 15.2 Configure fast-check








    - Set up fast-check with 100 iterations minimum
    - Create custom generators for URLs, metadata, platforms
    - _Requirements: All_

  - [x] 15.3 Write remaining property tests

    - **Property 8: Carousel Image Completeness**
    - **Validates: Requirements 4.5**

- [x] 16. Create documentation






  - [x] 16.1 Write README

    - Add project description
    - Add installation instructions
    - Add usage examples
    - Add API documentation
    - _Requirements: All_


  - [x] 16.2 Add code comments

    - Document complex functions
    - Add JSDoc comments
    - Document API endpoints
    - _Requirements: All_


  - [x] 16.3 Create deployment guide

    - Document Vercel deployment
    - Document Expo build process
    - Document environment variables
    - _Requirements: All_

- [x] 17. Final checkpoint - Ensure all tests pass






  - Ensure all tests pass, ask the user if questions arise.
