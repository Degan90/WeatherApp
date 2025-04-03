import { createAsyncThunk } from "@reduxjs/toolkit";

// redux/weatherService.ts
const API_KEY = "9cba8c1120e34cf791f05306252503";

export const addCityWithWeather = createAsyncThunk(
  "city/addCityWithWeather",
  async (city: string, { rejectWithValue }) => {
    return fetch(
      `https://api.weatherapi.com/v1/current.json?key=9cba8c1120e34cf791f05306252503&q=${city}&aqi=yes`
    )
      .then((data) => data.json())
      .then((json) => {
        return {
          name: json?.location?.name,
          country: json?.location?.country,
          temp: json?.current?.temp_f,
          condition: json?.current?.condition?.text,
          isFavorite: false,
        };
      })
      .catch((erorr) => {
        console.error("erorr in monthly gas usage", erorr);
      });
  }
);

export const updateCityWeather = createAsyncThunk(
  "city/updateCityWeather",
  async (cityName: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=9cba8c1120e34cf791f05306252503&q=${cityName}&aqi=yes`
      );
      const json = await response.json();
      return {
        name: json?.location?.name,
        temp: json?.current?.temp_f,
        condition: json?.current?.condition?.text,
      };
    } catch (error) {
      return rejectWithValue("Error fetching weather data");
    }
  }
);
