# SocialVault Deployment Guide

This guide covers deploying both the web application and mobile application for SocialVault.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Web Application Deployment (Vercel)](#web-application-deployment-vercel)
- [Mobile Application Deployment (Expo)](#mobile-application-deployment-expo)
- [Alternative Deployment Options](#alternative-deployment-options)
- [Post-Deployment Checklist](#post-deployment-checklist)
- [Troubleshooting](#troubleshooting)

## Prerequisites

### General Requirements

- Node.js 18+ installed
- npm or yarn package manager
- Git repository with your code
- GitHub, GitLab, or Bitbucket account (for CI/CD)

### Web Deployment Requirements

- Vercel account (free tier available)
- Custom domain (optional)

### Mobile Deployment Requirements

- Expo account (free tier available)
- Apple Developer account ($99/year) for iOS deployment
- Google Play Developer account ($25 one-time) for Android deployment
- EAS CLI installed: `npm install -g eas-cli`

## Environment Variables

### Web Application (.env.local)

Create a `.env.local` file in the `web/` directory:

```bash
# Optional: API rate limiting configuration
RATE_LIMIT_MAX_REQUESTS=100
RATE_LIMIT_WINDOW_MS=3600000

# Optional: Cache configuration
CACHE_TTL_MS=300000

# Optional: Security configuration
MAX_FILE_SIZE_MB=500
MAX_URL_LENGTH=2048

# Optional: Analytics (if you add them)
# NEXT_PUBLIC_GA_ID=your-google-analytics-id
```

### Mobile Application (.env)

Create a `.env` file in the `mobile/` directory:

```bash
# API endpoint (update after deploying web app)
EXPO_PUBLIC_API_URL=https://your-domain.vercel.app

# Optional: App configuration
EXPO_PUBLIC_APP_NAME=SocialVault
EXPO_PUBLIC_APP_VERSION=1.0.0
```

## Web Application Deployment (Vercel)

### Option 1: Deploy via Vercel Dashboard (Recommended for beginners)

1. **Sign up for Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Import Project**
   - Click "Add New Project"
   - Select your repository
   - Vercel will auto-detect Next.js

3. **Configure Build Settings**
   - Framework Preset: `Next.js`
   - Root Directory: `web`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add any required environment variables from above
   - Click "Deploy"

5. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from web directory**
   ```bash
   cd web
   vercel
   ```

4. **Follow prompts**
   - Set up and deploy: Yes
   - Which scope: Select your account
   - Link to existing project: No (first time)
   - Project name: socialvault-web
   - Directory: ./
   - Override settings: No

5. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Vercel Configuration File

Create `vercel.json` in the `web/` directory for advanced configuration:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"],
  "env": {
    "RATE_LIMIT_MAX_REQUESTS": "100",
    "RATE_LIMIT_WINDOW_MS": "3600000"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type"
        }
      ]
    }
  ]
}
```

### Continuous Deployment

Vercel automatically sets up continuous deployment:
- Push to `main` branch → Production deployment
- Push to other branches → Preview deployment
- Pull requests → Preview deployment with unique URL

## Mobile Application Deployment (Expo)

### Step 1: Configure EAS

1. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**
   ```bash
   eas login
   ```

3. **Configure EAS Build**
   ```bash
   cd mobile
   eas build:configure
   ```

   This creates `eas.json`:

   ```json
   {
     "cli": {
       "version": ">= 5.0.0"
     },
     "build": {
       "development": {
         "developmentClient": true,
         "distribution": "internal"
       },
       "preview": {
         "distribution": "internal",
         "android": {
           "buildType": "apk"
         }
       },
       "production": {
         "autoIncrement": true
       }
     },
     "submit": {
       "production": {}
     }
   }
   ```

### Step 2: Update app.json

Update `mobile/app.json` with production configuration:

```json
{
  "expo": {
    "name": "SocialVault",
    "slug": "socialvault",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#05040A"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.socialvault",
      "buildNumber": "1.0.0"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#05040A"
      },
      "package": "com.yourcompany.socialvault",
      "versionCode": 1,
      "permissions": [
        "INTERNET",
        "WRITE_EXTERNAL_STORAGE",
        "READ_EXTERNAL_STORAGE"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

### Step 3: Build for iOS

1. **Create iOS Build**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Wait for build to complete** (15-30 minutes)
   - Monitor progress at expo.dev
   - Download IPA file when complete

3. **Submit to App Store**
   ```bash
   eas submit --platform ios --latest
   ```

   You'll need:
   - Apple ID
   - App-specific password
   - App Store Connect API key (recommended)

### Step 4: Build for Android

1. **Create Android Build**
   ```bash
   eas build --platform android --profile production
   ```

2. **Wait for build to complete** (15-30 minutes)
   - Monitor progress at expo.dev
   - Download AAB file when complete

3. **Submit to Google Play**
   ```bash
   eas submit --platform android --latest
   ```

   You'll need:
   - Google Play Console account
   - Service account JSON key

### Step 5: Over-The-Air (OTA) Updates

For non-native code changes, use OTA updates:

```bash
# Publish update to production
eas update --branch production --message "Bug fixes and improvements"

# Publish update to preview
eas update --branch preview --message "Testing new features"
```

Configure update channels in `app.json`:

```json
{
  "expo": {
    "updates": {
      "url": "https://u.expo.dev/your-project-id"
    },
    "runtimeVersion": {
      "policy": "sdkVersion"
    }
  }
}
```

## Alternative Deployment Options

### Web Application Alternatives

#### Netlify

1. Connect repository to Netlify
2. Build settings:
   - Base directory: `web`
   - Build command: `npm run build`
   - Publish directory: `web/.next`
3. Add environment variables
4. Deploy

#### Self-Hosted (Docker)

Create `Dockerfile` in `web/`:

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t socialvault-web .
docker run -p 3000:3000 socialvault-web
```

### Mobile Application Alternatives

#### TestFlight (iOS Beta)

```bash
# Build for internal testing
eas build --platform ios --profile preview

# Distribute via TestFlight
eas submit --platform ios --latest
```

#### Google Play Internal Testing

```bash
# Build for internal testing
eas build --platform android --profile preview

# Upload to internal testing track
eas submit --platform android --latest --track internal
```

## Post-Deployment Checklist

### Web Application

- [ ] Verify all API endpoints are working
- [ ] Test platform detection with various URLs
- [ ] Test download functionality for each platform
- [ ] Verify rate limiting is working
- [ ] Test theme switching
- [ ] Check responsive design on mobile devices
- [ ] Test PWA installation
- [ ] Verify error handling
- [ ] Check analytics (if configured)
- [ ] Test with different browsers
- [ ] Verify HTTPS is working
- [ ] Check performance metrics (Lighthouse)

### Mobile Application

- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Verify API connection to production backend
- [ ] Test download functionality
- [ ] Test share functionality
- [ ] Verify theme switching
- [ ] Test offline behavior
- [ ] Check app permissions
- [ ] Verify app icons and splash screen
- [ ] Test OTA updates
- [ ] Submit for app store review
- [ ] Prepare app store listings (screenshots, descriptions)

## Monitoring and Maintenance

### Web Application Monitoring

**Vercel Analytics** (built-in):
- Real-time performance metrics
- Web Vitals tracking
- Visitor analytics

**Error Tracking** (optional):
- Sentry: `npm install @sentry/nextjs`
- Configure in `next.config.js`

### Mobile Application Monitoring

**Expo Analytics**:
- Built-in crash reporting
- Update adoption tracking

**Additional Tools**:
- Sentry for React Native
- Firebase Analytics
- Amplitude

### Maintenance Tasks

**Weekly**:
- Check error logs
- Monitor API rate limits
- Review user feedback

**Monthly**:
- Update dependencies
- Review security advisories
- Analyze performance metrics
- Plan feature updates

**Quarterly**:
- Major dependency updates
- Security audit
- Performance optimization
- User survey

## Troubleshooting

### Web Deployment Issues

**Build fails on Vercel**:
```bash
# Check build locally first
cd web
npm run build

# Check for TypeScript errors
npm run type-check

# Check for linting errors
npm run lint
```

**API routes not working**:
- Verify environment variables are set
- Check API route paths (case-sensitive)
- Review Vercel function logs

**Rate limiting too strict**:
- Adjust `RATE_LIMIT_MAX_REQUESTS` in environment variables
- Consider implementing user-specific rate limits

### Mobile Deployment Issues

**EAS build fails**:
```bash
# Clear cache and retry
eas build --platform ios --clear-cache

# Check build logs
eas build:list
```

**App crashes on launch**:
- Check native dependencies are compatible
- Verify app.json configuration
- Review crash logs in Expo dashboard

**OTA updates not working**:
- Verify runtime version matches
- Check update channel configuration
- Ensure app is connected to internet

### Common Issues

**CORS errors**:
- Add proper CORS headers in `vercel.json`
- Verify API URL in mobile app

**Download failures**:
- Check platform extractor implementations
- Verify external API availability
- Review error logs for specific platforms

**Performance issues**:
- Enable caching for metadata
- Implement lazy loading
- Optimize images and assets
- Use CDN for static assets

## Security Considerations

### Production Checklist

- [ ] Enable HTTPS only
- [ ] Set secure headers (CSP, HSTS)
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Sanitize URLs and filenames
- [ ] Block dangerous protocols
- [ ] Limit file sizes
- [ ] Use environment variables for secrets
- [ ] Enable CORS only for trusted origins
- [ ] Implement request logging
- [ ] Set up error monitoring
- [ ] Regular security audits

### Environment Variables Security

**Never commit**:
- API keys
- Secrets
- Passwords
- Private keys

**Use**:
- Vercel environment variables
- Expo secrets (`eas secret:create`)
- GitHub Secrets for CI/CD

## Support and Resources

### Documentation

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Expo EAS Build](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit](https://docs.expo.dev/submit/introduction/)

### Community

- [Next.js Discord](https://nextjs.org/discord)
- [Expo Discord](https://chat.expo.dev/)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

### Getting Help

For deployment issues:
1. Check this guide first
2. Review official documentation
3. Search community forums
4. Open an issue on GitHub
5. Contact support (Vercel, Expo)

---

**Last Updated**: November 2024
**Version**: 1.0.0
