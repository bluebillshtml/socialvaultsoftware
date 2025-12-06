'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Platform } from '@/../../shared/types';
import {
  Youtube,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Image as ImageIcon,
  Video,
  HelpCircle,
} from 'lucide-react';

interface PlatformBadgeProps {
  platform: Platform;
  animated?: boolean;
}

// Platform configuration with colors and icons
const platformConfig: Record<
  Platform,
  { name: string; color: string; bgColor: string; Icon: React.ComponentType<any> }
> = {
  youtube: {
    name: 'YouTube',
    color: '#FF0000',
    bgColor: 'rgba(255, 0, 0, 0.1)',
    Icon: Youtube,
  },
  instagram: {
    name: 'Instagram',
    color: '#E4405F',
    bgColor: 'rgba(228, 64, 95, 0.1)',
    Icon: Instagram,
  },
  tiktok: {
    name: 'TikTok',
    color: '#00F2EA',
    bgColor: 'rgba(0, 242, 234, 0.1)',
    Icon: Video,
  },
  pinterest: {
    name: 'Pinterest',
    color: '#E60023',
    bgColor: 'rgba(230, 0, 35, 0.1)',
    Icon: ImageIcon,
  },
  twitter: {
    name: 'X (Twitter)',
    color: '#1DA1F2',
    bgColor: 'rgba(29, 161, 242, 0.1)',
    Icon: Twitter,
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    bgColor: 'rgba(24, 119, 242, 0.1)',
    Icon: Facebook,
  },
  reddit: {
    name: 'Reddit',
    color: '#FF4500',
    bgColor: 'rgba(255, 69, 0, 0.1)',
    Icon: Video,
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    bgColor: 'rgba(10, 102, 194, 0.1)',
    Icon: Linkedin,
  },
  unknown: {
    name: 'Unknown',
    color: '#6B7280',
    bgColor: 'rgba(107, 114, 128, 0.1)',
    Icon: HelpCircle,
  },
};

export default function PlatformBadge({ platform, animated = true }: PlatformBadgeProps) {
  const config = platformConfig[platform] || platformConfig.unknown;
  const { name, color, bgColor, Icon } = config;

  const badge = (
    <div
      className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg backdrop-blur-md border border-border font-jakarta text-xs sm:text-sm font-medium"
      style={{
        backgroundColor: bgColor,
        borderColor: `${color}40`,
      }}
    >
      <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color }} />
      <span className="text-foreground">{name}</span>
    </div>
  );

  if (!animated) {
    return badge;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {badge}
    </motion.div>
  );
}
