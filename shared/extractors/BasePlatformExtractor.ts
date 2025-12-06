import {
  Platform,
  ContentMetadata,
  DownloadFormat,
  Quality,
} from '../types';

/**
 * Interface that all platform extractors must implement
 */
export interface PlatformExtractor {
  platform: Platform;
  extractMetadata(url: string): Promise<ContentMetadata>;
  getDownloadUrl(url: string, format: string, quality?: string): Promise<string>;
  getSupportedFormats(): DownloadFormat[];
  getSupportedQualities(): Quality[];
}

/**
 * Abstract base class providing common functionality for platform extractors
 */
export abstract class BasePlatformExtractor implements PlatformExtractor {
  abstract platform: Platform;

  /**
   * Extract metadata from a URL
   */
  abstract extractMetadata(url: string): Promise<ContentMetadata>;

  /**
   * Get download URL for specific format and quality
   */
  abstract getDownloadUrl(
    url: string,
    format: string,
    quality?: string
  ): Promise<string>;

  /**
   * Get supported formats for this platform
   */
  abstract getSupportedFormats(): DownloadFormat[];

  /**
   * Get supported qualities for this platform
   */
  abstract getSupportedQualities(): Quality[];

  /**
   * Validate URL format
   */
  protected validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Format duration from seconds to readable string (MM:SS or HH:MM:SS)
   */
  protected formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  /**
   * Handle errors consistently across extractors
   */
  protected handleError(error: unknown, context: string): never {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`${context}: ${message}`);
  }

  /**
   * Sanitize filename for safe file system usage
   */
  protected sanitizeFilename(filename: string): string {
    return filename
      .replace(/[<>:"/\\|?*]/g, '')
      .replace(/\s+/g, '_')
      .substring(0, 200);
  }
}
