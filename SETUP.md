# Setup Instructions

## Project Structure Created

The SocialVault project has been scaffolded with the following structure:

```
socialvault/
├── web/              # Next.js web application
│   ├── app/          # Next.js App Router
│   ├── components/   # React components
│   ├── lib/          # Utility functions
│   └── public/       # Static assets
├── mobile/           # Expo mobile application
│   ├── app/          # Expo Router
│   ├── components/   # React Native components
│   └── assets/       # Mobile assets
├── shared/           # Shared TypeScript types
└── package.json      # Root workspace configuration
```

## Installation Steps

### 1. Install Root Dependencies

```bash
npm install
```

### 2. Install Web Dependencies

```bash
cd web
npm install
```

### 3. Install Mobile Dependencies

```bash
cd mobile
npm install
```

### 4. Install Shared Dependencies

```bash
cd shared
npm install
```

## Running the Applications

### Web Application

```bash
npm run dev:web
# or
cd web && npm run dev
```

The web app will be available at http://localhost:3000

### Mobile Application

```bash
npm run dev:mobile
# or
cd mobile && npm start
```

Follow the Expo CLI instructions to run on iOS, Android, or web.

## Testing

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

## Key Technologies Configured

### Web
- ✅ Next.js 14 with App Router
- ✅ TypeScript
- ✅ TailwindCSS
- ✅ Framer Motion
- ✅ ESLint & Prettier
- ✅ Jest & fast-check

### Mobile
- ✅ Expo SDK 50
- ✅ React Native
- ✅ TypeScript
- ✅ NativeWind (Tailwind for RN)
- ✅ React Native Reanimated
- ✅ Jest & fast-check

### Download Libraries
- ✅ ytdl-core (YouTube)
- ✅ instagram-url-direct (Instagram)
- ✅ @tobyg74/tiktok-api-dl (TikTok)
- ✅ axios (HTTP requests)
- ✅ cheerio (HTML parsing)

### Shared
- ✅ TypeScript type definitions
- ✅ Cross-platform interfaces
- ✅ fast-check for property-based testing

## Next Steps

1. Install dependencies using the commands above
2. Start implementing features according to the tasks.md file
3. Begin with task 2: "Implement core utility functions and platform detection"

## Notes

- The workspace uses npm workspaces for monorepo management
- All three packages (web, mobile, shared) can be developed independently
- Shared types are accessible from both web and mobile via `@shared/*` imports
- Property-based testing is configured with fast-check (minimum 100 iterations)
