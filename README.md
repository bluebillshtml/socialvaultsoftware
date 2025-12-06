# SocialVault

An all-in-one social media downloader that enables users to download public content from multiple platforms including YouTube, Instagram, TikTok, Pinterest, X (Twitter), Facebook, Reddit, and LinkedIn. Available as both a responsive web application and a native mobile app with consistent theming and functionality across platforms.

## Features

- 🎯 **Multi-Platform Support**: Download from 8 major social media platforms
- 🔍 **Automatic Platform Detection**: Just paste a URL and we'll detect the platform
- 📊 **Rich Metadata Display**: View title, thumbnail, author, and duration before downloading
- 🎬 **Multiple Format Options**: Download as video (MP4), audio (MP3), images, or thumbnails
- 🎨 **Quality Selection**: Choose from available quality options (1080p, 720p, 480p, etc.)
- 🌓 **Dark/Light Theme**: Seamless theme switching with system preference detection
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile browsers
- 🚀 **PWA Support**: Install as a Progressive Web App for offline functionality
- 📲 **Native Mobile App**: Full-featured Expo app for iOS and Android
- ⚡ **Fast & Efficient**: Optimized performance with caching and lazy loading
- 🔒 **Privacy-Focused**: No authentication required, no data collection
- ✨ **Beautiful UI**: Modern glass-morphism design with smooth animations

## Project Structure

```
socialvault/
├── web/          # Next.js web application
├── mobile/       # Expo mobile application
├── shared/       # Shared types and utilities
└── package.json  # Root workspace configuration
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- For mobile development: Expo CLI
- (Optional) YouTube Data API v3 key for reliable YouTube downloads - see [YOUTUBE_API_SETUP.md](./YOUTUBE_API_SETUP.md)

### Installation

Install all dependencies:

```bash
npm run install:all
```

Or install individually:

```bash
# Install root dependencies
npm install

# Install web dependencies
cd web && npm install

# Install mobile dependencies
cd mobile && npm install

# Install shared dependencies
cd shared && npm install
```

### Development

**Web Application:**
```bash
npm run dev:web
# Opens at http://localhost:3000
```

**Mobile Application:**
```bash
npm run dev:mobile
# Scan QR code with Expo Go app
```

## Usage

### Web Application

1. **Paste a URL**: Copy any supported social media URL and paste it into the input field
2. **View Metadata**: The app automatically detects the platform and displays content metadata
3. **Select Format**: Choose your preferred format (video, audio, image, or thumbnail)
4. **Choose Quality**: Select video quality if applicable (1080p, 720p, 480p)
5. **Download**: Click the download button and wait for your content

### Mobile Application

The mobile app provides the same functionality with native mobile features:
- Native share functionality
- File system integration
- Native download manager
- Gesture-based interactions

### Supported Platforms & URL Examples

| Platform | Example URL |
|----------|-------------|
| YouTube | `https://www.youtube.com/watch?v=VIDEO_ID` |
| Instagram | `https://www.instagram.com/p/POST_ID/` |
| TikTok | `https://www.tiktok.com/@user/video/VIDEO_ID` |
| Pinterest | `https://www.pinterest.com/pin/PIN_ID/` |
| X (Twitter) | `https://twitter.com/user/status/TWEET_ID` |
| Facebook | `https://www.facebook.com/user/posts/POST_ID` |
| Reddit | `https://www.reddit.com/r/subreddit/comments/POST_ID/` |
| LinkedIn | `https://www.linkedin.com/posts/POST_ID` |

## API Documentation

The web application exposes several API endpoints for content extraction:

### POST /api/detect

Detects the platform from a given URL.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
}
```

**Response:**
```json
{
  "success": true,
  "platform": "youtube"
}
```

### POST /api/metadata

Fetches metadata for a given URL.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "platform": "youtube"
}
```

**Response:**
```json
{
  "success": true,
  "metadata": {
    "title": "Video Title",
    "thumbnail": "https://...",
    "author": "Channel Name",
    "duration": 213,
    "platform": "youtube",
    "url": "https://..."
  }
}
```

### POST /api/formats

