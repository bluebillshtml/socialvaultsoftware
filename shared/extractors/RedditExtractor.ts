import axios from 'axios';
import { BasePlatformExtractor } from './BasePlatformExtractor';
import { ContentMetadata, DownloadFormat, Quality } from '../types';

export class RedditExtractor extends BasePlatformExtractor {
  platform = 'reddit' as const;

  async extractMetadata(url: string): Promise<ContentMetadata> {
    try {
      if (!this.validateUrl(url)) {
        throw new Error('Invalid URL format');
      }

      // Convert URL to JSON API endpoint
      const jsonUrl = url.endsWith('.json') ? url : `${url}.json`;

      const response = await axios.get(jsonUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const postData = response.data[0]?.data?.children?.[0]?.data;
      if (!postData) {
        throw new Error('Failed to parse Reddit data');
      }

      // Determine content type
      const isVideo = postData.is_video || postData.post_hint === 'hosted:video';
      const isImage = postData.post_hint === 'image' || postData.url?.match(/\.(jpg|jpeg|png|gif)$/i);
      const isGallery = postData.is_gallery;

      const availableFormats = this.getSupportedFormats().filter((format) => {
        if (isVideo && format.type === 'video') return true;
        if ((isImage || isGallery) && format.type === 'image') return true;
        if (format.type === 'thumbnail') return true;
        return false;
      });

      // Get thumbnail - handle various Reddit thumbnail formats
      let thumbnail = '';
      if (postData.thumbnail && postData.thumbnail.startsWith('http')) {
        thumbnail = postData.thumbnail;
      } else if (postData.preview?.images?.[0]?.source?.url) {
        // Decode HTML entities in preview URL
        thumbnail = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
      } else if (postData.url) {
        thumbnail = postData.url;
      }

      // Format duration if available
      const duration = postData.media?.reddit_video?.duration || 
                      postData.secure_media?.reddit_video?.duration;

      return {
        title: postData.title || 'Reddit Post',
        thumbnail,
        author: postData.author ? `u/${postData.author}` : 'Reddit User',
        duration,
        platform: this.platform,
        url,
        availableFormats,
        availableQualities: this.getSupportedQualities(),
      };
    } catch (error) {
      this.handleError(error, 'Failed to extract Reddit metadata');
    }
  }

  async getDownloadUrl(
    url: string,
    format: string,
    quality?: string
  ): Promise<string> {
    try {
      // Convert URL to JSON API endpoint
      const jsonUrl = url.endsWith('.json') ? url : `${url}.json`;

      const response = await axios.get(jsonUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const postData = response.data[0]?.data?.children?.[0]?.data;
      if (!postData) {
        throw new Error('Failed to parse Reddit data');
      }

      if (format === 'video') {
        const videoUrl = postData.media?.reddit_video?.fallback_url || 
                        postData.secure_media?.reddit_video?.fallback_url;
        if (!videoUrl) {
          throw new Error('No video URL found');
        }
        return videoUrl;
      }

      if (format === 'image') {
        // Handle gallery posts
        if (postData.is_gallery) {
          const galleryUrls = await this.getGalleryUrls(url);
          if (galleryUrls.length > 0) {
            // Return first image URL (caller should use getGalleryUrls for all images)
            return galleryUrls[0];
          }
        }

        // Handle single image posts
        let imageUrl = postData.url;
        
        // If URL doesn't look like an image, try preview
        if (!imageUrl?.match(/\.(jpg|jpeg|png|gif)$/i)) {
          if (postData.preview?.images?.[0]?.source?.url) {
            imageUrl = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
          }
        }

        if (!imageUrl) {
          throw new Error('No image URL found');
        }
        return imageUrl;
      }

      if (format === 'thumbnail') {
        let thumbnailUrl = '';
        
        if (postData.thumbnail && postData.thumbnail.startsWith('http')) {
          thumbnailUrl = postData.thumbnail;
        } else if (postData.preview?.images?.[0]?.source?.url) {
          thumbnailUrl = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
        } else if (postData.url) {
          thumbnailUrl = postData.url;
        }

        if (!thumbnailUrl) {
          throw new Error('No thumbnail URL found');
        }
        return thumbnailUrl;
      }

      throw new Error(`Unsupported format: ${format}`);
    } catch (error) {
      this.handleError(error, 'Failed to get Reddit download URL');
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

  /**
   * Get all images from a gallery post
   */
  async getGalleryUrls(url: string): Promise<string[]> {
    try {
      const jsonUrl = url.endsWith('.json') ? url : `${url}.json`;

      const response = await axios.get(jsonUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      const postData = response.data[0]?.data?.children?.[0]?.data;
      if (!postData || !postData.is_gallery) {
        return [];
      }

      const galleryData = postData.gallery_data?.items || [];
      const mediaMetadata = postData.media_metadata || {};

      const urls = galleryData.map((item: any) => {
        const mediaId = item.media_id;
        const media = mediaMetadata[mediaId];
        
        // Get the highest quality image URL
        let imageUrl = media?.s?.u || media?.s?.gif || '';
        
        // Decode HTML entities
        if (imageUrl) {
          imageUrl = imageUrl.replace(/&amp;/g, '&');
        }
        
        return imageUrl;
      }).filter((url: string) => url);

      return urls;
    } catch (error) {
      this.handleError(error, 'Failed to get Reddit gallery URLs');
    }
  }
}
