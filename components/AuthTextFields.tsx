import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { AppText } from './AppText';

interface AuthTextFieldsProps {
  title: string;
  value: string;
  placeHolderText: string;
  onChange: (text: string) => void;
  keyBoardType: 'email-address' | 'default',
  errorText?: string;
}

const AuthTextFields = ({ title, onChange, value, placeHolderText, keyBoardType, errorText }: AuthTextFieldsProps) => {

  return (
    <View style={styles.container}>
      <AppText style={styles.text}>{title}</AppText>
      <View style={{
        borderWidth: 0.5, borderRadius: 10,
        borderColor: '#ece7e4', borderStyle: 'solid',
      }}>
        <TextInput
          placeholder={placeHolderText}
          value={value}
          keyboardType={keyBoardType}
          onChangeText={onChange}
          style={styles.textInput}
          placeholderTextColor={"gray"}
        />
      </View>
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
  }
})