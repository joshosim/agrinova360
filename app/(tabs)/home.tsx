import { AppText } from '@/components/AppText';
import { AppBar } from '@/components/ui/AppBar';
import { lightGreen, mainLight } from '@/constants/Colors';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import paths from '@/utils/paths';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, RootViewStyleProvider, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function HomePage() {

  const dashboardData = [
    {
      title: "Workers", value: 12,
      icon: require("../../assets/images/farmer.jpeg")
    },
    {
      title: "Inventory", value: 38,
      icon: require("../../assets/images/inventory.jpeg")
    },
    {
      title: "Income", value: "₦450,000",
      icon: require("../../assets/images/sales.jpeg")
    },
  ];

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

  const navigation = useNavigation<NavigationProp<RootViewStyleProvider>>();
  // joshuauka0@gmail.com - - ZHDFUC
  const { user, loading } = useAuth();

  console.log("user:", user)

  const Card = ({ title, value, icon }: {
    title: string,
    value: string | number,
    icon?: any,
  }) => {
    return (
      <TouchableOpacity style={styles.card}>
        <View><Image source={icon} style={{ height: 40, width: 40, borderRadius: 100 }} /></View>
        <AppText>{title}</AppText>
        <AppText>{value}</AppText>
      </TouchableOpacity >)
  }
  const logout = async () => {
    await AsyncStorage.removeItem('user_profile');
    await supabase.auth.signOut();
    navigation.navigate(paths.auth.login as never)
    console.log("user_profile removed")
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      {/* Farm Title */}

      {!loading ? <AppBar title={user?.farm_name}
        onRight={
          <Ionicons name='log-in-outline'
            onPress={logout}
            size={28} color={'black'}
          />
        }
        onGoBack={
          <Ionicons name='menu-outline'
            onPress={() => navigation.navigate(paths.profile as never)}
            size={28} color={'black'}
          />
        }
      /> : <AppText>Loading...</AppText>}
      {/* Dashboard Summary */}
      <View>
        <AppText style={styles.sectionTitle}>Track Summary</AppText>
        <View style={styles.dashboardRow}>
          {dashboardData.map(({ title, value, icon }, index) => (
            <Card key={index} title={title} value={value} icon={icon} />
          ))}
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
        {recentInventory.map(({ id, item, quantity }) => (
          <View key={id} style={styles.row}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Image source={require("../../assets/images/schedule.jpeg")}
                style={{ height: 40, width: 40, borderRadius: 100 }} />
              <View style={{ gap: 6 }}>
                <AppText style={[styles.rowText, { fontWeight: '600', }]}>{item}</AppText>
                <AppText style={styles.rowText}>21 Sep, 03:02 PM</AppText>
              </View>
            </View>
            <AppText style={styles.rowAmount}>{quantity}</AppText>
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
