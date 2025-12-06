'use client';

import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative w-14 h-7 rounded-full bg-glass-bg border border-border backdrop-blur-md transition-all duration-300 hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Toggle background */}
      <motion.div
        className="absolute inset-0.5 rounded-full bg-gradient-purple"
        initial={false}
        animate={{
          x: theme === 'dark' ? 0 : 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
        style={{
          width: '1.25rem',
          height: '1.25rem',
        }}
      />

      {/* Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-1.5">
        <motion.div
          initial={false}
          animate={{
            opacity: theme === 'dark' ? 1 : 0.3,
            scale: theme === 'dark' ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <Moon className="w-4 h-4 text-white" />
        </motion.div>
        <motion.div
          initial={false}
          animate={{
            opacity: theme === 'light' ? 1 : 0.3,
            scale: theme === 'light' ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          <Sun className="w-4 h-4 text-white" />
        </motion.div>
      </div>
    </button>
  );
}
