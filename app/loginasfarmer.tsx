import { AppText } from '@/components/AppText';
import AuthTextFields from '@/components/AuthTextFields';
import { HelloWave } from '@/components/HelloWave';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, RootViewStyleProvider, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function AuthLoginAsFarmer() {
  const route = useRoute<RouteProp<Record<string, any>, string>>();
  const { role } = route.params || {};
  console.log(role)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [farmCode, setFarmCode] = useState<string>("")

  const navigation = useNavigation<NavigationProp<RootViewStyleProvider>>();

  const goToSignup = () => {
    navigation.navigate(paths.signupfarmer as never)
  }

  const handleLogin = async () => {
    try {
      // 1. Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const userId = data.user?.id;

      // 2. Fetch profile info from 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) throw profileError;

      // 3. Check farmCode for farmers
      if (
        !farmCode ||
        !profile.farm_code ||
        farmCode.trim().toLowerCase() !== profile.farm_code.trim().toLowerCase()
      ) {
        throw new Error('Invalid farm code');
      }

      // 4. Save auth info to AsyncStorage
      await AsyncStorage.multiSet([
        ['user_id', userId],
        ['email', email],
        ['role', role],
        ['fullname', profile.fullname],
        ['farm_name', profile.farm_name || ''],
        ['farm_address', profile.farm_address || ''],
        ['farm_code', profile.farm_code || ''],
      ]);

      Alert.alert('Login was successfull!');
      navigation.navigate(paths.home as never);
    } catch (error: any) {
      console.log('Login Error:', error.message);
      Alert.alert('Login Failed', error.message);
    }
  };


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
          {role === 'Farmer' && (
            <AuthTextFields
              keyBoardType='default'
              title="Farm Code"
              onChange={(text) => setFarmCode(text)}
              value={farmCode}
              placeHolderText='#FARMCODE'
            />
          )}
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
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <AppText style={styles.buttonText}>Login</AppText>
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