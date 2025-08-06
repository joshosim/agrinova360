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

export interface FarmReportData {
  section: string;
  activities: string;
  productionCount: string;
  inputsUsed: string;
  salesRevenue: string;
  expensesIncurred: string;
  casualties: string;
  observations: string;
  weather: string;
}
