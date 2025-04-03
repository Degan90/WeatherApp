import {
  StyleSheet,
  Image,
  Platform,
  FlatList,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from "react-native";

import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { toggleFavorite } from "@/redux/citySlice";
import { useEffect } from "react";
const { width, height } = Dimensions.get("screen");
export default function TabTwoScreen() {
  const { cities } = useSelector((state: RootState) => state.city);
  const favoriteCities = cities.filter((city) => city.isFavorite);
  const dispatch = useDispatch<AppDispatch>();

  const renderCityItem = ({
    item,
  }: {
    item: {
      name: string;
      country: string;
      temp: string;
      condition: string;
      isFavorite: boolean;
    };
  }) => {
    return (
      <ThemedView style={styles.cityCard}>
        <View>
          <View style={{ flexDirection: "row" }}>
            <ThemedText>{item?.name} </ThemedText>
            <ThemedText>{item?.country} </ThemedText>
          </View>
          <ThemedText>{item?.temp} °F</ThemedText>
          <ThemedText>{item?.condition}</ThemedText>
        </View>

        <TouchableOpacity onPress={() => dispatch(toggleFavorite(item.name))}>
          <MaterialCommunityIcons
            size={28}
            name={!item?.isFavorite ? "heart-outline" : "heart"}
            color={"red"}
          />
        </TouchableOpacity>
      </ThemedView>
    );
  };
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Favorites</ThemedText>
        </ThemedView>
        {favoriteCities?.length === 0 ? (
          <ThemedView style={styles.titleContainer}>
            <ThemedText>
              There are no favorite cities added. Please add some favorite
              cities from the home page.
            </ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={favoriteCities}
            renderItem={renderCityItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.cityList}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  cityCard: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cityList: {
    paddingBottom: 20,
    paddingTop: 20,
  },
  container: {
    paddingTop: 20,
    paddingHorizontal: width * 0.05,
  },
  titleContainer: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
});
