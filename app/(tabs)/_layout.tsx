import React from 'react';
import { Platform, StyleSheet } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomePage from './home';
import Inventory from './inventory';
import Reports from './reports';
import Workers from './workers';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tab.Screen
        name="home"
        component={HomePage}
        options={{
          title: 'Home',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,

        }}
      />
      <Tab.Screen
        name="inventory"
        component={Inventory}
        options={{
          title: 'Inventory',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="cube" color={color} />,
        }}
      />
      <Tab.Screen
        name="reports"
        component={Reports}
        options={{
          title: 'Reports',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="bar-chart" color={color} />,
        }}
      />
      <Tab.Screen
        name="workers"
        component={Workers}
        options={{
          title: 'Workers',
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person" color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabLabel: {
    fontFamily: 'SoraRegular',
    fontSize: 12,
  },
});