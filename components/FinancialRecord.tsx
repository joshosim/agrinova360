import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import { AppText } from './AppText';

type FinancialRecord = {
  item: string;
  amount: number;
  date: string;
};

const financialData: FinancialRecord[] = [
  { item: 'Fertilizer Purchase', amount: 25000, date: '2025-07-01' },
  { item: 'Seed Sales', amount: 45000, date: '2025-07-05' },
  { item: 'Labor Payment', amount: 15000, date: '2025-07-10' },
  { item: 'Equipment Maintenance', amount: 10000, date: '2025-07-15' },
];

const FinancialRecordTable = () => {
  return (
    <View style={styles.wrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Title><AppText>Item</AppText></DataTable.Title>
            <DataTable.Title numeric><AppText>Amount (₦)</AppText></DataTable.Title>
            <DataTable.Title><AppText></AppText></DataTable.Title>
            <DataTable.Title><AppText>Date</AppText></DataTable.Title>
          </DataTable.Header>

          {financialData.map((record, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell><AppText>{record.item}</AppText></DataTable.Cell>
              <DataTable.Cell numeric><AppText>{record.amount.toLocaleString()}</AppText></DataTable.Cell>
              <DataTable.Cell ><AppText></AppText></DataTable.Cell>
              <DataTable.Cell><AppText>{record.date}</AppText></DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
    </View>
  );
};

export default FinancialRecordTable;

const styles = StyleSheet.create({
  wrapper: {
    padding: 15,
  },
  container: {
    minWidth: 600, // ensures the table will be scrollable if smaller screen
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
  },
});
