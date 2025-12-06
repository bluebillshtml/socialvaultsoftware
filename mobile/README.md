# SocialVault Mobile App

React Native mobile application built with Expo for downloading social media content.

## Features

### Core Components
All web components have been ported to React Native:
- **Layout**: Main app layout with header, content area, and footer
- **ThemeToggle**: Animated theme switcher with dark/light mode support
- **InputBar**: URL input with validation and loading states
- **PlatformBadge**: Platform identifier badges with icons
- **MetadataCard**: Content preview with thumbnail, title, author, and duration
- **DownloadOptions**: Format and quality selection interface
- **ProgressIndicator**: Download progress tracking with status messages

### Mobile-Specific Features
- **File System Access**: Download files to device storage using Expo FileSystem
- **Native Sharing**: Share downloaded files using native share sheet
- **Download Management**: Track and manage downloaded files
- **Progress Tracking**: Real-time download progress updates

### Animations
Powered by React Native Reanimated:
- Fade in/out animations
- Slide animations (up, down, left, right)
- Scale animations for button presses
- Spring animations for smooth interactions
- Gesture handlers for touch interactions

### Theme System
- Consistent theming with web app using NativeWind
- Dark and light mode support
- Theme persistence using AsyncStorage
- System theme detection

## Project Structure

```
mobile/
├── app/
│   ├── _layout.tsx          # Root layout with navigation
│   ├── index.tsx             # Home screen
│   └── screens/              # Additional screens
├── components/
│   ├── Layout.tsx            # Main layout component
│   ├── ThemeToggle.tsx       # Theme switcher
│   ├── InputBar.tsx          # URL input
│   ├── PlatformBadge.tsx     # Platform badges
│   ├── MetadataCard.tsx      # Content preview
│   ├── DownloadOptions.tsx   # Download options
│   ├── ProgressIndicator.tsx # Progress tracking
│   ├── AnimatedButton.tsx    # Animated button component
│   └── AnimationShowcase.tsx # Animation utilities
├── lib/
│   ├── ThemeContext.tsx      # Theme provider
│   ├── mobileFeatures.ts     # Mobile-specific utilities
│   └── animations.ts         # Animation configurations
├── __tests__/                # Test files
├── app.json                  # Expo configuration
├── babel.config.js           # Babel configuration
├── tailwind.config.js        # Tailwind/NativeWind config
└── package.json              # Dependencies

```

## Configuration

### NativeWind
Tailwind CSS for React Native is configured with the same design tokens as the web app:
- Colors: Matching dark theme (#05040A background, white/10 borders)
- Typography: Geist and Jakarta Sans fonts
- Spacing: Consistent spacing scale
- Border radius: Matching border radius values

### React Native Reanimated
Configured in `babel.config.js` and `app.json` for smooth animations:
- Spring animations with configurable damping and stiffness
- Timing animations with custom easing curves
- Gesture handlers for interactive elements
- Layout animations for component transitions

## Dependencies

### Core
- `expo`: ~50.0.0
- `react-native`: 0.73.0
- `expo-router`: ~3.4.0

### UI & Styling
- `nativewind`: ^4.0.0
- `tailwindcss`: ^3.4.0

### Animations
- `react-native-reanimated`: ~3.6.0
- `react-native-gesture-handler`: ~2.14.0

### Mobile Features
- `expo-file-system`: ~16.0.0
- `expo-sharing`: ~12.0.0
- `@react-native-async-storage/async-storage`: 1.21.0

### Testing
- `jest`: ^29.7.0
- `jest-expo`: ~50.0.0
- `fast-check`: ^3.15.0

## Running the App

### Development
```bash
# Start Expo development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Testing
```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- <test-file-name>
```

## Cross-Platform Consistency

The mobile app maintains feature parity with the web app:
- ✅ Identical component interfaces
- ✅ Matching theme colors and design tokens
- ✅ Consistent spacing and typography
- ✅ Same download format and quality options
- ✅ Equivalent progress tracking
- ✅ Matching animation styles

Property-based tests verify cross-platform consistency in `shared/__tests__/crossPlatform.test.ts`.

## Mobile-Specific Enhancements

### File Management
```typescript
import { downloadFile, shareFile, listDownloadedFiles } from './lib/mobileFeatures';

// Download a file
const fileUri = await downloadFile(url, filename, (progress) => {
  console.log(`Download progress: ${progress}%`);
});

// Share a file
await shareFile(fileUri, filename);

// List downloaded files
const files = await listDownloadedFiles();
```

### Animations
```typescript
import { springConfig, fadeIn, slideUp } from './lib/animations';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

// Use spring animation
const animatedStyle = useAnimatedStyle(() => ({
  transform: [{ scale: withSpring(scale.value, springConfig) }],
}));
```

## Future Enhancements

- [ ] Offline mode with cached content
- [ ] Download history and management
- [ ] Batch downloads
- [ ] Background downloads
- [ ] Push notifications for completed downloads
- [ ] Biometric authentication for private downloads
- [ ] Cloud sync across devices

## License

See main project LICENSE file.
