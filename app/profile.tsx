import { AppText } from '@/components/AppText';
import { AppBar } from '@/components/ui/AppBar';
import { useAuth } from '@/context/AuthContext';
import { fetchOrganizationName } from '@/utils/helpers';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';


interface ProfileProps {
  startIcon: "person" | "pencil" | "help" | "push" | "map" | "filter" | "at" | "link" | "search" | "image" | "text" | "alert" | "checkbox" | "menu" | "radio" | "timer" | "close" | "book" | "pause";
  title: string;
}

const profileInfos: ProfileProps[] = [
  {
    startIcon: "person",
    title: 'Edit Profile',

  },
  {
    startIcon: "person",
    title: 'Language',

  },
  {
    startIcon: "person",
    title: 'Terms and Conditions',

  },
  {
    startIcon: "person",
    title: 'Privacy Policy',

  },
  {
    startIcon: "help",
    title: 'Help & Support Centre',

  },
]

const Profile = () => {
  const navigation = useNavigation()
  const { user, logout } = useAuth();

  const [orgName, setOrgName] = useState<string | null>(null);

  useEffect(() => {
    const getOrganization = async () => {
      if (!user?.organization_id) return;
      const name = await fetchOrganizationName(user.organization_id);
      setOrgName(name);
    };

    getOrganization();
  }, [user]);

  return (
    <ScrollView style={{ backgroundColor: 'white', flex: 1, padding: 15 }}>
      <AppBar title='Profile'

        onGoBack={<MaterialIcons
          name='arrow-back-ios'
          size={28}
          color="black"
          onPress={() => navigation.goBack()} />}
        onRight={<View></View>} />

      <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: 50 }}>
        <Image source={require("../assets/images/ukaosim.jpg")}
          style={{ height: 150, width: 150, borderRadius: 100 }} />
        <View style={{
          borderRadius: 100, backgroundColor: 'black', position: 'absolute',
          left: "60%",
          bottom: 0, padding: 6,
        }}>
          <Ionicons name='camera-sharp' size={25} color={"green"} style={{

          }} />
        </View>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <AppText style={{ fontWeight: 400 }}>{user?.role} @ {orgName}</AppText>
          <Ionicons name='share-social-outline' size={18} color='green' />
        </View>
        <AppText style={{ fontWeight: 600 }}>{user?.fullname}</AppText>
        <AppText>{user?.email}</AppText>
      </View>
      <View style={{ marginTop: 30, marginBottom: 5 }}>
        <AppText style={{ fontWeight: 600 }}>Personal Information</AppText>
      </View>
      <View style={{ marginTop: 10 }}>
        {profileInfos.map((item, index) => {
          return (
            <View key={index} style={{
              flexDirection: 'row', alignItems: 'center',
              justifyContent: 'space-between', backgroundColor: '#EDD6C8',
              padding: 20, borderRadius: 10, marginBottom: 10
            }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons size={25} name={item.startIcon} color={"black"} />
                <AppText>{item.title}</AppText>
              </View>
              <MaterialIcons size={18} name="arrow-forward-ios" color={"black"} />
            </View>
          )
        })}
      </View>
      <TouchableOpacity style={{
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', backgroundColor: '#EDD6C8',
        padding: 20, borderRadius: 10, marginBottom: 10
      }}
        onPress={logout}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons size={25} name="log-out-outline" color={"black"} />
          <AppText>Logout</AppText>
        </View>
        <MaterialIcons size={18} name="arrow-forward-ios" color={"black"} />
      </TouchableOpacity>
    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({})