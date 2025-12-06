import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../lib/ThemeContext';
import ErrorBoundary from '../components/ErrorBoundary';
import '../global.css';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: '#05040A',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen 
              name="index" 
              options={{ 
                title: 'SocialVault',
                headerShown: true,
              }} 
            />
          </Stack>
        </ThemeProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
