import * as React from 'react';
import { ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';

const FinancialReportTable = () => {
  const [page, setPage] = React.useState<number>(0);
  const [numberOfItemsPerPageList] = React.useState([2, 3, 4]);
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0]
  );

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

  const from = page * itemsPerPage;
  const to = Math.min((page + 3) * itemsPerPage, items.length);

  React.useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  return (
    <ScrollView
      horizontal={true}
      showsHorizontalScrollIndicator={true}
    >
      <DataTable style={{}}>
        <DataTable.Header>
          <DataTable.Title>S/N</DataTable.Title>
          <DataTable.Title>Title</DataTable.Title>
          <DataTable.Title numeric>Category</DataTable.Title>
          <DataTable.Title numeric>Amount</DataTable.Title>
          <DataTable.Title numeric>Date</DataTable.Title>
        </DataTable.Header>

        {items.slice(from, to).map((item) => (
          <DataTable.Row key={item.key}>
            <DataTable.Cell>{item.key}</DataTable.Cell>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.category}</DataTable.Cell>
            <DataTable.Cell numeric>{item.amount.toLocaleString()}</DataTable.Cell>
            <DataTable.Cell numeric>{item.date}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
      <DataTable style={{

      }}>
        <DataTable.Header>
          <DataTable.Title>S/N</DataTable.Title>
          <DataTable.Title>Title</DataTable.Title>
          <DataTable.Title numeric>Category</DataTable.Title>
          <DataTable.Title numeric>Amount</DataTable.Title>
          <DataTable.Title numeric>Date</DataTable.Title>
        </DataTable.Header>

        {items.slice(from, to).map((item) => (
          <DataTable.Row key={item.key}>
            <DataTable.Cell>{item.key}</DataTable.Cell>
            <DataTable.Cell>{item.name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.category}</DataTable.Cell>
            <DataTable.Cell numeric>{item.amount.toLocaleString()}</DataTable.Cell>
            <DataTable.Cell numeric>{item.date}</DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(items.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} of ${items.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
          selectPageDropdownLabel={'Rows per page'}
        />
      </DataTable>
    </ScrollView >
  );
};

export default FinancialReportTable;