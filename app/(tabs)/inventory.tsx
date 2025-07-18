import { AppText } from '@/components/AppText';
import CustomBottomSheet from '@/components/BottomSheet';
import { AppBar } from '@/components/ui/AppBar';
import UnitDropdown from '@/components/UnitDropdown';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { fetchUserThatUploadedInventory } from '@/utils/helpers';
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
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';

export type RootStackParamList = {
  Home: undefined;
  ViewInventory: { item: any };
};

const Inventory = () => {

  const [cameraPermission, setCameraPermission] = useState<any>(null)
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);
  const [capturePhoto, setCapturePhoto] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

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
    return <AppText>Camera permission denied. Please enable it in settings.</AppText>;
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
        setShowPreview(true);
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
  }

  const retakePhoto = () => {
    setCapturePhoto(null);
    setShowPreview(false);
  }

  const onCameraReady = (ref: any) => {
    camera.current = ref;
  }

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
      setInventoryItems(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleAddItem = async () => {
    if (!newItem.item || !newItem.quantity || !newItem.unit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!user || !user.organization_id) {
      Alert.alert('Error', 'User not logged in or organization ID missing');
      return;
    }
    console.log("User context:", user);
    const payload = {
      name: newItem.item,
      quantity: parseInt(newItem.quantity),
      unit: newItem.unit,
      organization_id: user.organization_id,
      created_by: user.id,
    };

    const { data, error } = await supabase.from('inventory').insert([payload]).single();

    if (error) {
      console.error('Error adding inventory:', error.message);
      Alert.alert('Error', 'Failed to add inventory item');
    } else {
      setInventoryItems([data, ...inventoryItems]);
      setNewItem({ item: '', quantity: '', unit: '' });
      setBottomSheetVisible(false);
      Alert.alert('Success', 'Inventory item added');
    }
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false);
    setNewItem({ item: '', quantity: '', unit: '' });
  };

  return (
    <View style={styles.container}>

      <AppBar title='Inventory'
        onRight={<Ionicons
          name='add-circle'
          size={28}
          color="black"
          onPress={() =>
            setBottomSheetVisible(true)} />} />
      <FlatList
        data={inventoryItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          console.log("make i check", fetchUserThatUploadedInventory(item.created_by))
          console.log("makcre", item.created_by)
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate(
                paths.viewInventory as any, { item } as never
              )}
              style={styles.card}
            >
              <AppText style={styles.item}>{item.name}</AppText>
              {/* <AppText style={styles.item}>{fetchUserThatUploadedInventory(item.created_by)}</AppText> */}
              <AppText style={styles.quantity}>{item.quantity} {item.unit}</AppText>
              <AppText style={styles.quantity}>By ...</AppText>
            </TouchableOpacity>
          )
        }}
      />

      {showPreview && (
        <Camera
          style={{ flex: 1 }}
          device={device}
          isActive={true}
          ref={camera}
          photo
          onInitialized={() => console.log("Camera ready")}
        />
      )}
      {showPreview && capturePhoto ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: capturePhoto }} // Assuming the photo is a valid URI
            style={{ width: 300, height: 300, marginBottom: 20 }}
          />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Button title="Retake" onPress={retakePhoto} />
            <Button title="Confirm" onPress={confirmPhoto} />
          </View>
        </View>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <Button title="Take Photo" onPress={takePhoto} />
        </View>

      )}
      {/* Custom Bottom Sheet */}
      <CustomBottomSheet
        visible={bottomSheetVisible}
        onClose={handleBottomSheetClose}
        sheetHeight="60%"
      >
        <View style={styles.bottomSheetContent}>
          <AppText style={styles.bottomSheetTitle}>Add New Inventory Item</AppText>

          <View style={styles.formGroup}>
            <AppText style={styles.label}>Item Name</AppText>
            <TextInput
              style={styles.input}
              value={newItem.item}
              onChangeText={(text) => setNewItem({ ...newItem, item: text })}
              placeholder="Enter item name"
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
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
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
    marginTop: 20
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
    fontWeight: 'bold'
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
    fontWeight: 'bold'
  }
});