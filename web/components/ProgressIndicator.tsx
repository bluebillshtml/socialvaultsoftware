'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

export type ProgressStatus = 'idle' | 'fetching' | 'downloading' | 'complete' | 'error';

interface ProgressIndicatorProps {
  progress: number;
  status: ProgressStatus;
  message?: string;
  onRetry?: () => void;
}

export default function ProgressIndicator({
  progress,
  status,
  message,
  onRetry,
}: ProgressIndicatorProps) {
  if (status === 'idle') {
    return null;
  }

  const getStatusConfig = () => {
    switch (status) {
      case 'fetching':
        return {
          icon: Loader2,
          iconClass: 'text-primary animate-spin',
          bgClass: 'bg-primary/10',
          borderClass: 'border-primary/50',
          message: message || 'Fetching content information...',
        };
      case 'downloading':
        return {
          icon: Loader2,
          iconClass: 'text-accent animate-spin',
          bgClass: 'bg-accent/10',
          borderClass: 'border-accent/50',
          message: message || `Downloading... ${progress}%`,
        };
      case 'complete':
        return {
          icon: CheckCircle,
          iconClass: 'text-success',
          bgClass: 'bg-success/10',
          borderClass: 'border-success/50',
          message: message || 'Download complete!',
        };
      case 'error':
        return {
          icon: XCircle,
          iconClass: 'text-error',
          bgClass: 'bg-error/10',
          borderClass: 'border-error/50',
          message: message || 'Download failed. Please try again.',
        };
      default:
        return {
          icon: Loader2,
          iconClass: 'text-foreground/50',
          bgClass: 'bg-foreground/5',
          borderClass: 'border-border',
          message: message || '',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div
          className={`rounded-xl backdrop-blur-md border ${config.borderClass} ${config.bgClass} p-4 sm:p-6`}
        >
          {/* Status Icon and Message */}
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <Icon className={`w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 ${config.iconClass}`} />
            <p className="text-foreground font-jakarta font-medium text-sm sm:text-base">{config.message}</p>
          </div>

          {/* Progress Bar (only show for downloading status) */}
          {status === 'downloading' && (
            <div className="relative w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
          )}

          {/* Retry Button (only show for error status) */}
          {status === 'error' && onRetry && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={onRetry}
              className="mt-3 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-lg bg-gradient-purple text-white font-jakarta font-medium hover:opacity-90 transition-opacity"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </motion.button>
          )}

          {/* Actionable Suggestions for Errors */}
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 text-xs text-foreground/60 font-jakarta"
            >
              <p>Suggestions:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Check that the URL is correct and accessible</li>
                <li>Ensure the content is public (not private or restricted)</li>
                <li>Try again in a few moments if rate limited</li>
                <li>Check your internet connection</li>
              </ul>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
