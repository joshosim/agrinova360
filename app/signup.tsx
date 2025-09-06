import { AppText } from '@/components/AppText';
import AuthTextFields from '@/components/AuthTextFields';
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
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { useToast } from 'react-native-toast-notifications';
import * as Yup from 'yup';
import { RootStackParamList } from './(tabs)/inventory';

const schema = Yup.object().shape({
  fullname: Yup.string().required('Full Name is required'),
  phone: Yup.string().required('Phone Number is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  farmName: Yup.string().required('Farm Name is required'),
  farmAddress: Yup.string().required('Farm Address is required'),
});

const AuthSignup = () => {
  const { signupAsManager } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const toast = useToast();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullname: '',
      phone: '',
      email: '',
      password: '',
      farmName: '',
      farmAddress: '',
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: any) => {
      const { email, password, fullname, farmName, phone, farmAddress } = data;
      return await signupAsManager(email, password, fullname, farmName, phone, farmAddress);
    },
    onSuccess: () => {
      toast.show('Farm Account Created! Confirm your email now!', {
        type: 'success',
        placement: 'top',
        textStyle: { fontFamily: 'SoraRegular' },
        duration: 1500,
        animationType: 'slide-in',
        icon: <Ionicons name="checkmark-circle" size={25} color="white" />,
      });
      navigation.navigate(paths.home as never);
    },
    onError: (error: any) => {
      console.error('Signup Error:', error.message);
      Alert.alert('Error', error.message || 'Signup failed.');
    },
  });

  const onSubmit = (data: any) => {
    mutate(data);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />

        <View>
          <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
            <Ionicons name="fast-food" size={75} color={'green'} />
          </View>
          <AppText
            style={{
              fontWeight: 600,
              fontSize: 25,
              textAlign: 'center',
              marginVertical: 20,
            }}
          >
            Create an account🖋
          </AppText>
          <AppText
            style={{
              fontWeight: 400,
              fontSize: 12,
              textAlign: 'center',
              marginBottom: 40,
            }}
          >
            Please complete your profile to create an account with AgriNOVA360.
          </AppText>

          <View style={{ width: '100%' }}>
            <Controller
              control={control}
              name="fullname"
              render={({ field: { onChange, value } }) => (
                <AuthTextFields
                  keyBoardType="default"
                  title="Full Name"
                  onChange={onChange}
                  value={value}
                  placeHolderText="Full Name"
                  errorText={errors.fullname?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, value } }) => (
                <AuthTextFields
                  keyBoardType="default"
                  title="Phone Number"
                  onChange={onChange}
                  value={value}
                  placeHolderText="Phone Number"
                  errorText={errors.phone?.message}
                />
              )}
            />

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

            <Controller
              control={control}
              name="farmName"
              render={({ field: { onChange, value } }) => (
                <AuthTextFields
                  keyBoardType="default"
                  title="Name of Farm Establishment"
                  onChange={onChange}
                  value={value}
                  placeHolderText="Farm Name"
                  errorText={errors.farmName?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="farmAddress"
              render={({ field: { onChange, value } }) => (
                <AuthTextFields
                  keyBoardType="default"
                  title="Address of Farm"
                  onChange={onChange}
                  value={value}
                  placeHolderText="Farm Address"
                  errorText={errors.farmAddress?.message}
                />
              )}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)} disabled={isPending}>
          {isPending ? <Loading /> : <AppText style={styles.buttonText}>Sign up</AppText>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AuthSignup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: Colors.primary,
    width: '100%',
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: '400',
    fontSize: 14,
  },
});
