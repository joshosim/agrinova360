import { AppText } from '@/components/AppText'
import { useAuth } from '@/context/AuthContext'
import paths from '@/utils/paths'
import { Ionicons } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { RootStackParamList } from './(tabs)/inventory'

export default function Register() {

  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  const [open, setOpen] = useState<boolean>(false)

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigation.navigate(paths.home as never); // or your actual home route
    }
  }, [user, loading]);


  return (
    <View style={{ flex: 1, backgroundColor: 'white', padding: 20, }}>

      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
        <Ionicons name='fast-food' size={75} color={'green'} />
      </View>
      <AppText style={{ fontWeight: 600, fontSize: 20, textAlign: 'center', marginTop: 20 }}>Welcome to AgriNova360</AppText>
      <AppText style={{ textAlign: 'center', fontWeight: 200, marginVertical: 30 }}>Register to create your account and start exploring the world of AgriNova360.</AppText>

      <TouchableOpacity onPress={() => navigation.navigate(paths.auth.signup as never)}
        style={{ backgroundColor: "green", borderRadius: 10, padding: 20, marginTop: 30 }}>
        <AppText style={{ textAlign: 'center', color: 'white', }}>Create a new Farm</AppText>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setOpen(true)} style={{ backgroundColor: "green", borderRadius: 10, padding: 20, marginTop: 30 }}>
        <AppText style={{ textAlign: 'center', color: 'white', }}>Existing Farm</AppText>
      </TouchableOpacity>

      {open && (
        <View>
          <TouchableOpacity onPress={() => navigation.navigate(
            paths.auth.loginasfarmer as never
          )}
            style={{ backgroundColor: "green", borderRadius: 10, padding: 20, marginTop: 30 }}>
            <AppText style={{ textAlign: 'center', color: 'white', fontWeight: 600 }}>Login as Farmer</AppText>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate(
            paths.auth.login as never
          )} style={{ backgroundColor: "green", borderRadius: 10, padding: 20, marginTop: 30 }}>
            <AppText style={{ textAlign: 'center', color: 'white', fontWeight: 600 }}>Login as Farm Manager</AppText>
          </TouchableOpacity>
        </View>
      )}

    </View>
  )
}

const styles = StyleSheet.create({})