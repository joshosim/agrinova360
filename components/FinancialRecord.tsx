import { useAuth } from '@/context/AuthContext';
import { fetchFinancialReports } from '@/utils/helpers';
import { MaterialIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
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

  const { user } = useAuth()

  const { data: reports, isLoading } = useQuery({
    queryKey: ['financial_reports', user?.organization_id],
    queryFn: () => {
      if (!user?.organization_id) return undefined;
      return fetchFinancialReports(user.organization_id);
    },
    enabled: !!user?.organization_id,
  })

  console.log("reports", reports)
  const [open, setOpen] = React.useState(false);
  const [selectedFilter, setSelectedFilter] = React.useState(FILTER_OPTIONS[0]);

  const handleSelectFilter = (filter: any) => {
    setSelectedFilter(filter);
    setOpen(false);
  };

  return (
    <View style={{ marginBottom: 100 }}>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={styles.filterButton}>
        <MaterialIcons name='date-range' size={18} />
        <AppText>{selectedFilter.label}</AppText>
      </TouchableOpacity>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.key}
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
