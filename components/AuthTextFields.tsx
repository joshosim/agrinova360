import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';

interface AuthTextFieldsProps {
  title: string;
  value: string;
  placeHolderText: string;
  onChange: (text: string) => void;
  keyBoardType: 'email-address' | 'default',
  errorText?: string;
  secureTextEntry?: boolean;
}

const AuthTextFields = ({ title, onChange, value, placeHolderText,
  keyBoardType, errorText, secureTextEntry = false }: AuthTextFieldsProps) => {

  const [showPassword, setShowPassword] = useState(false);


  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{title}</AppText>
      <View style={{
        borderWidth: 0.5, borderRadius: 10,
        borderColor: '#ece7e4', borderStyle: 'solid',
        flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10
      }}>
        <TextInput
          placeholder={placeHolderText}
          value={value}
          keyboardType={keyBoardType}
          onChangeText={onChange}
          style={[styles.textInput, secureTextEntry ? { flex: 1 } : {}]}
          placeholderTextColor={"gray"}
          secureTextEntry={secureTextEntry && !showPassword}
          autoCapitalize="none"
        />
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        )}
      </View>
      {errorText ? (
        <AppText style={styles.errorText}>{errorText}</AppText>
      ) : null}
    </View>
  )
}

export default AuthTextFields

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10,
    borderWidth: 1, borderRadius: 10, borderColor: '#ece7e4',
    borderStyle: 'solid', padding: 10
  },
  text: {
    marginBottom: 4,
    fontSize: 12,
    fontFamily: 'SoraBold'
  },
  textInput: {
    paddingVertical: 12,
    paddingHorizontal: 5,
    fontSize: 12,
    fontFamily: 'SoraRegular',
    borderRadius: 10
  },
  iconContainer: {
    paddingLeft: 8,
  },
  errorText: {
    color: 'red',
    fontSize: 11,
    marginTop: 4,
    fontFamily: 'SoraRegular'
  }
})