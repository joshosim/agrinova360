import { AppText } from '@/components/AppText'
import CustomBottomSheet from '@/components/BottomSheet'
import FinancialReportTable from '@/components/FinancialRecord'
import { AppBar } from '@/components/ui/AppBar'
import WeatherComponent from '@/components/WeatherReport'
import { Ionicons } from '@expo/vector-icons'
import React, { useState } from 'react'
import {
  Alert,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'

const Reports = () => {
  const [reports, setReports] = useState([
    {
      id: '1',
      date: '2025-04-25',
      summary: '200 eggs collected. 2 hens treated.',
      casualties: '1 chick died due to cold.',
    },
    {
      id: '2',
      date: '2025-04-24',
      summary: 'Sold 150 eggs. Feed refilled.',
      casualties: 'None',
    },
  ])

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false)

  const [newReport, setNewReport] = useState({
    date: '',
    summary: '',
    casualties: '',
  })

  const handleAddReport = () => {
    if (!newReport.date || !newReport.summary || !newReport.casualties) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    const report = {
      id: Date.now().toString(),
      ...newReport,
    }

    setReports([...reports, report])
    setNewReport({ date: '', summary: '', casualties: '' })
    setBottomSheetVisible(false)
    Alert.alert('Success', 'Report added successfully')
  }

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false)
    setNewReport({ date: '', summary: '', casualties: '' })
  }

  const [stateOfReport, setStateOfReport] = useState(0)

  const changeStateOfReport = (theState: number) => {
    setStateOfReport(theState)
  }
  const data = [
    { id: '1', item: 'Egg Stands', quantity: 20, unit: 'boxes', unitPrice: 3500 },
    { id: '2', item: 'Onion Bulb', quantity: 40, unit: 'bags', unitPrice: 18000 },
  ];
  return (
    <View style={styles.container}>
      <AppBar title='Reports'
        onRight={<Ionicons
          name='add-circle'
          size={28}
          color="black"
          onPress={() => setBottomSheetVisible(true)} />} />
      <View>
        <View style={styles.topBarNav}>
          <TouchableOpacity style={{
            borderBottomWidth: stateOfReport === 0 ? 2 : 0,
            borderBottomColor: 'black',
            paddingBottom: 5
          }} onPress={() => changeStateOfReport(0)}>
            <AppText>Financial </AppText>
          </TouchableOpacity>

          <TouchableOpacity style={{
            borderBottomWidth: stateOfReport === 1 ? 2 : 0,
            borderBottomColor: 'black',
            paddingBottom: 5
          }} onPress={() => changeStateOfReport(1)}>
            <AppText>Farm </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={{
            borderBottomWidth: stateOfReport === 2 ? 2 : 0,
            borderBottomColor: 'black',
            paddingBottom: 5
          }} onPress={() => changeStateOfReport(2)}>
            <AppText>Weather </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={{ display: stateOfReport === 0 ? "flex" : "none" }}>
          <AppText style={{
            textAlign: 'center', fontSize: 20,
            fontFamily: 'SoraBold'
          }}>Financial Report</AppText>
          <FinancialReportTable />
        </View>
        <View style={{ display: stateOfReport === 1 ? "flex" : "none" }}>
          <AppText style={{
            textAlign: 'center', fontSize: 20,
            fontFamily: 'SoraBold'
          }}>Farm Report</AppText>
          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reportCard}>
                <AppText style={styles.date}>{item.date}</AppText>
                <AppText style={styles.summary}>📝 Summary: {item.summary}</AppText>
                <AppText style={styles.casualty}>⚠️ Casualties: {item.casualties}</AppText>
              </View>
            )}
          />

          {/* Bottom Sheet */}
          <CustomBottomSheet
            visible={bottomSheetVisible}
            onClose={handleBottomSheetClose}
            sheetHeight="60%"
          >
            <View style={styles.bottomSheetContent}>
              <AppText style={styles.bottomSheetTitle}>Add New Report</AppText>

              <View style={styles.formGroup}>
                <AppText style={styles.label}>Date</AppText>
                <TextInput
                  style={styles.input}
                  value={newReport.date}
                  onChangeText={(text) => setNewReport({ ...newReport, date: text })}
                  placeholder="e.g. 2025-04-30"
                />
              </View>

              <View style={styles.formGroup}>
                <AppText style={styles.label}>Summary</AppText>
                <TextInput
                  style={styles.input}
                  value={newReport.summary}
                  onChangeText={(text) => setNewReport({ ...newReport, summary: text })}
                  placeholder="e.g. Collected 200 eggs..."
                />
              </View>

              <View style={styles.formGroup}>
                <AppText style={styles.label}>Casualties</AppText>
                <TextInput
                  style={styles.input}
                  value={newReport.casualties}
                  onChangeText={(text) => setNewReport({ ...newReport, casualties: text })}
                  placeholder="e.g. 1 chick died"
                />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleBottomSheetClose}
                >
                  <AppText style={styles.cancelButtonText}>Cancel</AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddReport}
                >
                  <AppText style={styles.addButtonText}>Add Report</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </CustomBottomSheet>
        </View>
        <View style={{ display: stateOfReport === 2 ? "flex" : "none" }}>
          <AppText style={{
            textAlign: 'center', fontSize: 20,
            fontFamily: 'SoraBold'
          }}>Weather Report</AppText>
          <WeatherComponent />
        </View>
      </View>
    </View>
  )
}

export default Reports

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: 'white' },
  header: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: { fontSize: 20, fontWeight: 'bold' },
  reportCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10
  },
  date: { fontWeight: 'bold', fontSize: 14, marginBottom: 5 },
  summary: { fontSize: 14, marginBottom: 5 },
  casualty: { fontSize: 14, color: 'red' },

  // Bottom Sheet Content
  bottomSheetContent: {
    flex: 1,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: 15
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    color: '#555'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    marginRight: 10
  },
  cancelButtonText: {
    color: '#555',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  topBarNav: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  }
});
