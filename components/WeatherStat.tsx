import { Image, View } from "react-native";
import { AppText } from "./AppText";

export const WeatherStat = ({ icon, value, label }: { icon: string, value: string, label: string }) => (
  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
    <Image source={{ uri: `https:${icon}` }} style={{ width: 64, height: 64, marginVertical: 10 }} />
    <AppText>{value}</AppText>
    <AppText>{label}</AppText>
  </View>
);