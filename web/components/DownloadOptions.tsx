'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Music, Image as ImageIcon, FileImage, Download, Loader2, ChevronDown } from 'lucide-react';

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

const formatIcons: Record<string, React.ComponentType<any>> = {
  video: Video,
  audio: Music,
  image: ImageIcon,
  thumbnail: FileImage,
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="rounded-xl backdrop-blur-md bg-glass-bg border border-border p-4 sm:p-6">
        {/* Format Selection */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-bold text-foreground font-geist mb-3 sm:mb-4">
            Select Format
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
            {formats.map((format) => {
              const Icon = formatIcons[format.type] || Video;
              const isSelected = selectedFormat === format.type;

              return (
                <button
                  key={format.type}
                  onClick={() => setSelectedFormat(format.type)}
                  disabled={isDownloading}
                  className={`relative p-3 sm:p-4 rounded-lg border transition-all duration-200 ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border bg-glass-bg hover:border-primary/50'
                  } ${isDownloading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex flex-col items-center gap-1.5 sm:gap-2">
                    <Icon
                      className={`w-5 h-5 sm:w-6 sm:h-6 ${
                        isSelected ? 'text-primary' : 'text-foreground/70'
                      }`}
                    />
                    <span
                      className={`text-xs sm:text-sm font-jakarta font-medium ${
                        isSelected ? 'text-primary' : 'text-foreground/70'
                      }`}
                    >
                      {format.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quality Selection */}
        {selectedFormat === 'video' && availableQualities.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-bold text-foreground font-geist mb-3 sm:mb-4">
              Select Quality
            </h3>
            <div className="relative">
              <button
                onClick={() => setIsQualityDropdownOpen(!isQualityDropdownOpen)}
                disabled={isDownloading}
                className={`w-full px-4 py-3 rounded-lg border border-border bg-glass-bg backdrop-blur-md flex items-center justify-between transition-all duration-200 hover:border-primary/50 ${
                  isDownloading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                }`}
              >
                <span className="text-foreground font-jakarta">
                  {qualities.find(q => q.value === selectedQuality)?.label || selectedQuality}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-foreground/70 transition-transform duration-200 ${
                    isQualityDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown */}
              {isQualityDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 rounded-lg border border-border bg-glass-bg backdrop-blur-md overflow-hidden z-10"
                >
                  {availableQualities.map((quality) => (
                    <button
                      key={quality.value}
                      onClick={() => {
                        setSelectedQuality(quality.value);
                        setIsQualityDropdownOpen(false);
                      }}
                      className={`w-full px-4 py-3 text-left font-jakarta transition-colors ${
                        selectedQuality === quality.value
                          ? 'bg-primary/10 text-primary'
                          : 'text-foreground hover:bg-foreground/5'
                      }`}
                    >
                      {quality.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        )}

        {/* Download Button */}
        <button
          onClick={handleDownload}
          disabled={isDownloading}
          className={`w-full px-4 sm:px-6 py-3 sm:py-4 rounded-lg bg-gradient-purple text-white font-jakarta font-bold text-base sm:text-lg flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 ${
            isDownloading
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:opacity-90 hover:shadow-lg hover:shadow-primary/20'
          }`}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Download</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
