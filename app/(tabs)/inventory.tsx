import { AppText } from '@/components/AppText';
import CustomBottomSheet from '@/components/BottomSheet';
import InventoryCard from '@/components/InventoryCard';
import { Loading } from '@/components/Loading';
import { AppBar } from '@/components/ui/AppBar';
import UnitDropdown from '@/components/UnitDropdown';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { addInventoryItem, fetchInventoryItems, fetchUserThatUploadedInventory } from '@/utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Image,
  Linking,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';
import { useToast } from 'react-native-toast-notifications';
import { Camera, getCameraDevice } from 'react-native-vision-camera';

export type RootStackParamList = {
  Home: undefined
  Index: undefined
  Login: undefined
  LoginAsFarmer: undefined
  SignupFarmer: undefined
  Signup: undefined
  Tabs: undefined
  Onboarding: undefined
  Settings: undefined
  Finances: undefined
  ViewInventory: undefined
  ViewWorker: undefined
  Profile: undefined
  NotFound: undefined
};

const Inventory = () => {

  const [cameraPermission, setCameraPermission] = useState<any>(null)
  const devices = Camera.getAvailableCameraDevices()
  const device = getCameraDevice(devices, 'back', {
    physicalDevices: [
      'ultra-wide-angle-camera',
      'wide-angle-camera',
      'telephoto-camera'
    ]
  })
  const camera = useRef<Camera>(null);
  const [capturePhoto, setCapturePhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [newItem, setNewItem] = useState({ item: '', quantity: '', unit: '' });

  const { user } = useAuth();
  const toast = useToast();

  const { data: inventoryItems = [], isLoading, error } = useQuery({
    queryKey: ['inventory', user?.organization_id],
    queryFn: () => {
      if (!user?.organization_id) return undefined;
      return fetchInventoryItems(user.organization_id);
    },
    enabled: !!user?.organization_id,
  });

  const [uploaderMap, setUploaderMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchUploaderNames = async () => {
      const newMap: { [key: string]: string } = {};

      for (const item of inventoryItems) {
        if (item.created_by && !uploaderMap[item.created_by]) {
          try {
            const fullname = await fetchUserThatUploadedInventory(item.created_by);
            newMap[item.created_by] = fullname;
          } catch (error) {
            console.error("Error fetching uploader name:", error);
          }
        }
      }

      setUploaderMap(prev => ({ ...prev, ...newMap }));
    };

    fetchUploaderNames();
  }, [inventoryItems]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addInventoryItem,
    onSuccess: () => {

      queryClient.invalidateQueries({ queryKey: ['inventory', user?.organization_id] });

      setNewItem({ item: '', quantity: '', unit: '' });
      setBottomSheetVisible(false);
      setCapturePhoto(null);
      toast.show("Added Successfully", {
        type: "success",
        placement: "top",
        textStyle: { fontFamily: 'SoraRegular' },
        duration: 1500,
        animationType: "slide-in",
        icon: <Ionicons name='checkmark-circle' size={25} color='white' />
      });
    },
    onError: (error: any) => {
      toast.show({
        type: "warning",
        placement: "top",
        duration: 1500,
        textStyle: { fontFamily: 'SoraRegular' },
        animationType: "slide-in",
        data: error.message,
        icon: <Ionicons name='warning-outline' size={25} color='white' />
      });
    },
  });


  const handleAddItem = async () => {
    if (!newItem.item || !newItem.quantity || !newItem.unit) {
      toast.show("Please fill in all fields", {
        type: "warning",
        placement: "top",
        duration: 1500,
        textStyle: { fontFamily: 'SoraRegular' },
        animationType: "slide-in",
        icon: <Ionicons name='warning-outline' size={25} color='white' />
      });
      return;
    }

    if (!user || !user.organization_id) {
      Alert.alert('Error', 'User not logged in or organization ID missing');
      return;
    }

    let imageUrl = null;

    if (capturePhoto) {

      let resizedUri = capturePhoto;

      try {
        const resized = await ImageResizer.createResizedImage(
          capturePhoto,
          800, // width
          800, // height
          'JPEG',
          60, // quality (0–100)
          0 // rotation
        );

        resizedUri = resized.uri;
        console.log('Resized image URI:', resizedUri);
      } catch (resizeError) {
        console.error('Image resizing failed:', resizeError);
        Alert.alert('Error', 'Failed to resize image');
        return;
      }

      const base64Image = await RNFS.readFile(resizedUri, 'base64');
      const byteArray = Uint8Array.from(atob(base64Image), c => c.charCodeAt(0));

      console.log('Size of resized image:', resizedUri.length, 'bytes');
      console.log('Byte array length:', byteArray.length);

      const fileName = `inventory-${Date.now()}.jpg`;
      const filePath = `${user.id}/${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('inventory-images')
        .upload(filePath, byteArray, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      console.log("Upload data:", uploadData);
      console.log("Upload error:", uploadError);

      if (uploadError) {
        console.error('Error uploading image:', uploadError.message);
        Alert.alert('Error', 'Failed to upload image');
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from('inventory-images')
        .getPublicUrl(uploadData.path);

      imageUrl = publicUrlData.publicUrl;
      console.log("Public URL:", imageUrl);
    }

    const payload = {
      name: newItem.item,
      quantity: parseInt(newItem.quantity),
      unit: newItem.unit,
      organization_id: user.organization_id,
      created_by: user.id,
      image: imageUrl || null,
    };

    mutation.mutate(payload)
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false);
    setNewItem({ item: '', quantity: '', unit: '' });
    setCapturePhoto(null)
  };

  const checkCameraPermission = async () => {
    const status = await Camera.getCameraPermissionStatus()
    console.log("STATUS", status);

    if (status === 'granted') {
      setCameraPermission(true)
    } else if (status === 'not-determined') {
      const permission = await Camera.requestCameraPermission()
      setCameraPermission(permission === 'granted')
    } else {
      setCameraPermission(false);
      Alert.alert(
        'You need to allow microphone permission.',
        'Please go to Settings and allow microphone permission',
        [
          {
            text: 'Cancel',

            style: 'cancel',
          },
          {
            text: 'Open Settings',

            onPress: Linking.openSettings,
          },
        ],
      );
    }
    console.log('PERMISSION', cameraPermission);
  }

  useEffect(() => {
    checkCameraPermission();
  }, []);

  if (cameraPermission === null) {
    return <AppText>Checking camera permission...</AppText>
  } else if (!cameraPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <AppText style={{ marginBottom: 20 }}>
          Camera permission is denied. Please enable it in settings.
        </AppText>
        <Button title="Open Settings" onPress={() => Linking.openSettings()} />
      </View>
    );
  }

  if (!device) {
    return <AppText>No Camera Device Available</AppText>
  }

  const takePhoto = async () => {
    try {
      if (!camera.current) {
        console.error("Camera reference is null", camera);
        return;
      }
      const photo = await camera.current.takePhoto();
      console.log("Photo taken:", photo);

      if (photo) {
        setCapturePhoto(`file://${photo.path}`);
        console.log("capturePhoto", capturePhoto)
        setShowPreview(true);
        setShowCamera(false); // Hide camera after taking photo
      } else {
        console.error('Photo capture is undefined or empty.');
      }
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  }

  const confirmPhoto = async () => {
    console.log("Photo confirmed:", capturePhoto);
    setShowPreview(false)
    setShowCamera(false); //hide the camera after confirming photo
    setBottomSheetVisible(true)
  }

  const retakePhoto = () => {
    setCapturePhoto(null);
    setShowPreview(false);
  }

  const onCameraReady = (ref: any) => {
    camera.current = ref;
    setBottomSheetVisible(false)
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={Platform.OS === 'ios' ? "light-content" : "dark-content"} />
      <AppBar title='Inventory'
        onRight={<Ionicons
          name='add-circle'
          size={28}
          color="black"
          onPress={() =>
            setBottomSheetVisible(true)} />} />
      {isLoading ?
        <Loading /> :
        <FlatList
          style={{ marginBottom: 50 }}
          data={inventoryItems}
          keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
          renderItem={({ item }) => {
            const uploaderName = uploaderMap[item?.created_by] || "Unknown";
            return (
              <InventoryCard
                uploaderName={uploaderName}
                item={item}
              />
            );
          }}
        />}


      {showCamera && device != null && (
        <View style={StyleSheet.absoluteFill}>
          <Camera
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            ref={(ref) => onCameraReady(ref)}
            photo
          />

          {/* Middle Capture Button */}
          <View style={styles.captureButtonContainer}>
            <TouchableOpacity onPress={takePhoto} style={styles.captureButton} />
          </View>

          {/* Close Camera Button (optional) */}
          <TouchableOpacity onPress={() => setShowCamera(false)} style={styles.closeButton}>
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
      {capturePhoto && showPreview ? (
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center',
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0
        }}>
          <Image
            source={{ uri: capturePhoto }}
            style={StyleSheet.absoluteFill}
            resizeMode="cover"
          />
          <View style={styles.previewButtonContainer}>
            <TouchableOpacity onPress={retakePhoto} style={[styles.reButton, { backgroundColor: 'crimson' }]}>
              <Ionicons name="repeat" size={28} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={confirmPhoto} style={[styles.reButton, { backgroundColor: 'seagreen' }]}>
              <Ionicons name="checkmark" size={28} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) :
        showCamera && <View />}

      <CustomBottomSheet
        visible={bottomSheetVisible}
        onClose={handleBottomSheetClose}
        sheetHeight="60%"
      >
        <View style={styles.bottomSheetContent}>
          <AppText style={styles.bottomSheetTitle}>Add New Inventory Item</AppText>

          <View style={styles.formGroup}>
            <AppText style={styles.label}>Take a Photo</AppText>
            {!capturePhoto && (<TouchableOpacity
              style={styles.takeThePhoto}
              onPress={() => setShowCamera(true)}
            >
              <Ionicons size={28} name="camera" color='#fff' />
            </TouchableOpacity>)}
            {capturePhoto && (
              <Image
                source={{ uri: capturePhoto }}
                style={{ width: "auto", height: 50, borderRadius: 10 }}
              />
            )}

          </View>
          <View style={styles.formGroup}>
            <AppText style={styles.label}>Item Name</AppText>
            <TextInput
              style={styles.input}
              value={newItem.item}
              onChangeText={(text) => setNewItem({ ...newItem, item: text })}
              placeholder="Enter Item"
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 10 }]}>
              <AppText style={styles.label}>Quantity</AppText>
              <TextInput
                style={styles.input}
                value={newItem.quantity}
                onChangeText={(text) => setNewItem({ ...newItem, quantity: text })}
                placeholder="Enter quantity"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.formGroup, { flex: 1 }]}>
              <AppText style={styles.label}>Unit</AppText>
              <UnitDropdown
                selectedUnit={newItem.unit}
                onSelect={(unit: any) => setNewItem({ ...newItem, unit })}
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleBottomSheetClose}
            >
              <AppText style={styles.cancelButtonText}>Cancel</AppText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddItem}
            >
              <AppText style={styles.addButtonText}>
                {mutation.isPending ? 'Adding...' : 'Add Item'}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  )
}

export default Inventory;

const styles = StyleSheet.create({
  captureButtonContainer: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    borderWidth: 4,
    borderColor: 'gray',
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 6,
  },
  reButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 15
  },
  previewButtonContainer: {
    position: 'absolute',
    bottom: 70,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white'
  },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  card: {
    padding: 15,
    backgroundColor: '#f2f2f2',
    marginBottom: 10,
    borderRadius: 10
  },
  item: {
    fontSize: 12
  },
  quantity: {
    fontSize: 14,
    color: 'gray'
  },
  // Bottom Sheet Content Styles
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetTitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'SoraBold'
  },
  formGroup: {
    marginBottom: 15
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 15
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'SoraRegular'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10
  },
  cancelButtonText: {
    color: '#555',
    textAlign: 'center',
  },
  takeThePhoto: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    padding: 10,
  }
});