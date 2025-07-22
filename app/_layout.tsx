import { AuthProvider } from '@/context/AuthContext';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { ActivityIndicator, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import TabLayout from './(tabs)/_layout';
import HomePage from './(tabs)/home';
import Inventory from './(tabs)/inventory';
import Workers from './(tabs)/workers';
import Finances from './Finances';
import AuthLogin from './Login';
import AuthLoginAsFarmer from './LoginAsFarmer';
import NotFoundScreen from './NotFound';
import Onboarding from './Onboarding';
import Profile from './Profile';
import { Routes } from './Routes';
import Settings from './Settings';
import AuthSignup from './Signup';
import FarmerSignup from './SignupFarmer';

const Stack = createNativeStackNavigator<Routes>();

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


  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <StatusBar barStyle={Platform.OS === 'ios' ? 'light-content' : 'dark-content'} />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              statusBarStyle: 'light',
              animationTypeForReplace: 'push',
            }}
            initialRouteName="Login">
            {/* initialRouteName={initialRoute as any}> */}
            <Stack.Screen name="Index" component={HomePage} />
            <Stack.Screen name="Login" component={AuthLogin} />
            <Stack.Screen name="LoginAsFarmer" component={AuthLoginAsFarmer} />
            <Stack.Screen name="SignupFarmer" component={FarmerSignup} />
            <Stack.Screen name="Signup" component={AuthSignup} />
            <Stack.Screen name="Tabs" component={TabLayout} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Settings" component={Settings} />
            <Stack.Screen name="Finances" component={Finances} />
            <Stack.Screen name="ViewInventory" component={Inventory} />
            <Stack.Screen name="ViewWorker" component={Workers} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="NotFound" component={NotFoundScreen} />
          </Stack.Navigator>
        </ThemeProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
})

