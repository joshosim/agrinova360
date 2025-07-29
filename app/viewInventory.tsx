import { AppText } from '@/components/AppText';
import { AppBar } from '@/components/ui/AppBar';
import { Colors } from '@/constants/Colors';
import { formatDateTime, formatTime } from '@/utils/helpers';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RootStackParamList } from './(tabs)/inventory';

const InventoryDetails = () => {
  const route = useRoute();
  const { item, uploader } = route.params as { item: any, uploader: any };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <AppBar title="View Inventory" />
        <Image
          source={{ uri: item.image }}
          style={{ width: "auto", height: 400, borderRadius: 10 }}
        />
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between',
          alignItems: 'center', marginHorizontal: 10, marginTop: 10
        }}>
          <AppText style={{ fontFamily: "SoraBold", fontSize: 14 }}>{item?.name}</AppText>
          <AppText style={{ fontFamily: "SoraBold" }}>{formatDateTime(item?.created_at)}</AppText>
        </View>

        <AppText style={{ fontFamily: "SoraBold", marginLeft: 10 }}> {item?.quantity} {item?.unit}</AppText>
        <AppText style={{ marginLeft: 10 }}>Posted by <AppText
          style={{ fontFamily: "SoraBold" }}>{uploader} </AppText>@ {formatTime(item?.created_at)}</AppText>
      </View>
      <Pressable
        onPress={() => navigation.goBack()}
        style={styles.button}>
        <AppText style={styles.buttonText}>Seen</AppText>
      </Pressable>
    </SafeAreaView>
  )
}

export default InventoryDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  button: {
    backgroundColor: Colors.primary,
    width: "100%",
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: "white",
    fontWeight: '400',
    fontSize: 14,
  },
})