import { AppText } from '@/components/AppText'
import CustomBottomSheet from '@/components/BottomSheet'
import FinancialReportTable from '@/components/FinancialRecord'
import { AppBar } from '@/components/ui/AppBar'
import WeatherComponent from '@/components/WeatherReport'
import { useAuth } from '@/context/AuthContext'
import { addFarmReport, fetchFarmReports, formatDateTime, formatTime } from '@/utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { Controller, useForm } from "react-hook-form"
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native'
import { useToast } from 'react-native-toast-notifications'
import * as yup from "yup"
import { FarmReportData } from '../types/weather'

const reportSchema = yup.object().shape({
  section: yup.string().required("Section is required"),
  activities: yup.string().required("Activities are required"),
  productionCount: yup.string().required("Production count is required"),
  casualties: yup.string().optional(),
  observations: yup.string().optional(),
  weather: yup.string().required("Weather is required"),
  challenges: yup.string().optional(),
  plans: yup.string().optional(),
});

const initialReportState = {
  section: '',     // Crop, Livestock, Fisheries, Mixed
  activities: '',   // planting, feeding, harvesting
  productionCount: '',
  casualties: '',
  weather: '',
  observations: '',
  challenges: '',
  plans: '',
};

const Reports = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false)
  const queryClient = useQueryClient();
  const [newReport, setNewReport] = useState<FarmReportData>(initialReportState);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(reportSchema),
    defaultValues: initialReportState,
  });

  const { data: reports, isLoading } = useQuery({
    queryKey: ['farm_reports', user?.organization_id],
    queryFn: () => {
      if (!user?.organization_id) return undefined;
      return fetchFarmReports(user.organization_id);
    },
    enabled: !!user?.organization_id,
  })

  console.log("reports",
    reports
  );

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

  const onSubmit = (data: any) => {
    mutation.mutate({
      ...data,
      organization_id: user?.organization_id as string,
    });
    reset();
  };

  const handleBottomSheetClose = () => {
    setBottomSheetVisible(false)
  }

  const [stateOfReport, setStateOfReport] = useState(user?.role === 'Manager' ? 0 : 1)
  // 0 - Financial, 1 - Farm, 2 - Weather

  const changeStateOfReport = (theState: number) => {
    setStateOfReport(theState)
  }

  return (
    <View style={styles.container}>
      <AppBar title='Reports' />
      <View >
        <View style={styles.topBarNav}>
          {user?.role === 'Manager' &&
            <TouchableOpacity
              style={[styles.topBarNavItem, stateOfReport === 0 ? styles.activeTab : {}]}
              onPress={() => changeStateOfReport(0)}>
              <AppText>Financial </AppText>
            </TouchableOpacity>}
          <TouchableOpacity
            style={[styles.topBarNavItem, stateOfReport === 1 ? styles.activeTab : {}]}
            onPress={() => changeStateOfReport(1)}>
            <AppText>Farm </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topBarNavItem, stateOfReport === 2 ? styles.activeTab : {}]}
            onPress={() => changeStateOfReport(2)}>
            <AppText>Weather </AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ display: stateOfReport === 0 ? "flex" : "none" }}>
          <AppText style={{
            textAlign: 'center', fontSize: 20,
            fontFamily: 'SoraBold'
          }}>Financial Report</AppText>
          <FinancialReportTable />
        </View>
        <View style={{ display: stateOfReport === 1 ? "flex" : "none", flex: 1 }}>
          <View style={styles.header}>
            <AppText style={{
              textAlign: 'center', fontSize: 20,
              fontFamily: 'SoraBold'
            }}>Farm Report</AppText>

            <Ionicons
              name='add-circle'
              size={28}
              color="black"
              onPress={() => setBottomSheetVisible(true)} />
          </View>
          <AppText style={{
            textAlign: 'left', fontSize: 12,
            fontFamily: 'SoraRegular', color: 'gray', marginBottom: 10
          }}>This is a daily report of the operations that were carried out on the farm.</AppText>

          <FlatList
            data={reports}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reportCard}>
                <AppText style={{ alignSelf: 'flex-end' }}>{formatDateTime(item.created_at)} - {formatTime(item.created_at)}</AppText>
                <AppText>📋 Section: {item.section}</AppText>
                <AppText>🛠 Activities: {item.activities}</AppText>
                <AppText>🐔 Production: {item.productionCount}</AppText>
                <AppText>⚠️ Casualties: {item.casualties}</AppText>
                {item.observations ? <AppText>📝 Observations: {item.observations}</AppText> : null}
                {item.weather ? <AppText>🌦 Weather: {item.weather}</AppText> : null}
                <AppText>👤 Prepared By: {item.preparedBy}</AppText>
              </View>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            style={{ flex: 1 }}
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
                <Controller name='section' control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="Select section (Crop, Livestock, Fisheries, Mixed)"
                      value={value}
                      onChangeText={onChange}
                    />
                  )} />{errors.section && <AppText style={{ color: "red" }}>{errors.section.message}</AppText>}
              </View>


              {/* Activities */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Activities Performed</AppText>
                <Controller name='activities' control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      multiline
                      placeholder="e.g. Collected eggs, cleaned cages..."
                      value={value}
                      onChangeText={onChange}
                    />)} />{errors.activities && <AppText style={{ color: "red" }}>{errors.activities.message}</AppText>}
              </View>



              {/* Production Count */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Production Count</AppText>
                <Controller name='productionCount' control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 250 eggs"
                      value={value}
                      onChangeText={onChange}
                    />)} />{errors.productionCount && <AppText style={{ color: "red" }}>{errors.productionCount.message}</AppText>}
              </View>

              {/* Casualties */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Casualties</AppText>
                <Controller name='casualties' control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. 1 chick died"
                      value={value}
                      onChangeText={onChange}
                    />
                  )} />{errors.casualties && <AppText style={{ color: "red" }}>{errors.casualties.message}</AppText>}
              </View>

              {/* Observations */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Observations</AppText>
                <Controller name='observations' control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      multiline
                      placeholder="Any notable remarks"
                      value={value}
                      onChangeText={onChange}
                    />
                  )} />{errors.observations && <AppText style={{ color: "red" }}>{errors.observations.message}</AppText>}
              </View>

              {/* Weather */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Weather</AppText>
                <Controller name='weather' control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Sunny, Rainy..."
                      value={value}
                      onChangeText={onChange}
                    />
                  )} />{errors.weather && <AppText style={{ color: "red" }}>{errors.weather.message}</AppText>}
              </View>
              {/* Weather */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Challenges</AppText>
                <Controller name='challenges' control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Sunny, Rainy..."
                      value={value}
                      onChangeText={onChange}
                    />
                  )} />{errors.challenges && <AppText style={{ color: "red" }}>{errors.challenges.message}</AppText>}
              </View>
              {/* Weather */}
              <View style={styles.formGroup}>
                <AppText style={styles.label}>Plans Next Period</AppText>
                <Controller name='plans' control={control}
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      style={styles.input}
                      placeholder="e.g. Sunny, Rainy..."
                      value={value}
                      onChangeText={onChange}
                    />
                  )} />{errors.plans && <AppText style={{ color: "red" }}>{errors.plans.message}</AppText>}
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
                  onPress={handleSubmit(onSubmit)}
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
        <View style={{ display: stateOfReport === 2 ? "flex" : "none", flex: 1 }}>
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
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f2f2f2',
  },
  topBarNavItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomColor: 'black',
  },
  activeTab: {
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15
  }
});
