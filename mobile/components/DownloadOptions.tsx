import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';

export interface DownloadFormat {
  type: 'video' | 'audio' | 'image' | 'thumbnail';
  label: string;
  icon: string;
}

export interface Quality {
  value: string;
  label: string;
  available: boolean;
}

interface DownloadOptionsProps {
  formats: DownloadFormat[];
  qualities: Quality[];
  onDownload: (format: string, quality: string) => void;
  isDownloading?: boolean;
}

const formatIcons: Record<string, string> = {
  video: '🎥',
  audio: '🎵',
  image: '🖼️',
  thumbnail: '📸',
};

export default function DownloadOptions({
  formats,
  qualities,
  onDownload,
  isDownloading = false,
}: DownloadOptionsProps) {
  const [selectedFormat, setSelectedFormat] = useState<string>(formats[0]?.type || 'video');
  const [selectedQuality, setSelectedQuality] = useState<string>(
    qualities.find(q => q.available)?.value || '720p'
  );
  const [isQualityDropdownOpen, setIsQualityDropdownOpen] = useState(false);

  const handleDownload = () => {
    if (!isDownloading) {
      onDownload(selectedFormat, selectedQuality);
    }
  };

  const availableQualities = qualities.filter(q => q.available);

  return (
    <Animated.View
      entering={FadeInUp.duration(400).delay(100)}
      className="w-full"
    >
      <View className="rounded-xl bg-glass-bg border border-border p-4">
        {/* Format Selection */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-foreground mb-3">
            Select Format
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {formats.map((format) => {
              const icon = formatIcons[format.type] || '📁';
              const isSelected = selectedFormat === format.type;

              return (
                <TouchableOpacity
                  key={format.type}
                  onPress={() => setSelectedFormat(format.type)}
                  disabled={isDownloading}
                  className={`flex-1 min-w-[45%] p-4 rounded-lg border ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-glass-bg'
                  } ${isDownloading ? 'opacity-50' : ''}`}
                  activeOpacity={0.7}
                >
                  <View className="items-center gap-2">
                    <Text className="text-2xl">{icon}</Text>
                    <Text
                      className={`text-sm font-medium ${
                        isSelected ? 'text-primary' : 'text-foreground/70'
                      }`}
                    >
                      {format.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quality Selection */}
        {selectedFormat === 'video' && availableQualities.length > 0 && (
          <View className="mb-4">
            <Text className="text-lg font-bold text-foreground mb-3">
              Select Quality
            </Text>
            <TouchableOpacity
              onPress={() => setIsQualityDropdownOpen(!isQualityDropdownOpen)}
              disabled={isDownloading}
              className={`px-4 py-3 rounded-lg border border-border bg-glass-bg flex-row items-center justify-between ${
                isDownloading ? 'opacity-50' : ''
              }`}
              activeOpacity={0.7}
            >
              <Text className="text-foreground">
                {qualities.find(q => q.value === selectedQuality)?.label || selectedQuality}
              </Text>
              <Text className="text-foreground/70">
                {isQualityDropdownOpen ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {/* Dropdown */}
            {isQualityDropdownOpen && (
              <View className="mt-2 rounded-lg border border-border bg-glass-bg overflow-hidden">
                {availableQualities.map((quality) => (
                  <TouchableOpacity
                    key={quality.value}
                    onPress={() => {
                      setSelectedQuality(quality.value);
                      setIsQualityDropdownOpen(false);
                    }}
                    className={`px-4 py-3 ${
                      selectedQuality === quality.value
                        ? 'bg-primary/10'
                        : 'bg-transparent'
                    }`}
                    activeOpacity={0.7}
                  >
                    <Text
                      className={
                        selectedQuality === quality.value
                          ? 'text-primary'
                          : 'text-foreground'
                      }
                    >
                      {quality.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Download Button */}
        <TouchableOpacity
          onPress={handleDownload}
          disabled={isDownloading}
          className={`px-6 py-4 rounded-lg bg-gradient-purple flex-row items-center justify-center gap-3 ${
            isDownloading ? 'opacity-50' : ''
          }`}
          activeOpacity={0.8}
        >
          {isDownloading ? (
            <>
              <ActivityIndicator size="small" color="#fff" />
              <Text className="text-white font-bold text-lg">Downloading...</Text>
            </>
          ) : (
            <>
              <Text className="text-white text-xl">⬇️</Text>
              <Text className="text-white font-bold text-lg">Download</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
