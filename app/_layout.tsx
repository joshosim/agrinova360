import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import {
  QueryClient,
  QueryClientProvider
} from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { ActivityIndicator, Platform, StatusBar, View } from 'react-native';
import 'react-native-reanimated';
import Router from './routes/Router';

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SoraRegular: require('../assets/fonts/Sora-Regular.ttf'),
    SoraBold: require('../assets/fonts/Sora-Bold.ttf'),
    SoraThin: require('../assets/fonts/Sora-Thin.ttf')
  });

  if (!loaded === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (loaded) {
    console.log("Loaded")
  }

  return (
    <AuthProvider>
      <StatusBar barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'} />
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

