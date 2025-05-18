import { AppText } from '@/components/AppText';
import { AppBar } from '@/components/ui/AppBar';
import paths from '@/utils/paths';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { FlatList, RootViewStyleProvider, StyleSheet, View } from 'react-native';

const Workers = () => {

  const mockWorkers = [
    { id: '1', name: 'John Doe', role: 'Caretaker' },
    { id: '2', name: 'Jane Smith', role: 'Supervisor' },
  ];

  const navigation = useNavigation<NavigationProp<RootViewStyleProvider>>();

  const goToSignup = () => {
    navigation.navigate(paths.auth.signup as never)
  }

  return (
    <View style={styles.container}>
      <AppBar title='Workers' />

      <FlatList
        data={mockWorkers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workerCard}>
            <AppText style={styles.name}>{item.name}</AppText>
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