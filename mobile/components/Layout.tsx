import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { ReactNode } from 'react';
import { useTheme } from '../lib/ThemeContext';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="border-b border-border bg-glass-bg px-4 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-lg bg-gradient-purple items-center justify-center">
              <Text className="text-white text-xl">📥</Text>
            </View>
            <Text className="text-xl font-bold text-foreground">
              SocialVault
            </Text>
          </View>
          
          <ThemeToggle />
        </View>
      </View>

      {/* Main content */}
      <ScrollView className="flex-1">
        {children}
      </ScrollView>

      {/* Footer */}
      <View className="border-t border-border bg-glass-bg px-4 py-4">
        <Text className="text-xs text-foreground/60 text-center">
          © 2024 SocialVault. Download public content responsibly.
        </Text>
      </View>
    </View>
  );
}
