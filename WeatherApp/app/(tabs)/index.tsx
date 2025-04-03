import {
  StyleSheet,
  View,
  Dimensions,
  TextInput,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { AppDispatch, RootState } from "@/redux/store";
import { addCityWithWeather } from "@/redux/weatherService";
import { toggleFavorite } from "@/redux/citySlice";

const { width, height } = Dimensions.get("screen");
export default function HomeScreen() {
  const [city, setCity] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const { cities, loading, error } = useSelector(
    (state: RootState) => state.city
  );

  const handleAddCity = () => {
    if (city.trim() !== "") {
      dispatch(addCityWithWeather(city));
      setCity(""); // Clear input after adding
    }
  };

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
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Weather</ThemedText>
      </ThemedView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <TextInput
          style={styles.input}
          placeholder="Search for a city..."
          placeholderTextColor="#aaa"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity onPress={handleAddCity}>
          <ThemedText>+ Add</ThemedText>
        </TouchableOpacity>
      </View>
      <View>
        <FlatList
          data={cities}
          renderItem={renderCityItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.cityList}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: width * 0.05,
  },
  titleContainer: {
    marginBottom: 10,
    backgroundColor: "transparent",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    width: width * 0.7,
  },
  cityList: {
    marginTop: 20,
    paddingBottom: 20,
  },
  cityCard: {
    backgroundColor: "#ddd",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
