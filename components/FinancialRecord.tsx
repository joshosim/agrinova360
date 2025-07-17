import React, { FC, useMemo } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Row, Table } from "react-native-table-component";

export interface FinancialRecordTableProps {
  /** Optional 2‑D array of cell strings. If omitted, a 30 × 9 demo grid is generated. */
  rows?: string[][];
  /** Column headers (length must match `widthArr`). */
  tableHead?: string[];
  /** Width for each column (same length as `tableHead`). */
  widthArr?: number[];
}

const DEFAULT_HEAD = [
  "Head1",
  "Head2",
  "Head3",
  "Head4",
  "Head5",
  "Head6",
  "Head7",
  "Head8",
  "Head9",
];

const DEFAULT_WIDTHS = [40, 60, 80, 100, 120, 140, 160, 180, 200];

const FinancialRecordTable: FC<FinancialRecordTableProps> = ({
  rows,
  tableHead = DEFAULT_HEAD,
  widthArr = DEFAULT_WIDTHS,
}) => {
  // Build demo data only when `rows` isn't provided
  const tableData = useMemo<string[][]>(() => {
    if (rows) return rows;
    const data: string[][] = [];
    for (let i = 0; i < 30; i += 1) {
      const row: string[] = [];
      for (let j = 0; j < 9; j += 1) {
        row.push(`${i}${j}`);
      }
      data.push(row);
    }
    return data;
  }, [rows]);

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <Table borderStyle={styles.border}>
            <Row
              data={tableHead}
              widthArr={widthArr}
              style={styles.header}
              textStyle={styles.text}
            />
          </Table>
          <ScrollView style={styles.dataWrapper} showsVerticalScrollIndicator={false}>
            <Table borderStyle={styles.border}>
              {tableData.map((rowData, index) => (
                <Row
                  key={`row-${index}`}
                  data={rowData}
                  widthArr={widthArr}
                  style={[
                    styles.row,
                    index % 2 !== 0 && styles.altRow,
                  ]}
                  textStyle={styles.text}
                />
              ))}
            </Table>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "blue",
  },
  border: { borderWidth: 1, borderColor: "#C1C0B9" },
  header: { height: 50, backgroundColor: "#537791", color: 'black' },
  text: { textAlign: "center", fontWeight: "100" },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: "#E7E6E1" },
  altRow: { backgroundColor: "#F7F6E7" },
});

export default FinancialRecordTable;
