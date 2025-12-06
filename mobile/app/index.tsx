import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import Layout from '../components/Layout';
import InputBar from '../components/InputBar';
import PlatformBadge from '../components/PlatformBadge';
import MetadataCard from '../components/MetadataCard';
import DownloadOptions from '../components/DownloadOptions';
import ProgressIndicator, { ProgressStatus } from '../components/ProgressIndicator';
import { Platform } from '../../shared/types';
import { downloadFile, shareFile } from '../lib/mobileFeatures';

export default function Index() {
  const [url, setUrl] = useState('');
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [metadata, setMetadata] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ProgressStatus>('idle');
  const [downloadedFileUri, setDownloadedFileUri] = useState<string | null>(null);

  const handleSubmit = async () => {
    // Placeholder for actual implementation
    setIsLoading(true);
    setError('');
    
    // Simulate platform detection
    setTimeout(() => {
      setPlatform('youtube');
      setIsLoading(false);
    }, 1000);
  };

  const handleDownload = async (format: string, quality: string) => {
    try {
      setStatus('downloading');
      setProgress(0);
      
      // Placeholder URL - in real implementation, this would come from the API
      const downloadUrl = 'https://example.com/video.mp4';
      const filename = `download_${Date.now()}.${format === 'audio' ? 'mp3' : 'mp4'}`;
      
      // Download file with progress tracking
      const fileUri = await downloadFile(downloadUrl, filename, (downloadProgress) => {
        setProgress(downloadProgress);
      });
      
      setDownloadedFileUri(fileUri);
      setStatus('complete');
      
      // Ask user if they want to share
      Alert.alert(
        'Download Complete',
        'Would you like to share this file?',
        [
          { text: 'Not Now', style: 'cancel' },
          { text: 'Share', onPress: () => handleShare(fileUri, filename) },
        ]
      );
    } catch (err) {
      setStatus('error');
      setError('Download failed. Please try again.');
      console.error('Download error:', err);
    }
  };

  const handleShare = async (fileUri: string, filename: string) => {
    try {
      await shareFile(fileUri, filename);
    } catch (err) {
      Alert.alert('Error', 'Failed to share file');
      console.error('Share error:', err);
    }
  };

  return (
    <Layout>
      <View className="flex-1 px-4 py-6">
        {/* Hero Section */}
        <View className="items-center mb-8">
          <Text className="text-3xl font-bold text-foreground text-center mb-2">
            Download from Any Platform
          </Text>
          <Text className="text-foreground/60 text-center">
            YouTube, Instagram, TikTok, and more
          </Text>
        </View>

        {/* Input Bar */}
        <View className="mb-6">
          <InputBar
            value={url}
            onChange={setUrl}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </View>

        {/* Platform Badge */}
        {platform && (
          <View className="items-center mb-6">
            <PlatformBadge platform={platform} />
          </View>
        )}

        {/* Metadata Card (example) */}
        {platform && (
          <View className="mb-6">
            <MetadataCard
              title="Example Video Title"
              thumbnail="https://via.placeholder.com/640x360"
              author="Example Author"
              duration="5:30"
              platform={platform}
            />
          </View>
        )}

        {/* Download Options (example) */}
        {platform && (
          <View className="mb-6">
            <DownloadOptions
              formats={[
                { type: 'video', label: 'Video', icon: 'video' },
                { type: 'audio', label: 'Audio', icon: 'audio' },
              ]}
              qualities={[
                { value: '1080p', label: '1080p HD', available: true },
                { value: '720p', label: '720p', available: true },
                { value: '480p', label: '480p', available: true },
              ]}
              onDownload={handleDownload}
              isDownloading={status === 'downloading'}
            />
          </View>
        )}

        {/* Progress Indicator */}
        {status !== 'idle' && (
          <View className="mb-6">
            <ProgressIndicator
              progress={progress}
              status={status}
            />
          </View>
        )}

        {/* Share button (shown after successful download) */}
        {downloadedFileUri && status === 'complete' && (
          <View className="mb-6">
            <TouchableOpacity
              onPress={() => handleShare(downloadedFileUri, 'download.mp4')}
              className="px-6 py-4 rounded-lg bg-gradient-blue flex-row items-center justify-center gap-3"
              activeOpacity={0.8}
            >
              <Text className="text-white text-xl">📤</Text>
              <Text className="text-white font-bold text-lg">Share File</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Layout>
  );
}
