import TiktokDL from '@tobyg74/tiktok-api-dl';
import { BasePlatformExtractor } from './BasePlatformExtractor';
import { ContentMetadata, DownloadFormat, Quality } from '../types';

export class TikTokExtractor extends BasePlatformExtractor {
  platform = 'tiktok' as const;

  async extractMetadata(url: string): Promise<ContentMetadata> {
    try {
      if (!this.validateUrl(url)) {
        throw new Error('Invalid URL format');
      }

      const result = await TiktokDL.Downloader(url, {
        version: 'v3',
      });

      if (result.status !== 'success') {
        throw new Error('Failed to fetch TikTok data');
      }

      const data = result.result;
      const isImageSet = data.type === 'image';

      // Get available formats
      const availableFormats = this.getSupportedFormats().filter((format) => {
        if (isImageSet && format.type === 'image') return true;
        if (!isImageSet && format.type === 'video') return true;
        if (format.type === 'thumbnail') return true;
        return false;
      });

      return {
        title: data.desc || 'TikTok Video',
        thumbnail: data.cover || '',
        author: data.author?.nickname || data.author?.unique_id || 'Unknown',
        duration: data.duration,
        platform: this.platform,
        url,
        availableFormats,
        availableQualities: this.getSupportedQualities(),
      };
    } catch (error) {
      this.handleError(error, 'Failed to extract TikTok metadata');
    }
  }

  async getDownloadUrl(
    url: string,
    format: string,
    quality?: string
  ): Promise<string> {
    try {
      const result = await TiktokDL.Downloader(url, {
        version: 'v3',
      });

      if (result.status !== 'success') {
        throw new Error('Failed to fetch TikTok data');
      }

      const data = result.result;

      if (format === 'video') {
        // Try to get watermark-free version first
        if (data.video && data.video.noWatermark) {
          return data.video.noWatermark;
        }
        // Fallback to watermarked version
        if (data.video && data.video.watermark) {
          return data.video.watermark;
        }
        throw new Error('No video URL available');
      }

      if (format === 'image' && data.images && data.images.length > 0) {
        return data.images[0];
      }

      if (format === 'thumbnail') {
        return data.cover || '';
      }

      throw new Error(`Unsupported format: ${format}`);
    } catch (error) {
      this.handleError(error, 'Failed to get TikTok download URL');
    }
  }

  getSupportedFormats(): DownloadFormat[] {
    return [
      {
        type: 'video',
        label: 'Video (MP4)',
        icon: 'video',
      },
      {
        type: 'image',
        label: 'Images',
        icon: 'image',
      },
      {
        type: 'thumbnail',
        label: 'Thumbnail',
        icon: 'image',
      },
    ];
  }

  getSupportedQualities(): Quality[] {
    return [
      { value: 'high', label: 'High Quality', available: true },
    ];
  }

  /**
   * Check if watermark-free version is available
   */
  async isWatermarkFreeAvailable(url: string): Promise<boolean> {
    try {
      const result = await TiktokDL.Downloader(url, {
        version: 'v3',
      });

      if (result.status !== 'success') {
        return false;
      }

      return !!(result.result.video && result.result.video.noWatermark);
    } catch {
      return false;
    }
  }

  /**
   * Get all image URLs from an image set
   */
  async getImageSetUrls(url: string): Promise<string[]> {
    try {
      const result = await TiktokDL.Downloader(url, {
        version: 'v3',
      });

      if (result.status !== 'success') {
        throw new Error('Failed to fetch TikTok data');
      }

      return result.result.images || [];
    } catch (error) {
      this.handleError(error, 'Failed to get TikTok image set URLs');
    }
  }
}
