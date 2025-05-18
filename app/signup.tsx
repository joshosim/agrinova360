import { AppText } from '@/components/AppText';
import AuthTextFields from '@/components/AuthTextFields';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import { generateFarmCode } from '@/utils/helpers';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, RootViewStyleProvider, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
// N6SGVE
const AuthSignup = () => {
  const [email, setEmail] = useState<string>("")
  const [fullname, setFullname] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [farmName, setFarmName] = useState<string>("")
  const [farmAddress, setFarmAddress] = useState<string>("")

  const navigation = useNavigation<NavigationProp<RootViewStyleProvider>>();

  const signUpTextFn = async () => {
    try {
      const role = 'Manager';
      const farmCode = generateFarmCode();

      // 1. Sign up user to auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            fullname,
            phone,
            role,
            farm_code: farmCode,
            name: farmName,
            address: farmAddress
          },
        },
      });

      if (error) throw error;

      const userId = data.user?.id;

      if (userId) {
        // 2. Insert into organizations
        const { data: orgDataArr, error: orgError } = await supabase
          .from('organizations')
          .insert([
            {
              name: farmName,
              address: farmAddress,
              farm_code: farmCode,
            }
          ])
          .select();

        if (orgError) throw orgError;

        const orgData = orgDataArr?.[0];

        if (!orgData) throw new Error("Organization insert failed. No data returned.");

        const organization_id = orgData.id;

        // 3. Insert profile with organization_id
        const { error: profileError } = await supabase.from('profiles').insert([
          {
            id: userId,
            email,
            fullname,
            phone,
            role,
            organization_id,
            farm_name: farmName,
            farm_address: farmAddress

          }
        ]);

        if (profileError) throw profileError;

        // Save full user profile to AsyncStorage
        const userProfile = {
          user_id: userId,
          email,
          fullname,
          phone,
          role,
          farm_name: farmName,
          farm_address: farmAddress,
          farm_code: farmCode,
          organization_id,
        };

        await AsyncStorage.setItem('user_profile', JSON.stringify(userProfile));

        Alert.alert("Success", `Manager account created.\nFarm Code: ${farmCode}\nCheck your email to verify your account.`);
        navigation.navigate(paths.home as never);
      }

    } catch (error: any) {
      console.error("Signup Error:", error.message);
      Alert.alert("Error", error.message);
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? "light" : "auto"} />

      <View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <Ionicons name='fast-food' size={75} color={'green'} />
        </View>
        <AppText style={{ fontWeight: 600, fontSize: 25, textAlign: 'center', marginVertical: 20 }}>Create an account🖋</AppText>
        <AppText style={{ fontWeight: 400, fontSize: 16, textAlign: 'center', marginBottom: 40 }}>Please complete your profile to create an account with AgriNOVA360.</AppText>

        <View style={{ width: "100%" }}>
          <AuthTextFields
            keyBoardType='default'
            title="Full Name"
            onChange={(text) => setFullname(text)}
            value={fullname}
            placeHolderText='Full Name'
          />
          <AuthTextFields
            keyBoardType='default'
            title="Phone Number"
            onChange={(text) => setPhone(text)}
            value={phone}
            placeHolderText='Phone Number' />
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
          <AuthTextFields
            keyBoardType='default'
            title="Name of Farm Establishment"
            onChange={(text) => setFarmName(text)}
            value={farmName}
            placeHolderText='Farm Name' />
          <AuthTextFields
            keyBoardType='default'
            title="Address of Farm"
            onChange={(text) => setFarmAddress(text)}
            value={farmAddress}
            placeHolderText='Farm Address' />
        </View>
      </View>

      <TouchableOpacity style={styles.button}
        onPress={signUpTextFn}>
        {/* onPress={goHome}> */}
        <AppText style={styles.buttonText}>Sign up</AppText>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default AuthSignup

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'space-between'
  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: "white",
    fontWeight: '400',
    fontSize: 18,
  },
})