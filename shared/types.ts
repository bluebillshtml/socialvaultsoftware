// Platform types
export type Platform =
  | 'youtube'
  | 'instagram'
  | 'tiktok'
  | 'pinterest'
  | 'twitter'
  | 'facebook'
  | 'reddit'
  | 'linkedin'
  | 'unknown';

// Download format types
export interface DownloadFormat {
  type: 'video' | 'audio' | 'image' | 'thumbnail';
  label: string;
  icon: string;
}

// Quality types
export interface Quality {
  value: string;
  label: string;
  available: boolean;
}

// Content metadata
export interface ContentMetadata {
  title: string;
  thumbnail: string;
  author: string;
  duration?: number;
  platform: Platform;
  url: string;
  availableFormats: DownloadFormat[];
  availableQualities: Quality[];
}

// Download request
export interface DownloadRequest {
  url: string;
  platform: Platform;
  format: 'video' | 'audio' | 'image' | 'thumbnail';
  quality?: string;
}

// Download response
export interface DownloadResponse {
  success: boolean;
  downloadUrl?: string;
  filename?: string;
  error?: string;
}

// Download job
export interface DownloadJob {
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

// Theme types
export type ThemeMode = 'light' | 'dark';

export interface ThemeConfig {
  mode: ThemeMode;
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

// URL pattern
export interface URLPattern {
  platform: Platform;
  patterns: RegExp[];
  examples: string[];
}
