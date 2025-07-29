import React from 'react';
import { StyleSheet, Text, TextProps } from 'react-native';

export const AppText = ({ style, ...props }: TextProps) => {
  return <Text {...props} style={[styles.text, style]} />;
};

const styles = StyleSheet.create({
  text: {
    fontFamily: 'SoraRegular',
    fontSize: 12
  },
});