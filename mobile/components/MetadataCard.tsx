import { View, Text, Image, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Platform } from '../../shared/types';

interface MetadataCardProps {
  title: string;
  thumbnail: string;
  author: string;
  duration?: string;
  platform: Platform;
}

export default function MetadataCard({
  title,
  thumbnail,
  author,
  duration,
  platform,
}: MetadataCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Animated.View
      entering={FadeInUp.duration(400)}
      className="w-full"
    >
      <View className="rounded-xl bg-glass-bg border border-border overflow-hidden">
        {/* Thumbnail */}
        <View className="w-full aspect-video bg-foreground/5">
          {!imageError ? (
            <>
              {!imageLoaded && (
                <View className="absolute inset-0 items-center justify-center">
                  <ActivityIndicator size="large" color="#8B5CF6" />
                </View>
              )}
              <Image
                source={{ uri: thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            </>
          ) : (
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-foreground/40 text-4xl">🖼️</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View className="p-4">
          {/* Title */}
          <Text className="text-lg font-bold text-foreground mb-3" numberOfLines={2}>
            {title}
          </Text>

          {/* Metadata */}
          <View className="flex-row flex-wrap items-center gap-4">
            {/* Author */}
            <View className="flex-row items-center gap-2">
              <Text className="text-foreground/70">👤</Text>
              <Text className="text-sm text-foreground/70" numberOfLines={1}>
                {author}
              </Text>
            </View>

            {/* Duration */}
            {duration && (
              <View className="flex-row items-center gap-2">
                <Text className="text-foreground/70">⏱️</Text>
                <Text className="text-sm text-foreground/70">{duration}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
