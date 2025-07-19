import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Row, Rows, Table } from 'react-native-table-component';

const TableComponent = () => {
  const tableHead = ['Item', 'Amount (₦)', 'Date'];
  const tableData = [
    ['Fertilizer Purchase', '25,000', '2025-07-01'],
    ['Seed Sales', '45,000', '2025-07-05'],
    ['Labor Payment', '15,000', '2025-07-10'],
    ['Equipment Maintenance', '10,000', '2025-07-15'],
  ];

  return (
    <View style={styles.container}>
      <ScrollView horizontal>
        <Table borderStyle={{ borderWidth: 1, borderColor: '#c8e1ff' }}>
          <Row data={tableHead} style={styles.head} textStyle={styles.text} />
          <Rows data={tableData} textStyle={styles.text} />
        </Table>
      </ScrollView>
    </View>
  );
};

export default TableComponent;

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 30 },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 6 },
});
