import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const baseURL = "http://api.weatherapi.com/v1";
const apiKEY = "380bda3e94474ba2bad134414252707";
// const baseURL = process.env.BASEURL;
// const apiKEY = process.env.API_KEY;

const getWeatherReport = async (location: string) => {
  const response = await axios.get(
    `${baseURL}/current.json?key=${apiKEY}&q=${location}`
  );
  return response.data;
};

export const useWeather = (location: string) => {
  return useQuery({
    queryKey: ['GET_WEATHER_REPORT', location],
    queryFn: () => getWeatherReport(location),
  });
};
