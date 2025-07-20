import { AppText } from '@/components/AppText';
import AuthTextFields from '@/components/AuthTextFields';
import { HelloWave } from '@/components/HelloWave';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, RootViewStyleProvider, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AuthLogin() {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const navigation = useNavigation<NavigationProp<RootViewStyleProvider>>();

  const goToSignup = () => {
    navigation.navigate(paths.auth.signup as never)
  }
  const { login, loading } = useAuth(); // use the provider's login function

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert('Login Successful');
      navigation.navigate(paths.home as never);
    } catch (error: any) {
      console.error('Login Error:', error.message);
      Alert.alert('Login Failed', error.message);
    }
  };
  const { user } = useAuth()

  // if (user) {
  //   navigation.navigate(paths.home as never);
  // }

  console.log("logged-out-user", user)

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? "light" : "auto"} />
      <View style={{ marginTop: 40 }}>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <Ionicons name='fast-food' size={75} color={'green'} />
        </View>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'center' }}>
          <AppText style={{ fontWeight: 600, fontSize: 25, textAlign: 'center', marginVertical: 20 }}>Welcome Back</AppText>
          <HelloWave />
        </View>
        <AppText style={{ fontWeight: 400, fontSize: 16, textAlign: 'center', marginBottom: 40 }}>Login to your AgriNOVA360 account</AppText>

        <View style={{ width: "100%" }}>
          <AuthTextFields
            keyBoardType='email-address'
            title="Email Address"
            onChange={(text) => setEmail(text)}
            value={email}
            placeHolderText='Email Address' />
          <AuthTextFields
            keyBoardType='default'
            title="Password"
            onChange={(text) => setPassword(text)}
            value={password}
            placeHolderText='Password' />

          <TouchableOpacity
            style={{ flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'center' }}
            onPress={goToSignup}>
            <AppText style={{}}>Don't have an account?</AppText>
            <AppText style={{
              textDecorationStyle: 'solid',
              textDecorationLine: 'underline',
              textDecorationColor: 'blue',
              color: 'blue',
            }}>Sign up here</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate(paths.auth.loginasfarmer as never)}>
            <AppText style={{
              textDecorationStyle: 'solid',
              textDecorationLine: 'underline',
              textDecorationColor: 'blue',
              color: 'blue',
            }}>Login as farmer here</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <AppText style={styles.buttonText}>{loading ? "Logging in" : "Login"}</AppText>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    padding: 10,

  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    padding: 20,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: "white",
    fontWeight: '400',
    fontSize: 18,
  }
})