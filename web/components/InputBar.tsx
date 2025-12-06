'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
}

export default function InputBar({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  error,
  placeholder = 'Paste a link from YouTube, Instagram, TikTok, or other platforms...',
}: InputBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Handle paste detection
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text');
      if (pastedText && document.activeElement?.id === 'url-input') {
        // The onChange will be triggered by the input event
        // We just need to ensure the input is focused
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading && value.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-0">
      {/* Input container with glass-morphism */}
      <div
        className={`relative rounded-xl backdrop-blur-md bg-glass-bg border transition-all duration-300 ${
          isFocused
            ? 'border-primary shadow-lg shadow-primary/20'
            : error
            ? 'border-error'
            : 'border-border'
        }`}
      >
        {/* Search icon */}
        <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary animate-spin" />
          ) : (
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-foreground/40" />
          )}
        </div>

        {/* Input field */}
        <input
          id="url-input"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          disabled={isLoading}
          placeholder={placeholder}
          className="w-full pl-10 sm:pl-12 pr-16 sm:pr-20 py-3 sm:py-4 bg-transparent text-foreground placeholder:text-foreground/40 focus:outline-none font-jakarta disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Submit button */}
        {value.trim() && !isLoading && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={onSubmit}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-gradient-purple text-white font-jakarta font-medium hover:opacity-90 transition-opacity text-sm"
          >
            Go
          </motion.button>
        )}
      </div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mt-3 flex items-start gap-2 text-error text-sm font-jakarta"
          >
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text when empty */}
      {!value && !error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-3 text-center text-xs sm:text-sm text-foreground/50 font-jakarta px-4 sm:px-0"
        >
          Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
        </motion.p>
      )}
    </div>
  );
}
