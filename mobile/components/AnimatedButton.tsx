import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { springConfig } from '../lib/animations';

interface AnimatedButtonProps {
  onPress: () => void;
  title: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function AnimatedButton({
  onPress,
  title,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  className = '',
}: AnimatedButtonProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, springConfig);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, springConfig);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-purple';
      case 'secondary':
        return 'bg-gradient-blue';
      case 'outline':
        return 'bg-transparent border-2 border-primary';
      default:
        return 'bg-gradient-purple';
    }
  };

  const getTextColor = () => {
    return variant === 'outline' ? 'text-primary' : 'text-white';
  };

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled || loading}
      style={animatedStyle}
      className={`px-6 py-4 rounded-lg flex-row items-center justify-center gap-3 ${getVariantStyles()} ${
        disabled || loading ? 'opacity-50' : ''
      } ${className}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <>
          <ActivityIndicator size="small" color="#fff" />
          <Text className={`font-bold text-lg ${getTextColor()}`}>Loading...</Text>
        </>
      ) : (
        <>
          {icon && <Text className="text-xl">{icon}</Text>}
          <Text className={`font-bold text-lg ${getTextColor()}`}>{title}</Text>
        </>
      )}
    </AnimatedTouchable>
  );
}
