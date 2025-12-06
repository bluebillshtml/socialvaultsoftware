import axios from 'axios';
import * as cheerio from 'cheerio';
import { BasePlatformExtractor } from './BasePlatformExtractor';
import { ContentMetadata, DownloadFormat, Quality } from '../types';

export class FacebookExtractor extends BasePlatformExtractor {
  platform = 'facebook' as const;

  async extractMetadata(url: string): Promise<ContentMetadata> {
    try {
      if (!this.validateUrl(url)) {
        throw new Error('Invalid URL format');
      }

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);

      // Extract metadata from meta tags
      const title = $('meta[property="og:title"]').attr('content') || 
                    $('meta[name="description"]').attr('content') || 
                    'Facebook Post';
      
      const thumbnail = $('meta[property="og:image"]').attr('content') || '';
      const author = $('meta[property="og:site_name"]').attr('content') || 'Facebook User';

      // Determine available formats based on content
      const hasVideo = $('meta[property="og:video"]').length > 0;
      const hasImage = $('meta[property="og:image"]').length > 0;

      const availableFormats = this.getSupportedFormats().filter((format) => {
        if (hasVideo && format.type === 'video') return true;
        if (hasImage && format.type === 'image') return true;
        if (format.type === 'thumbnail') return true;
        return false;
      });

      return {
        title,
        thumbnail,
        author,
        duration: undefined,
        platform: this.platform,
        url,
        availableFormats,
        availableQualities: this.getSupportedQualities(),
      };
    } catch (error) {
      this.handleError(error, 'Failed to extract Facebook metadata');
    }
  }

  async getDownloadUrl(
    url: string,
    format: string,
    quality?: string
  ): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const $ = cheerio.load(response.data);

      if (format === 'video') {
        const videoUrl = $('meta[property="og:video"]').attr('content') ||
                        $('meta[property="og:video:url"]').attr('content');
        if (!videoUrl) {
          throw new Error('No video URL found');
        }
        return videoUrl;
      }

      if (format === 'image') {
        const imageUrl = $('meta[property="og:image"]').attr('content');
        if (!imageUrl) {
          throw new Error('No image URL found');
        }
        return imageUrl;
      }

      if (format === 'thumbnail') {
        const thumbnailUrl = $('meta[property="og:image"]').attr('content');
        if (!thumbnailUrl) {
          throw new Error('No thumbnail URL found');
        }
        return thumbnailUrl;
      }

      throw new Error(`Unsupported format: ${format}`);
    } catch (error) {
      this.handleError(error, 'Failed to get Facebook download URL');
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
        label: 'Image',
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
}
