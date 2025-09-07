import { AppText } from '@/components/AppText';
import AuthTextFields from '@/components/AuthTextFields';
import { HelloWave } from '@/components/HelloWave';
import { Loading } from '@/components/Loading';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useMutation } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Platform, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as yup from 'yup';
import { RootStackParamList } from './(tabs)/inventory';

const schema = yup.object().shape({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type LoginFormValues = {
  email: string;
  password: string;
};

export default function AuthLogin() {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const goToSignup = () => {
    navigation.navigate(paths.auth.signup as never)
  }
  const { login, loading } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const toast = useToast()

  const mutation = useMutation({
    mutationFn: (data: LoginFormValues) => login(data.email, data.password),
    onSuccess: (data) => {
      console.log("Login Successful", data);
      toast.show("Login Successful", {
        type: "success",
        placement: "top",
        textStyle: { fontFamily: 'SoraRegular' },
        duration: 1500,
        animationType: "slide-in",
        icon: <Ionicons name='checkmark-circle' size={25} color='white' />
      });
      navigation.navigate(paths.home as never);
    },
    onError: (error: any) => {
      toast.show(error.response?.data?.message || error.message, { type: "danger" });
      console.log("Login Failed", error);
    }
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
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
        <AppText style={{ fontWeight: 400, fontSize: 12, textAlign: 'center', marginBottom: 40 }}>Login to your AgriNOVA360 manager account</AppText>

        <View style={{ width: "100%" }}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <AuthTextFields
                keyBoardType="email-address"
                title="Email Address"
                onChange={onChange}
                value={value}
                placeHolderText="Email Address"
                errorText={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <AuthTextFields
                keyBoardType="default"
                title="Password"
                onChange={onChange}
                value={value}
                placeHolderText="Password"
                errorText={errors.password?.message}
                secureTextEntry
              />
            )}
          />

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'center' }}
              onPress={goToSignup}>
              <AppText style={{ fontSize: 12 }}>Don't have a manager account?</AppText>
              <AppText style={{
                textDecorationStyle: 'solid',
                textDecorationLine: 'underline',
                textDecorationColor: 'blue',
                color: 'blue',
                fontSize: 12
              }}>Create a farm</AppText>
            </TouchableOpacity>

          </View>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, { padding: mutation.isPending ? 25 : 15 }]}
        onPress={handleSubmit(onSubmit)}>
        {mutation.isPending ? <Loading /> :
          <AppText style={styles.buttonText}>Login</AppText>
        }
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
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: "white",
    fontWeight: '400',
    fontSize: 13,
  }
})