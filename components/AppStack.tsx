import HomePage from '@/app/(tabs)/home';
import Profile from '@/app/profile';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="home" component={HomePage} />
      <Stack.Screen name="profile" component={Profile} />
      {/* Add more routes */}
    </Stack.Navigator>
  );
}
