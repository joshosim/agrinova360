import { AppText } from '@/components/AppText';
import { AppBar } from '@/components/ui/AppBar';
import { lightGreen, mainLight } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { fetchInventory, fetchInventoryLength, fetchOrganizationName, fetchWorkerCount, formatDateTime } from '@/utils/helpers';
import paths from '@/utils/paths';
import { MaterialIcons } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from './inventory';

export default function HomePage() {

  const recentTransactions = [
    { id: '1', title: "Sold Eggs", amount: "₦5,000" },
    { id: '2', title: "Bought Feed", amount: "₦12,000" },
    { id: '3', title: "Vet Visit", amount: "₦3,500" },
  ];

  const recentInventory = [
    { id: '1', item: "Chicken Feed", quantity: 25 },
    { id: '2', item: "Eggs", quantity: 120 },
    { id: '3', item: "Vaccines", quantity: 10 },
  ];

  const { user, loading } = useAuth();

  console.log("user:", user)

  const [orgName, setOrgName] = useState<string | null>(null);
  const [orgWorkers, setOrgWorkers] = useState<number | null>(null);


  const [inventoryCount, setInventoryCount] = useState<number>(0);
  const [inventory, setInventory] = useState<any[]>([])

  useEffect(() => {
    const loadInventory = async () => {
      if (!user?.organization_id) return;
      const inventorys = await fetchInventory(user.organization_id);
      setInventory(inventorys);
    };
    loadInventory();
    console.log('Inventory', inventory)
    console.log('Inventory Length', inventory.length)
  }, [])



  useEffect(() => {
    const getCount = async () => {
      try {
        const count = await fetchInventoryLength();
        setInventoryCount(count);
      } catch (error) {
        console.error("Error fetching inventory count:", error);
      }
    };

    getCount();
  }, []);

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  useEffect(() => {
    const getOrganization = async () => {
      if (!user?.organization_id) return;
      const name = await fetchOrganizationName(user.organization_id);
      setOrgName(name);
    };

    getOrganization();
  }, [user]);

  useEffect(() => {
    const loadWorkerCount = async () => {
      if (!user?.organization_id) return;
      const count = await fetchWorkerCount(user?.organization_id);
      setOrgWorkers(count)
      console.log('Worker count:', count);
    };

    loadWorkerCount();
  }, [user]);

  const Card = ({ title, value, icon }: {
    title: string,
    value: number | null,
    icon?: any,
  }) => {
    return (
      <TouchableOpacity style={styles.card}>
        <View><Image source={icon} style={{ height: 40, width: 40, borderRadius: 100 }} /></View>
        <AppText>{title}</AppText>
        <AppText>{value}</AppText>
      </TouchableOpacity >)
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Farm Title */}

      {!loading ? <AppBar title={orgName}
        onRight={
          <MaterialIcons name='person'
            onPress={() => navigation.navigate(paths.profile as never)}
            size={28} color={'black'}
          />
        }
        onGoBack={
          <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 100 }}>
            <MaterialIcons name='menu'
              onPress={() => navigation.navigate(paths.profile as never)}
              size={28} color={'black'}
            />
          </View>
        }
      /> : <AppText>Loading...</AppText>}
      {/* Dashboard Summary */}
      <View>
        <AppText style={{ marginBottom: 4 }}>Hi, {user?.fullname}</AppText>
        <AppText style={styles.sectionTitle}>Track Summary</AppText>
        <View style={styles.dashboardRow}>
          <Card title='Workers' value={orgWorkers} icon={require("../../assets/images/farmer.jpeg")} />
          <Card title='Inventory' value={inventoryCount} icon={require("../../assets/images/inventory.jpeg")} />
          <Card title='Income' value={orgWorkers} icon={require("../../assets/images/sales.jpeg")} />
        </View>
      </View>
      {/* Recent Transactions */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText style={styles.sectionTitle}>Recent Transactions</AppText>
          <AppText style={styles.rowText}>See All</AppText>
        </View>
        {recentTransactions.map(({ id, title, amount }) => (
          <View key={id} style={styles.row}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Image source={require("../../assets/images/schedule.jpeg")}
                style={{ height: 40, width: 40, borderRadius: 100 }} />
              <View style={{ gap: 6 }}>
                <AppText style={[styles.rowText, { fontWeight: '600', }]}>{title}</AppText>
                <AppText style={styles.rowText}>21 Sep, 03:02 PM</AppText>
              </View>
            </View>
            <AppText style={styles.rowAmount}>{amount}</AppText>
          </View>
        ))}
      </View>

      {/* Recent Inventory */}
      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <AppText style={styles.sectionTitle}>Recent Inventory</AppText>
          <AppText style={styles.rowText}>See All</AppText>
        </View>
        {inventory.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.row}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Image source={{ uri: item.image }}
                style={{ height: 40, width: 40, borderRadius: 100 }} />
              <View style={{ gap: 6 }}>
                <AppText style={[styles.rowText, { fontWeight: '600', textTransform: 'capitalize' }]}>{item.name}</AppText>
                <AppText style={styles.rowText}>{formatDateTime(item.created_at)}</AppText>
              </View>
            </View>
            <AppText style={styles.rowAmount}>{item.quantity}</AppText>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: mainLight,
    padding: 16,
  },
  AppBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  farmTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'SpaceGrotesk'
  },
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  card: {
    flex: 1,
    marginHorizontal: 4,
    borderRadius: 12,
    backgroundColor: lightGreen,
    padding: 10,
    gap: 10
  },
  cardTitle: {
    fontSize: 14,
    color: '#555',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10
  },
  rowText: {
    fontSize: 16,
  },
  rowAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
});
