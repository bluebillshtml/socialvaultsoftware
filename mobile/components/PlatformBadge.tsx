import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Platform } from '../../shared/types';

interface PlatformBadgeProps {
  platform: Platform;
  animated?: boolean;
}

// Platform configuration with colors and icons
const platformConfig: Record<
  Platform,
  { name: string; color: string; bgColor: string; icon: string }
> = {
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    icon: '▶️',
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    bgColor: 'rgba(228, 64, 95, 0.1)',
    icon: '📷',
  },
  tiktok: {
    name: 'TikTok',
    color: '#00F2EA',
    bgColor: 'rgba(0, 242, 234, 0.1)',
    icon: '🎵',
  },
  pinterest: {
    name: 'Pinterest',
    color: '#E60023',
    bgColor: 'rgba(230, 0, 35, 0.1)',
    icon: '📌',
  },
  twitter: {
    name: 'X (Twitter)',
    color: '#1DA1F2',
    bgColor: 'rgba(29, 161, 242, 0.1)',
    icon: '🐦',
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    bgColor: 'rgba(24, 119, 242, 0.1)',
    icon: '👥',
  },
  reddit: {
    name: 'Reddit',
    color: '#FF4500',
    bgColor: 'rgba(255, 69, 0, 0.1)',
    icon: '🤖',
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    bgColor: 'rgba(10, 102, 194, 0.1)',
    icon: '💼',
  },
  unknown: {
    name: 'Unknown',
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    icon: '❓',
  },
};

export default function PlatformBadge({ platform, animated = true }: PlatformBadgeProps) {
  const config = platformConfig[platform] || platformConfig.unknown;
  const { name, color, bgColor, icon } = config;

  const badge = (
    <View
      className="flex-row items-center gap-2 px-4 py-2 rounded-lg border border-border"
      style={{ backgroundColor: bgColor, borderColor: `${color}40` }}
    >
      <Text style={{ color }}>{icon}</Text>
      <Text className="text-foreground text-sm font-medium">{name}</Text>
    </View>
  );

  if (!animated) {
    return badge;
  }

  return (
    <Animated.View entering={FadeInDown.duration(300)}>
      {badge}
    </Animated.View>
  );
}
