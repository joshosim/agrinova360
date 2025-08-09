import { AppText } from '@/components/AppText';
import { Loading } from '@/components/Loading';
import { AppBar } from '@/components/ui/AppBar';
import { useAuth } from '@/context/AuthContext';
import { fetchOrganizationName, getProfilePhoto, updateProfilePicture } from '@/utils/helpers';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { useToast } from 'react-native-toast-notifications';

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

  const toast = useToast()

  const pickImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, async (response) => {
      if (response.didCancel) return;
      if (response.errorCode) {
        toast.show('Error picking image', { type: 'danger' });
        console.error('ImagePicker Error: ', response.errorMessage);
        return;
      }

      const asset = response.assets?.[0];
      if (!asset?.uri) return;

      try {
        // Convert URI to Blob (works for expo-file-system or fetch)
        const responseBlob = await fetch(asset.uri);
        const blob = await responseBlob.blob();

        // Create a File object from the Blob
        const file = new File([blob], asset.fileName || 'profile.jpg', { type: asset.type || 'image/jpeg' });

        const updatedProfile = await updateProfilePicture(user?.id, file);
        toast.show('Profile picture updated!', { type: 'success' });
        console.log(updatedProfile);
      } catch (error: any) {
        toast.show(error.message, { type: 'danger' });
      }
    });
  };

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        if (user?.id) {
          const url = await getProfilePhoto(user.id);
          setPhotoUrl(url);
        }
      } catch (err) {
        console.error('Failed to fetch profile photo:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  if (loading) {
    return <Loading />;
  }

  return (
    <ScrollView style={{ backgroundColor: 'white', flex: 1, padding: 15, marginBottom: 20 }}>
      <AppBar title='Profile'

        onGoBack={<MaterialIcons
          name='arrow-back-ios'
          size={28}
          color="black"
          onPress={() => navigation.goBack()} />}
        onRight={<View></View>} />

      <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative', marginTop: 50 }}>
        <Image source={{
          uri: photoUrl || 'data:image/jpeg;base64,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'
        }}
          style={{ height: 150, width: 150, borderRadius: 100, borderWidth: 1, borderColor: 'black' }} />
        <View style={{
          borderRadius: 100, backgroundColor: 'black', position: 'absolute',
          left: "60%",
          bottom: 0, padding: 6,
        }}>
          <Ionicons
            onPress={pickImage}
            name='camera-sharp' size={25} color={"green"} style={{
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