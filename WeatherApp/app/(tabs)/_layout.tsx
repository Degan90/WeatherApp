import { Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform } from "react-native";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { updateCityWeather } from "@/redux/weatherService";
import { AppDispatch, RootState } from "@/redux/store";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [tab, setTab] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { cities } = useSelector((state: RootState) => state.city);
  useEffect(() => {
    cities.forEach((city) => {
      dispatch(updateCityWeather(city.name));
    });
  }, [tab]);
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Favorite"
        options={{
          title: "Favorites",
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons size={28} name="heart" color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            setTab(!tab);
          },
        }}
      />
    </Tabs>
  );
}
