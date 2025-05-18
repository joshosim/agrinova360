import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from './AppText';

interface AuthTextFieldsProps {
  title: string;
  value: string;
  placeHolderText: string;
  onChange: (text: string) => void;
  keyBoardType: 'email-address' | 'default',
}

const AuthTextFields = ({ title, onChange, value, placeHolderText, keyBoardType }: AuthTextFieldsProps) => {

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{title}</AppText>
      <TextInput
        placeholder={placeHolderText}
        value={value}
        keyboardType={keyBoardType}
        onChangeText={onChange}
        style={styles.textInput}
        placeholderTextColor={"gray"}
      />
    </View>
  )
}

export default AuthTextFields

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 10
  },
  text: {
    fontWeight: '600',
    marginBottom: 4,
    fontSize: 12
  },
  textInput: {
    borderBottomWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 0,
    borderColor: "#ece4e7",
    fontSize: 16,
    fontFamily: 'SpaceGrotesk'
  }
})