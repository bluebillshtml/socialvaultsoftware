import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { AlertTriangle, RefreshCw } from 'lucide-react-native';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary component for React Native to catch and handle errors gracefully
 * Implements Requirements 11.5 - graceful error handling
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState({
      errorInfo,
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // In production, you might want to log to an error reporting service
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View className="flex-1 bg-background items-center justify-center p-4">
          <View className="max-w-md w-full rounded-xl bg-glass-bg border border-error/50 p-6 space-y-4">
            {/* Error Icon */}
            <View className="items-center mb-4">
              <View className="w-16 h-16 rounded-full bg-error/10 items-center justify-center">
                <AlertTriangle size={32} color="#ef4444" />
              </View>
            </View>

            {/* Error Title */}
            <View className="items-center space-y-2 mb-4">
              <Text className="text-xl font-semibold text-foreground font-geist text-center">
                Something went wrong
              </Text>
              <Text className="text-sm text-foreground/70 font-jakarta text-center">
                We encountered an unexpected error. Please try again.
              </Text>
            </View>

            {/* Error Details (only in development) */}
            {__DEV__ && this.state.error && (
              <ScrollView className="mt-4 p-3 rounded-lg bg-foreground/5 border border-border max-h-40">
                <Text className="text-xs font-mono text-error">
                  {this.state.error.toString()}
                </Text>
                {this.state.errorInfo && (
                  <Text className="mt-2 text-xs text-foreground/50">
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            {/* Action Button */}
            <TouchableOpacity
              onPress={this.handleReset}
              className="flex-row items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-purple mt-4"
            >
              <RefreshCw size={16} color="#ffffff" />
              <Text className="text-white font-jakarta font-medium">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
