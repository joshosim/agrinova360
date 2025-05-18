import { AppText } from '@/components/AppText';
import AuthTextFields from '@/components/AuthTextFields';
import { Colors } from '@/constants/Colors';
import { supabase } from '@/lib/supabase';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, RootViewStyleProvider, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

const FarmerSignup = () => {
  const [email, setEmail] = useState<string>("")
  const [fullname, setFullname] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [farmCode, setFarmCode] = useState<string>("")

  const navigation = useNavigation<NavigationProp<RootViewStyleProvider>>();

  const goHome = () => {
    navigation.navigate(paths.home as never)
  }

  const signUpTextFn = async () => {
    if (!email || !password || !fullname || !phone || !farmCode) {
      Alert.alert("Missing fields", "Please fill all fields");
      return;
    }

    // Step 1: Look up organization by farm code
    const { data: orgData, error: orgError } = await supabase
      .from('organizations')
      .select('id')
      .eq('farm_code', farmCode)
      .single();

    if (orgError || !orgData) {
      Alert.alert("Invalid Farm Code", "No organization found with that farm code.");
      return;
    }

    const organizationId = orgData.id;

    // Step 2: Sign up the user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signUpError) {
      Alert.alert("Signup error", signUpError.message);
      return;
    }

    const user = signUpData.user;
    if (!user) {
      Alert.alert("Signup error", "User not created");
      return;
    }

    // Step 3: Save farmer profile with organization_id
    const profilePayload = {
      id: user.id,
      fullname,
      phone,
      farm_code: farmCode,
      email,
      role: 'Farmer',
      organization_id: organizationId, // 💡 the important part
    };

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([profilePayload]);

    if (profileError) {
      Alert.alert("Profile save error", profileError.message);
      return;
    }

    // Step 4: Save user data locally
    const userData = {
      id: user.id,
      email,
      fullname,
      phone,
      farm_code: farmCode,
      role: 'Farmer',
      organization_id: organizationId,
    };

    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (err) {
      console.error("Failed to save user data:", err);
    }

    Alert.alert("Success", "Farmer account created!");
    goHome();
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style={Platform.OS === 'ios' ? "light" : "auto"} />

      <View>
        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
          <Ionicons name='fast-food' size={75} color={'green'} />
        </View>
        <AppText style={{ fontWeight: 600, fontSize: 25, textAlign: 'center', marginVertical: 20 }}>Create an account as a farmer🖋</AppText>
        <AppText style={{ fontWeight: 300, fontSize: 16, textAlign: 'center', marginBottom: 40 }}>Please complete your profile to create an account with AgriNOVA360 with your farm's associated code.</AppText>

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
            title="Farm Code"
            onChange={(text) => setFarmCode(text)}
            value={farmCode}
            placeHolderText='#FARMCODE' />
        </View>
      </View>

      <TouchableOpacity style={styles.button}
        onPress={signUpTextFn}>
        {/* // onPress={goHome}> */}
        <AppText style={styles.buttonText}>Sign up</AppText>
      </TouchableOpacity>
    </ScrollView>
  )
}

export default FarmerSignup

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
    padding: 20,
    marginBottom: 20,
    borderRadius: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: "white",
    fontWeight: '400',
    fontSize: 18,
  },
})