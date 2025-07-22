import { AppText } from '@/components/AppText';
import CustomBottomSheet from '@/components/BottomSheet';
import { AppBar } from '@/components/ui/AppBar';
import UnitDropdown from '@/components/UnitDropdown';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { fetchUserThatUploadedInventory, formatDateTime } from '@/utils/helpers';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
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
import { Camera, getCameraDevice } from 'react-native-vision-camera';

export type RootStackParamList = {
  Home: undefined;
  ViewInventory: { item: any };
};

const Inventory = () => {

  const [cameraPermission, setCameraPermission] = useState<any>(null)
  const [name, setName] = useState<string>('');
  // const device = useCameraDevice('back');
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

  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [newItem, setNewItem] = useState({ item: '', quantity: '', unit: '' });

  const { user } = useAuth();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const fetchInventory = async () => {
    if (!user?.organization_id) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('inventory')
      .select('*')
      .eq('organization_id', user.organization_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching inventory:', error.message);
      Alert.alert('Error', 'Failed to load inventory');
    } else {
      // setInventoryItems(data || []);
      setInventoryItems((data || []).filter(item => item !== null && item.id));
      console.log("Fetched inventory items:", data[0]);
    }

    setLoading(false);
  };

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


  const handleAddItem = async () => {
    if (!newItem.item || !newItem.quantity || !newItem.unit) {
      Alert.alert('Error', 'Please fill in all fields');
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

    console.log("User context:", user);
    console.log("New item payload:", {
      name: newItem.item,
      quantity: parseInt(newItem.quantity),
      unit: newItem.unit,
      organization_id: user.organization_id,
      created_by: user.id,
      image: imageUrl || null,
    });
    const payload = {
      name: newItem.item,
      quantity: parseInt(newItem.quantity),
      unit: newItem.unit,
      organization_id: user.organization_id,
      created_by: user.id,
      image: imageUrl || null,
    };

    const { data, error } = await supabase.from('inventory').insert([payload]).single();

    if (error) {
      console.error('Error adding inventory:', error.message);
      Alert.alert('Error', 'Failed to add inventory item');
    } else {
      setInventoryItems([data, ...inventoryItems]);
      setNewItem({ item: '', quantity: '', unit: '' });
      setBottomSheetVisible(false);
      setCapturePhoto(null);
      Alert.alert('Success', 'Inventory item added');
    }
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

  useEffect(() => {
    fetchInventory();
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
      <FlatList
        data={inventoryItems}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()}
        renderItem={({ item }) => {
          const uploaderName = uploaderMap[item?.created_by] || "Unknown";

          return (
            <TouchableOpacity
              onPress={() => navigation.navigate(
                paths.viewInventory as any, { item } as never
              )}
              style={styles.card}
            >
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <AppText style={[styles.item, { textTransform: 'uppercase' }]}>{item?.name}</AppText>
                  <AppText style={[styles.item, { fontSize: 12 }]}>{formatDateTime(item?.created_at)}</AppText>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <AppText style={styles.quantity}>{item?.quantity} {item?.unit}</AppText>
                    <AppText style={styles.quantity}>By {uploaderName}</AppText>
                  </View>
                  <Image source={{ uri: item?.image }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
      />


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
        showCamera && (
          // <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          //   <Button title="Take Photo" onPress={takePhoto} />
          // </View>
          <View />
        )
      }
      {/* Custom Bottom Sheet */}
      <CustomBottomSheet
        visible={bottomSheetVisible}
        onClose={handleBottomSheetClose}
        sheetHeight="60%"
      >
        <View style={styles.bottomSheetContent}>
          <AppText style={styles.bottomSheetTitle}>Add New Inventory Item</AppText>

          {/* take a picture of the inventory item */}
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
              <AppText style={styles.addButtonText}>Add Item</AppText>
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
    bottom: 40,
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
    padding: 6,
  },
  previewButtonContainer: {
    position: 'absolute',
    bottom: 40,
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
    fontSize: 16
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