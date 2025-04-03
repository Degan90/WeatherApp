// redux/citySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { addCityWithWeather, updateCityWeather } from "./weatherService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface City {
  name: string;
  country: string;
  temp: string;
  condition: string;
  isFavorite: boolean;
}

interface CityState {
  cities: City[];
  loading: boolean;
  error: string | null;
}

const saveToStorage = async (cities: City[]) => {
  try {
    await AsyncStorage.setItem("favoriteCities", JSON.stringify(cities));
  } catch (error) {
    console.error("Error saving cities:", error);
  }
};

const loadFromStorage = async (): Promise<City[]> => {
  try {
    const storedCities = await AsyncStorage.getItem("favoriteCities");
    return storedCities ? JSON.parse(storedCities) : [];
  } catch (error) {
    console.error("Error loading favorite cities:", error);
    return [];
  }
};

export const loadCities = createAsyncThunk("city/loadCities", async () => {
  return await loadFromStorage();
});

const citySlice = createSlice({
  name: "city",
  initialState: { cities: [], loading: false, error: null } as CityState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const city = state.cities.find((c) => c.name === action.payload);
      if (city) {
        city.isFavorite = !city.isFavorite;
        saveToStorage(state.cities);
      }
    },
    setCities: (state, action: PayloadAction<City[]>) => {
      state.cities = action.payload;
    },
    updateCityData: (state, action: PayloadAction<City>) => {
      const cityIndex = state.cities.findIndex(
        (city) => city.name === action.payload.name
      );
      if (cityIndex !== -1) {
        state.cities[cityIndex] = action.payload;
        saveToStorage(state.cities);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addCityWithWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addCityWithWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.cities.push(action?.payload);
        saveToStorage(state.cities);
      })
      .addCase(addCityWithWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCityWeather.fulfilled, (state, action) => {
        const updatedCity = action.payload;
        const cityIndex = state.cities.findIndex(
          (city) => city.name === updatedCity.name
        );
        if (cityIndex !== -1) {
          state.cities[cityIndex] = {
            ...state.cities[cityIndex],
            ...updatedCity,
          };
          saveToStorage(state.cities);
        }
      });
  },
});
export const { toggleFavorite, setCities } = citySlice.actions;
export default citySlice.reducer;
