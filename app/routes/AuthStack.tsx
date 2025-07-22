import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Register from '../Index';
import AuthLogin from '../Login';
import AuthLoginAsFarmer from '../LoginAsFarmer';
import AuthSignup from '../Signup';
import FarmerSignup from '../SignupFarmer';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'light',
        animationTypeForReplace: 'push',
      }}
      initialRouteName='Index'>
      <Stack.Screen name="Index" component={Register} />
      <Stack.Screen name="Login" component={AuthLogin} />
      <Stack.Screen name="LoginAsFarmer" component={AuthLoginAsFarmer} />
      <Stack.Screen name="SignupFarmer" component={FarmerSignup} />
      <Stack.Screen name="Signup" component={AuthSignup} />
    </Stack.Navigator>
  );
};

export default AuthStack
