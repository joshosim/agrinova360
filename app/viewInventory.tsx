import { AppText } from '@/components/AppText';
import PromptModal from '@/components/PromptModal';
import { AppBar } from '@/components/ui/AppBar';
import { Colors } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { deleteInventoryItem, formatDateTime, formatTime } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation, useRoute } from '@react-navigation/native';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useToast } from 'react-native-toast-notifications';
import { RootStackParamList } from './(tabs)/inventory';

const InventoryDetails = () => {
  const route = useRoute();
  const { item, uploader } = route.params as { item: any, uploader: any };
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [openModal, setOpenModal] = useState(false)
  const toast = useToast()

  const mutation = useMutation(
    {
      mutationFn: (itemId: string) => deleteInventoryItem(itemId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['inventory', user?.organization_id] });
        setOpenModal(false)
        toast.show("Item deleted successfully", { type: "success", });

        navigation.goBack()
      },
      onError: (error) => {
        console.error("Error deleting item:", error);
      }
    }
  )

  const onSubmit = () => {
    setOpenModal(true)
  }

  const DeleteInventory = () => <Ionicons name="trash" size={24} color='white' />

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <AppBar title="View Inventory" />
        <Image
          source={{ uri: item.image }}
          style={{ width: "auto", height: 400, borderRadius: 10 }}
        />
        <Pressable
          onPress={onSubmit}
          style={{
            position: 'absolute', top: 80, right: 20,
            padding: 10, backgroundColor: 'red', borderRadius: 50
          }}>

          <DeleteInventory />
        </Pressable>
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
      {openModal ? <PromptModal
        message='Do you wish to delete this inventory?'
        no={() => { }}
        yes={() => mutation.mutate(item.id)}
      /> : null}
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