import { MaterialIcons } from '@expo/vector-icons';
import * as React from 'react';
import { FlatList, Modal, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { FinancialReportCard } from './ui/FinancialCard';

const FILTER_OPTIONS = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'last7days', label: 'Last 7 Days' },
  { key: 'thisMonth', label: 'This Month' },
];

const FinancialReportTable = () => {
  const [items] = React.useState([
    { key: 1, name: 'Sale of Eggs', amount: 45000, category: 'Income', date: '2025-07-10' },
    { key: 2, name: 'Purchase of Chicken Feed', amount: 15000, category: 'Expense', date: '2025-07-12' },
    { key: 3, name: 'Labor Wages Payment', amount: 30000, category: 'Expense', date: '2025-07-15' },
    { key: 4, name: 'Sale of Broiler Chickens', amount: 120000, category: 'Income', date: '2025-07-18' },
    { key: 5, name: 'Veterinary Services', amount: 10000, category: 'Expense', date: '2025-07-20' },
    { key: 6, name: 'Fertilizer Purchase', amount: 20000, category: 'Expense', date: '2025-07-22' },
    { key: 7, name: 'Sale of Vegetables', amount: 50000, category: 'Income', date: '2025-07-23' },
    { key: 8, name: 'Farm Equipment Maintenance', amount: 18000, category: 'Expense', date: '2025-07-24' },
    { key: 9, name: 'Irrigation Pump Fuel', amount: 8000, category: 'Expense', date: '2025-07-25' },
    { key: 10, name: 'Sale of Goat Milk', amount: 35000, category: 'Income', date: '2025-07-25' },
  ]);
  const [open, setOpen] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState(FILTER_OPTIONS[0]);

  const handleSelectFilter = (filter: any) => {
    setSelectedFilter(filter);
    setOpen(false);
  };

  return (
    <View style={{ marginBottom: 300 }}>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.filterButton}>
        <MaterialIcons name='date-range' size={18} />
        <AppText>{selectedFilter.label}</AppText>
      </TouchableOpacity>

      <FlatList
        data={items}
        keyExtractor={(item) => item.key.toString()}
        renderItem={({ item }) => <FinancialReportCard item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={styles.bottomSheet}>
            {FILTER_OPTIONS.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                onPress={() => handleSelectFilter(filter)}
                style={styles.optionItem}
              >
                <AppText style={{ fontSize: 16 }}>{filter.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  filterButton: {
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ece7e4',
    padding: 5,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
});

export default FinancialReportTable;
