import { AppText } from '@/components/AppText';
import CustomBottomSheet from '@/components/BottomSheet';
import { AppBar } from '@/components/ui/AppBar';
import UnitDropdown from '@/components/UnitDropdown';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export type RootStackParamList = {
  Home: undefined;
  ViewInventory: { item: any };
};

const Inventory = () => {
  // State for inventory items
  const [inventoryItems, setInventoryItems] = useState([
    { id: '1', item: 'Chicken Feed', quantity: 200, unit: 'kg' },
    { id: '2', item: 'Egg trays', quantity: 100, unit: 'pcs' },
    { id: '3', item: 'Antibiotics', quantity: 20, unit: 'bottles' },
  ]);

  // State for bottom sheet visibility
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);

  // State for new item form
  const [newItem, setNewItem] = useState({
    item: '',
    quantity: '',
    unit: ''
  });

  // Navigation
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // Function to add new inventory item
  const handleAddItem = () => {
    // Basic validation
    if (!newItem.item || !newItem.quantity || !newItem.unit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Create new item with unique ID
    const newInventoryItem = {
      id: Date.now().toString(),
      item: newItem.item,
      quantity: parseInt(newItem.quantity) || 0,
      unit: newItem.unit
    };

    // Add to inventory list
    setInventoryItems([...inventoryItems, newInventoryItem]);

    // Reset form
    setNewItem({ item: '', quantity: '', unit: '' });

    // Close bottom sheet
    setBottomSheetVisible(false);

    // Show success message
    Alert.alert('Success', 'Inventory item added successfully');
  };

  // Reset form when bottom sheet closes
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
          onPress={() => setBottomSheetVisible(true)} />} />
      <FlatList
        data={inventoryItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate(
              paths.viewInventory as any, { item } as never
            )}
            style={styles.card}
          >
            <AppText style={styles.item}>{item.item}</AppText>
            <AppText style={styles.quantity}>{item.quantity} {item.unit}</AppText>
          </TouchableOpacity>
        )}
      />

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
    fontSize: 16
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