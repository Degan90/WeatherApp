// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import cityReducer, { loadCities, setCities } from "./citySlice";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const store = configureStore({
  reducer: {
    city: cityReducer,
  },
});
(async () => {
  const storedCities = await AsyncStorage.getItem("favoriteCities");
  if (storedCities) {
    // Dispatch the action to set cities in the Redux store
    store.dispatch(setCities(JSON.parse(storedCities)));
  }
})();
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
