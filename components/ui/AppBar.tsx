import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface AppBarProps {
  title: string | null;
  onGoBack?: ReactNode;
  onRight?: ReactNode;
}

export function AppBar({ title, onGoBack, onRight }: AppBarProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: 20 }}>
      {onGoBack}
      <Text style={{ textAlign: 'center', fontWeight: '600', fontSize: 18, fontFamily: 'SpaceGrotesk' }}>{title}</Text>
      {onRight}
    </View>
  )
}

const styles = StyleSheet.create({})