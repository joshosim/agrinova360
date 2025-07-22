import { RootViewStyleProvider, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import paths from '@/utils/paths';
import { RootStackParamList } from './(tabs)/inventory';

const Finances = () => {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const goToSignup = () => {
    navigation.navigate(paths.auth.signup as never)
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={goToSignup}>
        <Text>Finances</Text>
      </TouchableOpacity>
    </View>
  )
}

export default Finances

const styles = StyleSheet.create({})