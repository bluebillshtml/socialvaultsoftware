'use client';

import { useState, lazy, Suspense } from 'react';
import InputBar from '@/components/InputBar';
import PlatformBadge from '@/components/PlatformBadge';
import ProgressIndicator from '@/components/ProgressIndicator';
import { SkeletonMetadataCard, SkeletonDownloadOptions } from '@/components/Skeleton';
import { Platform } from '@/../../shared/types';

// Lazy load heavy components for better initial load performance
const MetadataCard = lazy(() => import('@/components/MetadataCard'));
const DownloadOptions = lazy(() => import('@/components/DownloadOptions'));

interface ContentMetadata {
  title: string;
  thumbnail: string;
  author: string;
  duration?: string;
  platform: Platform;
}

export default function Home() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [metadata, setMetadata] = useState<ContentMetadata | null>(null);
  const [formats, setFormats] = useState<any[]>([]);
  const [qualities, setQualities] = useState<any[]>([]);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<'idle' | 'fetching' | 'downloading' | 'complete' | 'error'>('idle');
  const [downloadMessage, setDownloadMessage] = useState<string | undefined>();

  // Handle URL submission and platform detection
  const handleSubmit = async () => {
    // Edge case: Empty input handling
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    setIsLoading(true);
    setError(undefined);
    setPlatform(null);
    setMetadata(null);
    setFormats([]);
    setQualities([]);
    setDownloadStatus('idle');

    // Create abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      // Step 1: Detect platform
      setDownloadStatus('fetching');
      setDownloadMessage('Detecting platform...');
      
      const detectResponse = await fetch('/api/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      if (!detectResponse.ok) {
        const errorData = await detectResponse.json();
        const errorMsg = errorData.error?.message || 'Failed to detect platform';
        
        // Edge case: Invalid URL handling
        if (errorData.error?.code === 'INVALID_URL') {
          throw new Error('Invalid URL format. Please enter a valid social media URL.');
        }
        
        throw new Error(errorMsg);
      }

      const detectData = await detectResponse.json();
      setPlatform(detectData.platform);

      // Step 2: Fetch metadata
      setDownloadMessage('Fetching content metadata...');
      
      const metadataResponse = await fetch('/api/metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, platform: detectData.platform }),
        signal: controller.signal,
      });

      if (!metadataResponse.ok) {
        const errorData = await metadataResponse.json();
        const errorMsg = errorData.error?.message || 'Failed to fetch metadata';
        
        // Edge case: Content not found handling
        if (errorData.error?.code === 'CONTENT_NOT_FOUND') {
          throw new Error('Content not found. The URL may be invalid or the content may have been removed.');
        }
        
        // Edge case: Private content handling
        if (errorData.error?.code === 'PRIVATE_CONTENT') {
          throw new Error('This content is private or restricted. We can only download public content.');
        }
        
        // Edge case: Rate limit handling
        if (errorData.error?.code === 'RATE_LIMITED') {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        
        throw new Error(errorMsg);
      }

      const metadataData = await metadataResponse.json();
      setMetadata({
        title: metadataData.metadata?.title || metadataData.title,
        thumbnail: metadataData.metadata?.thumbnail || metadataData.thumbnail,
        author: metadataData.metadata?.author || metadataData.author,
        duration: metadataData.metadata?.duration || metadataData.duration,
        platform: detectData.platform,
      });

      // Step 3: Fetch available formats and qualities
      setDownloadMessage('Loading download options...');
      
      const formatsResponse = await fetch('/api/formats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, platform: detectData.platform }),
        signal: controller.signal,
      });

      if (!formatsResponse.ok) {
        const errorData = await formatsResponse.json();
        throw new Error(errorData.error?.message || 'Failed to fetch formats');
      }

      const formatsData = await formatsResponse.json();
      setFormats(formatsData.formats || []);
      setQualities(formatsData.qualities || []);

      setDownloadStatus('idle');
      setDownloadMessage(undefined);
    } catch (err) {
      console.error('Error in user flow:', err);
      
      // Edge case: Network timeout handling
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out. Please check your connection and try again.');
        setDownloadStatus('error');
        setDownloadMessage('Request timed out. Please check your connection and try again.');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
        setError(errorMessage);
        setDownloadStatus('error');
        setDownloadMessage(errorMessage);
      }
    } finally {
      clearTimeout(timeoutId);
      setIsLoading(false);
    }
  };

  // Handle download initiation
  const handleDownload = async (format: string, quality: string) => {
    if (!url || !platform) return;

    setDownloadStatus('downloading');
    setDownloadProgress(0);
    setDownloadMessage('Preparing download...');

    // Create abort controller for timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout for downloads

    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, platform, format, quality }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error?.message || 'Download failed';
        
        // Edge case: Content not found handling
        if (errorData.error?.code === 'CONTENT_NOT_FOUND') {
          throw new Error('Content not found. The content may have been removed.');
        }
        
        // Edge case: Private content handling
        if (errorData.error?.code === 'PRIVATE_CONTENT') {
          throw new Error('Cannot download private or restricted content.');
        }
        
        // Edge case: Rate limit handling
        if (errorData.error?.code === 'RATE_LIMITED') {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        }
        
        throw new Error(errorMsg);
      }

      // Simulate progress updates (in a real implementation, this would come from the server)
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      const blob = await response.blob();
      clearInterval(progressInterval);
      setDownloadProgress(100);

      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      // Get filename from response headers or generate one
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : `download-${Date.now()}.${format}`;
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      setDownloadStatus('complete');
      setDownloadMessage('Download complete!');

      // Reset after 3 seconds
      setTimeout(() => {
        setDownloadStatus('idle');
        setDownloadProgress(0);
        setDownloadMessage(undefined);
      }, 3000);
    } catch (err) {
      console.error('Download error:', err);
      
      // Edge case: Network timeout handling
      if (err instanceof Error && err.name === 'AbortError') {
        setDownloadStatus('error');
        setDownloadMessage('Download timed out. Please try again.');
        setDownloadProgress(0);
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Download failed';
        setDownloadStatus('error');
        setDownloadMessage(errorMessage);
        setDownloadProgress(0);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  // Handle URL change
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setError(undefined);
    
    // Reset state when URL changes
    if (!newUrl.trim()) {
      setPlatform(null);
      setMetadata(null);
      setFormats([]);
      setQualities([]);
      setDownloadStatus('idle');
    }
  };

  return (
    <main className="min-h-screen bg-background relative">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-br from-white/10 to-white/0 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-purple-100 font-geist">
              Download from 8+ platforms
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light text-slate-50 tracking-tighter font-geist animate-slide-in-top px-4 sm:px-0">
            Your all-in-one
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-orange-400 bg-clip-text text-transparent">
              social media downloader
            </span>
          </h1>

          <p className="text-slate-300/90 text-sm sm:text-base max-w-2xl mx-auto font-geist animate-slide-in-bottom px-4 sm:px-0">
            Download videos, images, and audio from YouTube, Instagram, TikTok, Pinterest, X, Facebook, Reddit, and LinkedIn. 
            Fast, free, and easy to use.
          </p>
        </div>

        {/* Input Bar Section */}
        <div className="mb-6 sm:mb-8">
          <InputBar
            value={url}
            onChange={handleUrlChange}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Platform Detection Display */}
        {platform && (
          <div className="mb-6 sm:mb-8 flex justify-center animate-slide-in-bottom">
            <PlatformBadge platform={platform} animated />
          </div>
        )}

        {/* Metadata Display Section */}
        {metadata && (
          <div className="mb-6 sm:mb-8 animate-scale-in">
            <Suspense fallback={<SkeletonMetadataCard />}>
              <MetadataCard
                title={metadata.title}
                thumbnail={metadata.thumbnail}
                author={metadata.author}
                duration={metadata.duration}
                platform={metadata.platform}
              />
            </Suspense>
          </div>
        )}

        {/* Download Options Section */}
        {formats.length > 0 && (
          <div className="mb-6 sm:mb-8 animate-slide-in-bottom">
            <Suspense fallback={<SkeletonDownloadOptions />}>
              <DownloadOptions
                formats={formats}
                qualities={qualities}
                onDownload={handleDownload}
                isDownloading={downloadStatus === 'downloading'}
              />
            </Suspense>
          </div>
        )}

        {/* Progress Indicator Section */}
        {downloadStatus !== 'idle' && (
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <ProgressIndicator
              progress={downloadProgress}
              status={downloadStatus}
              message={downloadMessage}
              onRetry={downloadStatus === 'error' ? handleSubmit : undefined}
            />
          </div>
        )}

        {/* Example URLs */}
        <div className="mt-12 sm:mt-16 text-center space-y-3 animate-fade-in px-4 sm:px-0">
          <p className="text-xs uppercase text-slate-500 font-geist">
            Try with these example URLs
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <button className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105 hover:border-white/20 transition-all duration-300 font-geist">
              YouTube
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105 hover:border-white/20 transition-all duration-300 font-geist">
              Instagram
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105 hover:border-white/20 transition-all duration-300 font-geist">
              TikTok
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-slate-900/50 border border-white/10 text-slate-300 hover:bg-slate-800/50 hover:text-white hover:scale-105 hover:border-white/20 transition-all duration-300 font-geist">
              Pinterest
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
