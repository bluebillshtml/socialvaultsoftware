'use client';

import React from 'react';
import { useTheme } from '@/lib/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-background" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-purple opacity-20 blur-3xl rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-blue opacity-20 blur-3xl rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-orange opacity-10 blur-3xl rounded-full" />
      </div>

      {/* Header */}
      <header className="relative z-10 border-b border-border backdrop-blur-md bg-glass-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-purple flex items-center justify-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
            <h1 className="text-lg sm:text-xl font-bold font-geist text-foreground">
              SocialVault
            </h1>
          </div>
          
          <ThemeToggle />
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto border-t border-border backdrop-blur-md bg-glass-bg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs sm:text-sm text-foreground/60 font-jakarta text-center md:text-left">
              © 2024 SocialVault. Download public content responsibly.
            </p>
            <div className="flex items-center gap-4 sm:gap-6">
              <a
                href="#"
                className="text-xs sm:text-sm text-foreground/60 hover:text-foreground transition-colors font-jakarta"
              >
                Privacy
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-foreground/60 hover:text-foreground transition-colors font-jakarta"
              >
                Terms
              </a>
              <a
                href="#"
                className="text-xs sm:text-sm text-foreground/60 hover:text-foreground transition-colors font-jakarta"
              >
                About
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
