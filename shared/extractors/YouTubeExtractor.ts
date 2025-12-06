import ytdl from 'ytdl-core';
import axios from 'axios';
import { BasePlatformExtractor } from './BasePlatformExtractor';
import { ContentMetadata, DownloadFormat, Quality } from '../types';

export class YouTubeExtractor extends BasePlatformExtractor {
  platform = 'youtube' as const;
  
  // YouTube Data API v3 endpoint
  private readonly YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
  private readonly apiKey = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;

  async extractMetadata(url: string): Promise<ContentMetadata> {
    try {
      if (!this.validateUrl(url)) {
        throw new Error('Invalid URL format');
      }

      const videoId = this.extractVideoId(url);

      // If API key is available, use YouTube Data API v3 (most reliable)
      if (this.apiKey) {
        try {
          const apiUrl = `${this.YOUTUBE_API_BASE}/videos?part=snippet,contentDetails&id=${videoId}&key=${this.apiKey}`;
          const response = await axios.get(apiUrl, { timeout: 5000 });
          
          if (response.data.items && response.data.items.length > 0) {
            const video = response.data.items[0];
            const snippet = video.snippet;
            const duration = this.parseDuration(video.contentDetails.duration);
            
            return {
              title: snippet.title,
              thumbnail: snippet.thumbnails.maxres?.url || snippet.thumbnails.high?.url || snippet.thumbnails.default?.url,
              author: snippet.channelTitle,
              duration,
              platform: this.platform,
              url,
              availableFormats: this.getSupportedFormats(),
              availableQualities: this.getSupportedQualities(),
            };
          }
        } catch (apiError) {
          console.warn('YouTube Data API failed, trying fallback:', apiError);
        }
      }

      // Try ytdl-core
      try {
        const info = await ytdl.getInfo(url);
        const videoDetails = info.videoDetails;

        return {
          title: videoDetails.title,
          thumbnail: videoDetails.thumbnails[videoDetails.thumbnails.length - 1]?.url || '',
          author: videoDetails.author.name,
          duration: parseInt(videoDetails.lengthSeconds),
          platform: this.platform,
          url,
          availableFormats: this.getSupportedFormats(),
          availableQualities: this.getAvailableQualities(info),
        };
      } catch (ytdlError) {
        console.warn('ytdl-core failed, trying oEmbed API:', ytdlError);
        
        // Fallback: Use YouTube oEmbed API
        try {
          const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
          const response = await axios.get(oembedUrl, {
            timeout: 5000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
          });
          
          return {
            title: response.data.title || 'YouTube Video',
            thumbnail: response.data.thumbnail_url || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            author: response.data.author_name || 'YouTube Creator',
            duration: undefined,
            platform: this.platform,
            url,
            availableFormats: this.getSupportedFormats(),
            availableQualities: this.getSupportedQualities(),
          };
        } catch (fallbackError) {
          console.warn('All APIs failed, using basic data:', fallbackError);
          
          // Last resort: basic data with thumbnail
          return {
            title: 'YouTube Video (Limited Metadata Available)',
            thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
            author: 'YouTube Creator',
            duration: undefined,
            platform: this.platform,
            url,
            availableFormats: this.getSupportedFormats(),
            availableQualities: this.getSupportedQualities(),
          };
        }
      }
    } catch (error) {
      this.handleError(error, 'Failed to extract YouTube metadata');
    }
  }

  /**
   * Parse ISO 8601 duration format (e.g., PT4M13S) to seconds
   */
  private parseDuration(duration: string): number {
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;
    
    const hours = parseInt(match[1] || '0');
    const minutes = parseInt(match[2] || '0');
    const seconds = parseInt(match[3] || '0');
    
    return hours * 3600 + minutes * 60 + seconds;
  }

  /**
   * Extract video ID from YouTube URL
   */
  private extractVideoId(url: string): string {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return 'dQw4w9WgXcQ'; // Fallback video ID
  }

  async getDownloadUrl(
    url: string,
    format: string,
    quality?: string
  ): Promise<string> {
    try {
      // For thumbnail, we can always provide a direct URL
      if (format === 'thumbnail') {
        const videoId = this.extractVideoId(url);
        return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      }

      // Try ytdl-core first
      try {
        const info = await ytdl.getInfo(url);

        if (format === 'audio') {
          const audioFormat = ytdl.chooseFormat(info.formats, {
            quality: 'highestaudio',
            filter: 'audioonly',
          });
          return audioFormat.url;
        }

        if (format === 'video') {
          const qualityLabel = quality || '720p';
          const videoFormat = ytdl.chooseFormat(info.formats, {
            quality: qualityLabel,
            filter: 'videoandaudio',
          });
          return videoFormat.url;
        }

        throw new Error(`Unsupported format: ${format}`);
      } catch (ytdlError) {
        console.warn('ytdl-core download failed:', ytdlError);
        
        // For video/audio downloads, we need to inform the user about alternatives
        const videoId = this.extractVideoId(url);
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        throw new Error(
          `Direct YouTube downloads are currently unavailable. ` +
          `You can:\n` +
          `1. Use YouTube Premium for offline downloads\n` +
          `2. Use browser extensions like Video DownloadHelper\n` +
          `3. Use third-party services like y2mate.com or savefrom.net\n` +
          `4. For developers: Implement YouTube Data API v3 with OAuth\n\n` +
          `Video URL: ${youtubeUrl}`
        );
      }
    } catch (error) {
      this.handleError(error, 'Failed to get YouTube download URL');
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
        type: 'audio',
        label: 'Audio (MP3)',
        icon: 'music',
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
      { value: '1080p', label: '1080p (Full HD)', available: true },
      { value: '720p', label: '720p (HD)', available: true },
      { value: '480p', label: '480p (SD)', available: true },
      { value: '360p', label: '360p', available: true },
    ];
  }

  /**
   * Get available qualities from video info
   */
  private getAvailableQualities(info: ytdl.videoInfo): Quality[] {
    const formats = info.formats.filter((f) => f.hasVideo && f.hasAudio);
    const qualities = new Set<string>();

    formats.forEach((format) => {
      if (format.qualityLabel) {
        qualities.add(format.qualityLabel);
      }
    });

    const standardQualities = ['1080p', '720p', '480p', '360p'];
    return standardQualities.map((q) => ({
      value: q,
      label: q === '1080p' ? '1080p (Full HD)' : q === '720p' ? '720p (HD)' : q === '480p' ? '480p (SD)' : q,
      available: qualities.has(q),
    }));
  }
}
