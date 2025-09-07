import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import TabLayout from '../(tabs)/_layout'
import Workers from '../(tabs)/workers'
import Finances from '../Finances'
import NotFoundScreen from '../NotFound'
import Profile from '../Profile'
import Settings from '../Settings'
import InventoryDetails from '../ViewInventory'

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        statusBarStyle: 'light',
        animationTypeForReplace: 'push',
      }}
      initialRouteName="Tabs"
    >
      <Stack.Screen name="Tabs" component={TabLayout} />
      <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Finances" component={Finances} />
      <Stack.Screen name="InventoryDetails" component={InventoryDetails} />
      <Stack.Screen name="ViewWorker" component={Workers} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
    </Stack.Navigator>
  )
}

export default AppStack