import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import { AppText } from './AppText';

const UnitDropdown = ({ selectedUnit, onSelect }: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  // Common units for farming inventory
  const units = [
    { id: '1', name: 'kg', label: 'Kilograms (kg)' },
    { id: '2', name: 'g', label: 'Grams (g)' },
    { id: '3', name: 'L', label: 'Liters (L)' },
    { id: '4', name: 'mL', label: 'Milliliters (mL)' },
    { id: '5', name: 'pcs', label: 'Pieces (pcs)' },
    { id: '6', name: 'bags', label: 'Bags' },
    { id: '7', name: 'bottles', label: 'Bottles' },
    { id: '8', name: 'trays', label: 'Trays' },
    { id: '9', name: 'boxes', label: 'Boxes' },
    { id: '10', name: 'vials', label: 'Vials' },
  ];

  const handleSelect = (unit: any) => {
    onSelect(unit.name);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setModalVisible(true)}
      >
        <AppText style={styles.selectedText}>
          {selectedUnit || 'Select unit'}
        </AppText>
        <Ionicons name="chevron-down" size={20} color="#555" />
      </TouchableOpacity>

      <Modal
        transparent
        visible={modalVisible}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <AppText style={styles.modalTitle}>Select Unit</AppText>

            <FlatList
              data={units}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.unitItem,
                    selectedUnit === item.name && styles.selectedUnit
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <AppText style={[
                    styles.unitText,
                    selectedUnit === item.name && styles.selectedUnitText
                  ]}>
                    {item.label}
                  </AppText>
                  {selectedUnit === item.name && (
                    <Ionicons name="checkmark" size={20} color="#4CAF50" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    backgroundColor: 'white',
  },
  selectedText: {
    fontSize: 16,
    color: '#333',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'SoraBold',
    marginBottom: 15,
    textAlign: 'center',
  },
  unitItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  selectedUnit: {
    backgroundColor: '#f8f8f8',
  },
  unitText: {
    fontSize: 16,
    color: '#333',
  },
  selectedUnitText: {
    fontWeight: '500',
  },
});

export default UnitDropdown;