Gets available formats and qualities for a URL.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "platform": "youtube"
}
```

**Response:**
```json
{
  "success": true,
  "formats": [
    { "type": "video", "label": "MP4 Video", "icon": "video" },
    { "type": "audio", "label": "MP3 Audio", "icon": "music" }
  ],
  "qualities": [
    { "value": "1080p", "label": "1080p", "available": true },
    { "value": "720p", "label": "720p", "available": true }
  ]
}
```

### POST /api/download

Initiates a download for the specified content.

**Request Body:**
```json
{
  "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  "platform": "youtube",
  "format": "video",
  "quality": "1080p"
}
```

**Response:**
```json
{
  "success": true,
  "downloadUrl": "https://...",
  "filename": "video-title.mp4"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "CONTENT_NOT_FOUND",
    "message": "The requested content could not be found",
    "retryable": false
  }
}
```

### Testing

Run all tests:
```bash
npm test
```

Run tests for specific workspace:
```bash
npm run test:web
npm run test:mobile
npm run test:shared
```

### Building

Build web application:
```bash
npm run build:web
```

## Tech Stack

### Web
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React 18
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Testing**: Jest, React Testing Library, fast-check

### Mobile
- **Framework**: Expo SDK 50
- **UI Library**: React Native
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind for React Native)
- **Animations**: React Native Reanimated
- **Testing**: Jest, React Native Testing Library

### Shared
- **Language**: TypeScript
- **Download Libraries**: ytdl-core, instagram-url-direct, @tobyg74/tiktok-api-dl
- **HTTP Client**: axios
- **HTML Parsing**: cheerio
- **Testing**: fast-check (Property-based testing)

## Architecture

SocialVault follows a monorepo structure with three main packages:

- **web/**: Next.js web application with API routes
- **mobile/**: Expo mobile application
- **shared/**: Shared utilities, types, and platform extractors

### Key Components

- **Platform Detector**: Identifies social media platform from URL patterns
- **Metadata Extractor**: Retrieves content information (title, thumbnail, author, duration)
- **Download Engine**: Orchestrates content downloads with progress tracking
- **Platform Extractors**: Modular extractors for each supported platform
- **Rate Limiter**: Prevents API abuse and respects platform limits
- **Security Module**: Input sanitization and validation

## Performance & Optimization

- **Code Splitting**: Lazy loading of platform extractors and heavy components
- **Caching**: 5-minute TTL for metadata, platform detection results
- **Streaming**: Large video downloads use streaming for memory efficiency
- **Concurrent Limiting**: Max 3 simultaneous downloads
- **PWA Caching**: Service worker caching for offline functionality
- **Image Optimization**: WebP format, lazy loading for thumbnails

## Security & Privacy

- ✅ No authentication required
- ✅ No personal data collection
- ✅ Public endpoints only
- ✅ Input sanitization and validation
- ✅ Rate limiting (10 req/min client, 100 req/hour server)
- ✅ File type validation
- ✅ Size limits (max 500MB)
- ✅ Dangerous protocol blocking (file://, javascript:)

## Testing

The project uses a comprehensive testing strategy:

### Unit Tests
```bash
npm run test:web      # Web component tests
npm run test:mobile   # Mobile component tests
npm run test:shared   # Shared utility tests
```

### Property-Based Tests
Using fast-check with 100+ iterations per property to verify:
- URL validation correctness
- Platform detection accuracy
- Metadata completeness
- Quality selection respect
- Theme consistency
- And 30+ other correctness properties

### Integration Tests
End-to-end testing with Playwright (when configured)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write tests for new features
- Maintain property-based tests for correctness properties
- Follow the existing code style
- Update documentation as needed

## Troubleshooting

### Common Issues

**"Platform not detected"**
- Ensure the URL is from a supported platform
- Check that the URL is properly formatted
- Try the full URL instead of shortened versions

**"Content not found"**
- Verify the content is publicly accessible
- Check if the content has been deleted
- Some private or restricted content cannot be downloaded

**"Download failed"**
- Check your internet connection
- The content may be too large (max 500MB)
- Platform may be experiencing issues
- Try again later or use a different quality

**Rate limit errors**
- Wait a few minutes before trying again
- The app limits requests to prevent abuse
- Client: 10 requests/minute
- Server: 100 requests/hour per IP

## Current Status & Limitations

⚠️ **Important Notice**: Social media platforms actively prevent programmatic downloads. This application demonstrates:

**✅ What Works:**
- Platform detection for all 8 platforms
- Metadata extraction (with API keys)
- Professional UI/UX
- Theme switching and responsive design
- Error handling and security measures

**⚠️ What's Limited:**
- **YouTube**: Metadata works (with API key), downloads blocked by ToS
- **Instagram**: Requires authentication
- **TikTok**: Library compatibility issues
- **Others**: May work for public content, untested

**See [STATUS.md](./STATUS.md) for detailed information.**

## Legal & Compliance

⚠️ **Important**: This tool is for educational purposes and demonstrates web development skills. Users are responsible for:
- Respecting copyright laws
- Following platform Terms of Service
- Obtaining necessary permissions
- Using downloaded content legally

SocialVault does not bypass authentication, access private content, or circumvent platform security measures.

## Roadmap

- [ ] Additional platforms (Vimeo, Dailymotion, Twitch)
- [ ] Batch downloads (multiple URLs)
- [ ] Playlist/album downloads
- [ ] Subtitle downloads
- [ ] Video trimming/editing
- [ ] Download history
- [ ] Custom quality presets

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Made with ❤️ by the SocialVault team
