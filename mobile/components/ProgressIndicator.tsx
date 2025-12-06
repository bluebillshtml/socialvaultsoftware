import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { RefreshCw } from 'lucide-react-native';

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
          icon: '🔍',
          showSpinner: true,
          bgClass: 'bg-primary/10',
          borderClass: 'border-primary/50',
          message: message || 'Fetching content information...',
        };
      case 'downloading':
        return {
          icon: '⬇️',
          showSpinner: true,
          bgClass: 'bg-accent/10',
          borderClass: 'border-accent/50',
          message: message || `Downloading... ${progress}%`,
        };
      case 'complete':
        return {
          icon: '✅',
          showSpinner: false,
          bgClass: 'bg-success/10',
          borderClass: 'border-success/50',
          message: message || 'Download complete!',
        };
      case 'error':
        return {
          icon: '❌',
          showSpinner: false,
          bgClass: 'bg-error/10',
          borderClass: 'border-error/50',
          message: message || 'Download failed. Please try again.',
        };
      default:
        return {
          icon: '⏳',
          showSpinner: false,
          bgClass: 'bg-foreground/5',
          borderClass: 'border-border',
          message: message || '',
        };
    }
  };

  const config = getStatusConfig();

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      className="w-full"
    >
      <View className={`rounded-xl border ${config.borderClass} ${config.bgClass} p-4`}>
        {/* Status Icon and Message */}
        <View className="flex-row items-center gap-3 mb-3">
          {config.showSpinner ? (
            <ActivityIndicator size="small" color="#8B5CF6" />
          ) : (
            <Text className="text-xl">{config.icon}</Text>
          )}
          <Text className="text-foreground font-medium text-base flex-1">
            {config.message}
          </Text>
        </View>

        {/* Progress Bar (only show for downloading status) */}
        {status === 'downloading' && (
          <View className="w-full h-2 bg-foreground/10 rounded-full overflow-hidden">
            <Animated.View
              className="h-full bg-gradient-blue rounded-full"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </View>
        )}

        {/* Retry Button (only show for error status) */}
        {status === 'error' && onRetry && (
          <TouchableOpacity
            onPress={onRetry}
            className="mt-3 flex-row items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-purple"
          >
            <RefreshCw size={16} color="#ffffff" />
            <Text className="text-white font-medium">Try Again</Text>
          </TouchableOpacity>
        )}

        {/* Actionable Suggestions for Errors */}
        {status === 'error' && (
          <View className="mt-3">
            <Text className="text-xs text-foreground/60 mb-1">Suggestions:</Text>
            <Text className="text-xs text-foreground/60">• Check that the URL is correct and accessible</Text>
            <Text className="text-xs text-foreground/60">• Ensure the content is public (not private)</Text>
            <Text className="text-xs text-foreground/60">• Try again in a few moments if rate limited</Text>
            <Text className="text-xs text-foreground/60">• Check your internet connection</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}
