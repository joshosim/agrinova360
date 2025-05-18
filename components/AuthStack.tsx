import Register from '@/app';
import AuthLogin from '@/app/login';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={AuthLogin} />
      <Stack.Screen name="register" component={Register} />
    </Stack.Navigator>
  );
}
