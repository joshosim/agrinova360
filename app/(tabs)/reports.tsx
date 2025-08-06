import { AppText } from '@/components/AppText'
import CustomBottomSheet from '@/components/BottomSheet'
import FinancialReportTable from '@/components/FinancialRecord'
import { AppBar } from '@/components/ui/AppBar'
import WeatherComponent from '@/components/WeatherReport'
import { useAuth } from '@/context/AuthContext'
import { addFarmReport, fetchFarmReports } from '@/utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import {
  Alert,
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useToast } from 'react-native-toast-notifications'
import { FarmReportData } from '../types/weather'

const Reports = () => {
  const { user } = useAuth();
  const toast = useToast();

  const { data: reports, isLoading, error } = useQuery<FarmReportData[]>({
    queryKey: ['farm_reports', user?.organization_id],
    queryFn: () => {
      if (!user?.organization_id) return undefined;
      return fetchFarmReports(user.organization_id);
    },
    enabled: !!user?.organization_id,
  })

  console.log("reports", reports)

  const [bottomSheetVisible, setBottomSheetVisible] = useState(false)

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (report: FarmReportData & { organization_id: string }) => addFarmReport(report),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farm_reports', user?.organization_id] });

      setNewReport(initialReportState);
      setBottomSheetVisible(false);
      toast.show("Added Successfully", {
        type: "success",
        placement: "top",
        textStyle: { fontFamily: 'SoraRegular' },
        duration: 1500,
        animationType: "slide-in",
        icon: <Ionicons name='checkmark-circle' size={25} color='white' />
      });
    },
    onError: (error: any) => {
      toast.show(error.message || 'Failed to add report', {
        type: "warning",
        placement: "top",
        duration: 1500,
        textStyle: { fontFamily: 'SoraRegular' },
        animationType: "slide-in",
        icon: <Ionicons name='warning-outline' size={25} color='white' />
      });
    }
  });


  const initialReportState = {
    section: '',
    activities: '',
    productionCount: '',
    inputsUsed: '',
    salesRevenue: '',
    expensesIncurred: '',
    casualties: '',
    observations: '',
    weather: '',
  };

  const [newReport, setNewReport] = useState<FarmReportData>(initialReportState);

  const handleAddReport = () => {
    if (
      !newReport.section || !newReport.activities ||
      !newReport.productionCount || !newReport.inputsUsed
    ) {
      Alert.alert('Error', 'Please fill in required fields');
      return;
    }

    mutation.mutate({
      ...newReport,
      organization_id: user?.organization_id as string,
    });
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false)
  }

  const [stateOfReport, setStateOfReport] = useState(0)

  const changeStateOfReport = (theState: number) => {
    setStateOfReport(theState)
  }

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
                <AppText>📋 Section: {item.section}</AppText>
                <AppText>🛠 Activities: {item.activities}</AppText>
                <AppText>🐔 Production: {item.productionCount}</AppText>
                <AppText>📦 Inputs Used: {item.inputsUsed}</AppText>
                <AppText>💰 Sales: {item.salesRevenue}</AppText>
                <AppText>💸 Expenses: {item.expensesIncurred}</AppText>
                <AppText>⚠️ Casualties: {item.casualties}</AppText>
                {item.observations ? <AppText>📝 Observations: {item.observations}</AppText> : null}
                {item.weather ? <AppText>🌦 Weather: {item.weather}</AppText> : null}
                <AppText>👤 Prepared By: {item.preparedBy}</AppText>
              </View>
            )}
          />


          {/* Bottom Sheet */}
          <CustomBottomSheet
            visible={bottomSheetVisible}
            onClose={handleBottomSheetClose}
            sheetHeight="80%"
          >
            <ScrollView style={styles.bottomSheetContent}>
              <AppText style={styles.bottomSheetTitle}>Add Farm Report</AppText>

              {/* Section */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Farm Section</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Poultry"
                  value={newReport.section}
                  onChangeText={(text) => setNewReport({ ...newReport, section: text })}
                />
              </View>

              {/* Activities */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Activities Performed</AppText>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="e.g. Collected eggs, cleaned cages..."
                  value={newReport.activities}
                  onChangeText={(text) => setNewReport({ ...newReport, activities: text })}
                />
              </View>

              {/* Production Count */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Production Count</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 250 eggs"
                  value={newReport.productionCount}
                  onChangeText={(text) => setNewReport({ ...newReport, productionCount: text })}
                />
              </View>

              {/* Inputs Used */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Inputs Used</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 20kg feed, vitamins"
                  value={newReport.inputsUsed}
                  onChangeText={(text) => setNewReport({ ...newReport, inputsUsed: text })}
                />
              </View>

              {/* Sales Revenue */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Sales/Revenue</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. ₦10,000"
                  value={newReport.salesRevenue}
                  onChangeText={(text) => setNewReport({ ...newReport, salesRevenue: text })}
                />
              </View>

              {/* Expenses Incurred */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Expenses Incurred</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. ₦2,000"
                  value={newReport.expensesIncurred}
                  onChangeText={(text) => setNewReport({ ...newReport, expensesIncurred: text })}
                />
              </View>

              {/* Casualties */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Casualties</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. 1 chick died"
                  value={newReport.casualties}
                  onChangeText={(text) => setNewReport({ ...newReport, casualties: text })}
                />
              </View>

              {/* Observations */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Observations</AppText>
                <TextInput
                  style={styles.input}
                  multiline
                  placeholder="Any notable remarks"
                  value={newReport.observations}
                  onChangeText={(text) => setNewReport({ ...newReport, observations: text })}
                />
              </View>

              {/* Weather */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Weather</AppText>
                <TextInput
                  style={styles.input}
                  placeholder="e.g. Sunny, Rainy..."
                  value={newReport.weather}
                  onChangeText={(text) => setNewReport({ ...newReport, weather: text })}
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
                  disabled={mutation.isPending}
                >
                  <AppText style={styles.addButtonText}>
                    {mutation.isPending ? 'Adding...' : 'Add Report'}
                  </AppText>
                </TouchableOpacity>
              </View>
            </ScrollView>
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
    fontFamily: 'SoraBold'
  },
  topBarNav: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 10
  }
});
