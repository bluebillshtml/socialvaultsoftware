import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from '../lib/ThemeContext';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const toggleStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(theme === 'dark' ? 0 : 24, {
            damping: 15,
            stiffness: 150,
          }),
        },
      ],
    };
  });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      className="w-14 h-7 rounded-full bg-glass-bg border border-border justify-center"
      activeOpacity={0.7}
    >
      {/* Toggle indicator */}
      <Animated.View
        style={[toggleStyle]}
        className="absolute left-0.5 w-5 h-5 rounded-full bg-gradient-purple"
      />

      {/* Icons */}
      <View className="flex-row items-center justify-between px-1.5">
        <Text className="text-white text-xs">🌙</Text>
        <Text className="text-white text-xs">☀️</Text>
      </View>
    </TouchableOpacity>
  );
}
