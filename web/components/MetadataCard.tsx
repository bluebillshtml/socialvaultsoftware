'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Platform } from '@/../../shared/types';
import { User, Clock } from 'lucide-react';
import Image from 'next/image';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="relative rounded-xl backdrop-blur-md bg-glass-bg border border-border overflow-hidden transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video bg-foreground/5">
          {!imageError ? (
            <>
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                </div>
              )}
              <Image
                src={thumbnail}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-opacity duration-300 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                loading="lazy"
                quality={75}
                unoptimized={thumbnail.startsWith('http') && !thumbnail.includes('i.ytimg.com') && !thumbnail.includes('i.pinimg.com') && !thumbnail.includes('pbs.twimg.com')}
              />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-foreground/40">
              <svg
                className="w-16 h-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          {/* Title */}
          <h3 className="text-lg sm:text-xl font-bold text-foreground font-geist mb-3 sm:mb-4 line-clamp-2">
            {title}
          </h3>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-foreground/70 font-jakarta">
            {/* Author */}
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="truncate max-w-[150px] sm:max-w-none">{author}</span>
            </div>

            {/* Duration (if available) */}
            {duration && (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span>{duration}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
