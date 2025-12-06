import { View, TextInput, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { springConfig } from '../lib/animations';

interface InputBarProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  error?: string;
  placeholder?: string;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function InputBar({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  error,
  placeholder = 'Paste a link from YouTube, Instagram, TikTok...',
}: InputBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const scale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleButtonPressIn = () => {
    scale.value = withSpring(0.95, springConfig);
  };

  const handleButtonPressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  return (
    <View className="w-full px-4">
      {/* Input container */}
      <View
        className={`rounded-xl bg-glass-bg border ${
          isFocused
            ? 'border-primary'
            : error
            ? 'border-error'
            : 'border-border'
        }`}
      >
        <View className="flex-row items-center px-4 py-3">
          {/* Search/Loading icon */}
          <View className="mr-3">
            {isLoading ? (
              <ActivityIndicator size="small" color="#8B5CF6" />
            ) : (
              <Text className="text-foreground/40">🔍</Text>
            )}
          </View>

          {/* Input field */}
          <TextInput
            value={value}
            onChangeText={onChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onSubmitEditing={onSubmit}
            editable={!isLoading}
            placeholder={placeholder}
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            className="flex-1 text-foreground text-base"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="go"
          />

          {/* Submit button */}
          {value && !isLoading && (
            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                onPress={onSubmit}
                onPressIn={handleButtonPressIn}
                onPressOut={handleButtonPressOut}
                className="ml-2 px-4 py-2 rounded-lg bg-gradient-purple"
                activeOpacity={0.8}
              >
                <Text className="text-white font-medium text-sm">Go</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>

      {/* Error message */}
      {error && (
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="mt-3 flex-row items-start gap-2"
        >
          <Text className="text-error text-sm">⚠️</Text>
          <Text className="text-error text-sm flex-1">{error}</Text>
        </Animated.View>
      )}

      {/* Helper text */}
      {!value && !error && (
        <Text className="mt-3 text-center text-xs text-foreground/50">
          Example: https://www.youtube.com/watch?v=dQw4w9WgXcQ
        </Text>
      )}
    </View>
  );
}
