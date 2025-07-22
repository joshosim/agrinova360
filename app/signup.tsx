import { AppText } from '@/components/AppText';
import AuthTextFields from '@/components/AuthTextFields';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './(tabs)/inventory';

const AuthSignup = () => {
  const [email, setEmail] = useState<string>("")
  const [fullname, setFullname] = useState<string>("")
  const [phone, setPhone] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [farmName, setFarmName] = useState<string>("")
  const [farmAddress, setFarmAddress] = useState<string>("")
  const { signupAsManager, loading } = useAuth();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const signUpTextFn = async () => {
    try {
      await signupAsManager(email, password, fullname, farmName, phone, farmAddress);
      Alert.alert("Success", "Manager account created. Check your email to verify your account.");
      navigation.navigate(paths.home as never);
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
        <AppText style={styles.buttonText}> {loading ? "Signing up..." : 'Sign up'}</AppText>
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