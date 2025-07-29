import { WeatherAPIResponse } from '@/app/types/weather';
import { useWeather } from '@/context/useWeather';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { Loading } from './Loading';
import { WeatherStat } from './WeatherStat';

const CITY_OPTIONS = [
  { key: 'lagos', label: 'Lagos' },
  { key: 'abuja', label: 'Abuja' },
  { key: 'kano', label: 'Kano' },
  { key: 'enugu', label: 'Enugu' },
  { key: 'ibadan', label: 'Ibadan' },
  { key: 'maiduguri', label: 'Maiduguri' },
  { key: 'jos', label: 'Jos' },
  { key: 'chicago', label: 'Chicago' },
  { key: 'london', label: 'London' },
  { key: 'bayelsa', label: 'Bayelsa' },
  { key: 'enuu', label: 'Enugu' },
  { key: 'ibadn', label: 'Ibadan' },
  { key: 'maiduuri', label: 'Maiduguri' },
  { key: 'jo', label: 'Jos' },
  { key: 'chicao', label: 'Chicago' },
  { key: 'londn', label: 'London' },
  { key: 'bayesa', label: 'Bayelsa' },
];

const WeatherComponent = () => {
  const [selectedFilter, setSelectedFilter] = React.useState(CITY_OPTIONS[0]);
  const { data, isLoading, isError, error } = useWeather(selectedFilter.key);
  const [open, setOpen] = React.useState(false);
  const [showData, setShowData] = useState(false)

  const handleSelectFilter = (filter: any) => {
    setSelectedFilter(filter);
    setOpen(false);
  };

  if (isLoading) {
    return <Loading style={{ marginTop: "50%" }} />;
  }

  if (isError || !data) {
    return <Text style={{ textAlign: 'center', marginTop: '50%' }}>Unable to load weather data.</Text>;
  }
  console.log("error", error)

  const weather: WeatherAPIResponse = data;
  const { location, current } = weather;

  const todayDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  }).format(todayDate);

  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <AppText style={{ fontSize: 18, fontFamily: 'SoraBold', marginBottom: 4 }}>
        About Today
      </AppText>

      <TouchableOpacity style={styles.filterButton} onPress={() => setOpen(true)}>
        <Ionicons name='location-outline' size={20} color='black' />
        <AppText>{selectedFilter.label}, {location?.country}</AppText>
        <MaterialIcons name='arrow-drop-down' size={20} color='black' />
      </TouchableOpacity>

      <Image
        source={{ uri: `https:${current?.condition?.icon}` }}
        style={{ width: 120, height: 120, marginVertical: 10 }}
      />

      <AppText>{formattedDate}</AppText>

      <AppText style={{ textAlign: 'center', fontSize: 30 }}>
        {current?.temp_c}°C
      </AppText>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 20
      }}>
        <WeatherStat icon={current.condition.icon} value={`${current.humidity}%`} label={current.condition.text} />
        <WeatherStat icon={current.condition.icon} value={`${current.wind_kph} km/h`} label="Wind" />
        <WeatherStat icon={current.condition.icon} value={`${current.humidity}%`} label="Humidity" />
      </View>

      <Modal
        animationType="fade"
        transparent={true}
        visible={open}
        onRequestClose={() => setOpen(false)}

      >

        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={styles.bottomSheet}>
            <AppText style={{ textAlign: 'center', fontFamily: 'SoraBold', fontSize: 16, textTransform: 'uppercase' }}>
              Cities
            </AppText>
            <ScrollView>
              {CITY_OPTIONS.map((filter) => (
                <TouchableOpacity
                  key={filter.key}
                  onPress={() => handleSelectFilter(filter)}
                  style={styles.optionItem}
                >
                  <AppText style={{ fontSize: 16 }}>{filter.label}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>

      </Modal>
    </View>
  );
};

export default WeatherComponent;

const styles = StyleSheet.create({
  filterButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 3,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ece7e4',
    padding: 5,
    marginBottom: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    paddingVertical: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    height: '50%'
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
});
