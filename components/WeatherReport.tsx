import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, TouchableOpacity, View } from 'react-native';
import { AppText } from './AppText';

export interface WeatherCondition {
  code: number;
  icon: string;
  text: string;
}

export interface CurrentWeather {
  cloud: number;
  condition: WeatherCondition;
  dewpoint_c: number;
  dewpoint_f: number;
  feelslike_c: number;
  feelslike_f: number;
  gust_kph: number;
  gust_mph: number;
  heatindex_c: number;
  heatindex_f: number;
  humidity: number;
  is_day: number;
  last_updated: string;
  last_updated_epoch: number;
  precip_in: number;
  precip_mm: number;
  pressure_in: number;
  pressure_mb: number;
  temp_c: number;
  temp_f: number;
  uv: number;
  vis_km: number;
  vis_miles: number;
  wind_degree: number;
  wind_dir: string;
  wind_kph: number;
  wind_mph: number;
  windchill_c: number;
  windchill_f: number;
}

export interface LocationInfo {
  country: string;
  lat: number;
  lon: number;
  localtime: string;
  localtime_epoch: number;
  name: string;
  region: string;
  tz_id: string;
}

export interface WeatherAPIResponse {
  current: CurrentWeather;
  location: LocationInfo;
}


const WeatherComponent = () => {
  const [weather, setWeather] = useState<WeatherAPIResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWeather = async () => {
    try {
      const response = await axios.get(
        `http://api.weatherapi.com/v1/current.json?key=380bda3e94474ba2bad134414252707&q=Jos`);

      setWeather(response.data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  if (!weather) {
    return <Text>Unable to load weather data.</Text>;
  }
  console.log(weather)

  const todayDate = new Date()

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
      <TouchableOpacity style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Ionicons name='location-outline' size={20} color='black' />
        <AppText>{weather.location.name}, {weather.location.country}</AppText>
        <MaterialIcons name='arrow-drop-down' size={20} color='black' />
      </TouchableOpacity>

      <Image
        source={{ uri: `https:${weather.current.condition.icon}` }}
        style={{ width: 120, height: 120, marginVertical: 10 }}
      />

      <AppText> {formattedDate}</AppText>

      <AppText
        style={{ textAlign: 'center', fontSize: 30 }}>
        {weather.current.temp_c}°C</AppText>

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center', gap: 20
      }}>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: `https:${weather.current.condition.icon}` }}
            style={{ width: 64, height: 64, marginVertical: 10 }}
          />
          <AppText>{weather.current.humidity}%</AppText>
          <AppText>{weather.current.condition.text}</AppText>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: `https:${weather.current.condition.icon}` }}
            style={{ width: 64, height: 64, marginVertical: 10 }}
          />
          <AppText>{weather.current.wind_kph} km/h</AppText>
          <AppText>Wind</AppText>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <Image
            source={{ uri: `https:${weather.current.condition.icon}` }}
            style={{ width: 64, height: 64, marginVertical: 10 }}
          />
          <AppText>{weather.current.humidity}%</AppText>
          <AppText>Humidity</AppText>
        </View>
      </View>
    </View>
  );
};

export default WeatherComponent;
