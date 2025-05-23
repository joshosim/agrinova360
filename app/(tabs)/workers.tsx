import { AppText } from '@/components/AppText';
import { AppBar } from '@/components/ui/AppBar';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { FlatList, RootViewStyleProvider, StyleSheet, View } from 'react-native';

const Workers = () => {

  const { user } = useAuth()

  const [workers, setWorkers] = useState<any[]>([])

  const fetchWorkers = async (organizationId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('organization_id', organizationId)
      .eq('role', 'Farmer');

    if (error) {
      console.error('Error fetching workers:', error.message);
      return [];
    }

    return data;
  };

  useEffect(() => {
    const getWorkers = async () => {
      if (user?.organization_id) {
        const workers = await fetchWorkers(user.organization_id);
        console.log('Workers:', workers);
        setWorkers(workers)

        // Example: render worker names
        workers.forEach(worker => {
          console.log(worker.fullname);
        });
      }
    }

    getWorkers()

  }, [user])

  const mockWorkers = [
    { id: '1', name: 'John Doe', role: 'Caretaker' },
    { id: '2', name: 'Jane Smith', role: 'Supervisor' },
  ];

  const navigation = useNavigation<NavigationProp<RootViewStyleProvider>>();

  return (
    <View style={styles.container}>
      <AppBar title='Workers' />

      <FlatList
        data={workers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workerCard}>
            <AppText style={[styles.name, { fontWeight: 600 }]}>{item.fullname}</AppText>
            <AppText style={styles.name}>{item.email}</AppText>
            <AppText style={styles.name}>{item.phone}</AppText>
            <AppText style={styles.role}>{item.role}</AppText>
          </View>
        )}
      />
    </View>
  )
}

export default Workers

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  workerCard: { backgroundColor: '#eef2f3', padding: 15, marginBottom: 10, borderRadius: 10 },
  name: { fontSize: 16 },
  role: { fontSize: 14, color: 'gray' },
});