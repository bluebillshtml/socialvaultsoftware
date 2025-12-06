import {
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';

/**
 * Animation configurations matching web app
 */

// Spring animation config
export const springConfig = {
  damping: 15,
  stiffness: 150,
  mass: 1,
};

// Timing animation config
export const timingConfig = {
  duration: 300,
  easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

// Fade in animation
export const fadeIn = (delay = 0) => ({
  entering: withDelay(
    delay,
    withTiming(1, { duration: 300, easing: Easing.ease })
  ),
  exiting: withTiming(0, { duration: 200, easing: Easing.ease }),
});

// Slide up animation
export const slideUp = (delay = 0) => ({
  entering: withDelay(
    delay,
    withSpring(0, springConfig)
  ),
  exiting: withTiming(20, timingConfig),
});

// Scale animation
export const scale = (delay = 0) => ({
  entering: withDelay(
    delay,
    withSpring(1, springConfig)
  ),
  exiting: withTiming(0.8, timingConfig),
});

// Bounce animation
export const bounce = () =>
  withSequence(
    withSpring(1.1, { damping: 10, stiffness: 200 }),
    withSpring(1, springConfig)
  );

// Shake animation
export const shake = () =>
  withSequence(
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(-10, { duration: 50 }),
    withTiming(10, { duration: 50 }),
    withTiming(0, { duration: 50 })
  );

// Pulse animation
export const pulse = () =>
  withSequence(
    withTiming(1.05, { duration: 150 }),
    withTiming(1, { duration: 150 })
  );

/**
 * Gesture animation helpers
 */

// Button press animation
export const buttonPress = {
  scale: 0.95,
  duration: 100,
};

// Card hover animation (for touchable cards)
export const cardPress = {
  scale: 0.98,
  duration: 150,
};

/**
 * Layout animation presets
 */

export const layoutAnimations = {
  fadeInUp: {
    opacity: fadeIn().entering,
    transform: [{ translateY: slideUp().entering }],
  },
  fadeInDown: {
    opacity: fadeIn().entering,
    transform: [{ translateY: slideUp().entering }],
  },
  fadeInLeft: {
    opacity: fadeIn().entering,
    transform: [{ translateX: slideUp().entering }],
  },
  fadeInRight: {
    opacity: fadeIn().entering,
    transform: [{ translateX: slideUp().entering }],
  },
};
