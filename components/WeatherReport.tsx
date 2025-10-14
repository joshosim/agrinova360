import { WeatherAPIResponse } from '@/app/types/weather';
import { useWeather } from '@/context/useWeather';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';
import { Loading } from './Loading';
import { WeatherStat } from './WeatherStat';

import rawCountriesData from '../data/countries.json';

const WeatherComponent = () => {
  const countriesData: Record<string, string[]> = rawCountriesData;
  const COUNTRY_OPTIONS = Object.keys(countriesData).sort();
  const [open, setOpen] = React.useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Nigeria')
  const [selectedCity, setSelectedCity] = useState('Aba')
  const [expandedCountry, setExpandedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCountryClick = (country: string) => {
    setExpandedCountry(expandedCountry === country ? null : country)
    setSelectedCountry(country)
  }

  const handleCitySelect = (city: string) => {
    setSelectedCity(city)
    setOpen(false)
    setExpandedCountry(null)
    setSearchQuery('')
  }

  const { data, isLoading, isError, error } = useWeather(selectedCity);

  const filteredCountry = COUNTRY_OPTIONS.filter(country => country.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return <Loading style={{ marginTop: "50%" }} />;
  }

  if (isError || !data) {
    return <Text style={{ textAlign: 'center', marginTop: '50%' }}>Unable to load weather data.</Text>;
  }
  console.log("error", error)

  const weather: WeatherAPIResponse = data;
  console.log('weather', weather.location.name)
  const { location, current } = weather;

  const todayDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  }).format(todayDate);

  return (
    <ScrollView contentContainerStyle={{ alignItems: 'center', marginTop: 20 }}>
      <AppText style={{ fontSize: 18, fontFamily: 'SoraBold', marginBottom: 4 }}>
        About Today
      </AppText>

      <TouchableOpacity style={styles.filterButton} onPress={() => setOpen(true)}>
        <Ionicons name='location-outline' size={20} color='black' />
        <AppText>{selectedCity}, {selectedCountry}</AppText>
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
            <Ionicons color='black' name="close" size={30} style={{ alignSelf: 'flex-end', marginVertical: 15 }} />
            <AppText style={{ textAlign: 'center', fontFamily: 'SoraBold', fontSize: 16, textTransform: 'uppercase' }}>
              Select City of Your Choice
            </AppText>
            <TextInput
              placeholder='Search City'
              style={{ borderColor: 'black', borderBottomWidth: 2, marginBottom: 20, padding: 8 }}
              onChangeText={setSearchQuery}
              value={searchQuery}
            />
            <ScrollView>
              {filteredCountry.map((country, i) => {

                const cities = Array.isArray(countriesData[country])
                  ? countriesData[country].sort()
                  : [];
                const isExpanded = expandedCountry === country;

                return (
                  <View key={i}>
                    <Pressable
                      style={[
                        styles.countryButton,
                        isExpanded && styles.countryButtonActive
                      ]}
                      onPress={() => handleCountryClick(country)}
                    >
                      <Text>{country}</Text>
                      <MaterialIcons
                        name={isExpanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
                        size={24}
                        color='black'
                      />
                    </Pressable>
                    {isExpanded && cities.map((city, cityIndex) => (
                      <Pressable
                        key={cityIndex}
                        style={styles.cityButton}
                        onPress={() => handleCitySelect(city)}
                      >
                        <Text style={styles.cityText}>{city}</Text>
                      </Pressable>
                    ))}
                  </View>
                )
              })}
            </ScrollView>
          </View>
        </Pressable>

      </Modal >
    </ScrollView >
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
    paddingHorizontal: 20,
    height: '100%'
  },
  optionItem: {
    paddingVertical: 15,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  countryButton: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryButtonActive: {
    borderColor: '#000',
    backgroundColor: '#f5f5f5',
  },
  cityButton: {
    padding: 12,
    paddingLeft: 30,
    backgroundColor: '#fafafa',
    borderLeftWidth: 3,
    borderLeftColor: '#e0e0e0',
  },
  cityText: {
    fontSize: 14,
    color: '#333',
  },
});
