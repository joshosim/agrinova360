import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Text, View } from 'react-native';

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

  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold' }}>
        Weather in {weather.location.name}, {weather.location.country}
      </Text>
      <Image
        source={{ uri: `https:${weather.current.condition.icon}` }}
        style={{ width: 64, height: 64, marginVertical: 10 }}
      />
      <Text>Temperature: {weather.current.temp_c}°C</Text>
      <Text>Condition: {weather.current.condition.text}</Text>
      <Text>Humidity: {weather.current.humidity}%</Text>
      <Text>Wind: {weather.current.wind_kph} km/h ({weather.current.wind_dir})</Text>
      <Text>Last Updated: {weather.current.last_updated}</Text>
    </View>
  );
};

export default WeatherComponent;
