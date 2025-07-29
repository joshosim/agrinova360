import { StyleSheet, View } from "react-native";
import { AppText } from "../AppText";

export const FinancialReportCard = ({ item }: { item: any }) => (
  <View style={styles.card}>
    <AppText style={styles.title}>{item.key}. {item.name}</AppText>
    <View style={styles.infoRow}>
      <AppText style={styles.category}>{item.category}</AppText>
      <AppText style={styles.amount}>₦{item.amount.toLocaleString()}</AppText>
      <AppText style={styles.date}>{item.date}</AppText>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  category: {
    color: '#888',
    fontWeight: '500',
  },
  amount: {
    fontWeight: '600',
    color: '#333',
  },
  date: {
    color: '#aaa',
    fontSize: 12,
  },
});
