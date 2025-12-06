/**
 * Animation Showcase Component
 * Demonstrates all animations matching the web app
 */

import { View, Text } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeInLeft,
  FadeInRight,
  FadeOut,
  SlideInDown,
  SlideInUp,
  SlideInLeft,
  SlideInRight,
  ZoomIn,
  ZoomOut,
} from 'react-native-reanimated';

interface AnimationShowcaseProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeInUp' | 'fadeInDown' | 'fadeInLeft' | 'fadeInRight' | 'slideIn' | 'zoom';
  delay?: number;
  duration?: number;
}

export default function AnimationShowcase({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 300,
}: AnimationShowcaseProps) {
  const getAnimation = () => {
    switch (animation) {
      case 'fadeIn':
        return FadeIn.duration(duration).delay(delay);
      case 'fadeInUp':
        return FadeInUp.duration(duration).delay(delay);
      case 'fadeInDown':
        return FadeInDown.duration(duration).delay(delay);
      case 'fadeInLeft':
        return FadeInLeft.duration(duration).delay(delay);
      case 'fadeInRight':
        return FadeInRight.duration(duration).delay(delay);
      case 'slideIn':
        return SlideInDown.duration(duration).delay(delay);
      case 'zoom':
        return ZoomIn.duration(duration).delay(delay);
      default:
        return FadeIn.duration(duration).delay(delay);
    }
  };

  return (
    <Animated.View entering={getAnimation()} exiting={FadeOut.duration(200)}>
      {children}
    </Animated.View>
  );
}

/**
 * Pre-configured animation components for common use cases
 */

export function FadeInView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Animated.View entering={FadeIn.duration(300).delay(delay)} exiting={FadeOut.duration(200)}>
      {children}
    </Animated.View>
  );
}

export function SlideUpView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Animated.View entering={FadeInUp.duration(400).delay(delay)} exiting={FadeOut.duration(200)}>
      {children}
    </Animated.View>
  );
}

export function SlideDownView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(delay)} exiting={FadeOut.duration(200)}>
      {children}
    </Animated.View>
  );
}

export function ZoomInView({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <Animated.View entering={ZoomIn.duration(300).delay(delay)} exiting={ZoomOut.duration(200)}>
      {children}
    </Animated.View>
  );
}
