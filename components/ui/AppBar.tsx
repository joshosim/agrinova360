import React, { ReactNode } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';

interface AppBarProps {
  title: string | null;
  onGoBack?: ReactNode;
  onRight?: ReactNode;
}

export function AppBar({ title, onGoBack, onRight }: AppBarProps) {
  return (
    <View style={{ marginTop: 20 }}>
      <StatusBar barStyle={'light-content'} backgroundColor='transparent' />
      <View style={{
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: 20
      }}>
        {onGoBack}
        <Text style={{
          textAlign: 'center', fontWeight: '400',
          fontSize: 20, fontFamily: 'SoraBold'
        }}>{title}</Text>
        {onRight}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({})