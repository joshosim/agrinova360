import { Loading } from '@/components/Loading';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useEffect } from 'react';
import Register from '../Index';
import AuthLogin from '../Login';
import AuthLoginAsFarmer from '../LoginAsFarmer';
import Onboarding from '../Onboarding';
import AuthSignup from '../Signup';
import FarmerSignup from '../SignupFarmer';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [isFirstLaunch, setIsFirstLaunch] = React.useState<boolean | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (!hasLaunched === null) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
    };
    checkOnboarding();
  }, []);

  if (isFirstLaunch === null) {
    return <Loading />
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'light',
        animationTypeForReplace: 'push',
      }}
      initialRouteName='Index'>
      {isFirstLaunch ?
        (<Stack.Screen name="Onboarding" component={Onboarding} />) :
        (
          <>
            <Stack.Screen name="Index" component={Register} />
            <Stack.Screen name="Login" component={AuthLogin} />
            <Stack.Screen name="LoginAsFarmer" component={AuthLoginAsFarmer} />
            <Stack.Screen name="SignupFarmer" component={FarmerSignup} />
            <Stack.Screen name="Signup" component={AuthSignup} />
          </>
        )}


    </Stack.Navigator>
  );
};

export default AuthStack
