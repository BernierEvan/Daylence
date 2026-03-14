import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GeoLocation, WeatherData } from "../types";
import { fetchWeather } from "../services/weatherService";

interface WeatherState {
  location: GeoLocation | null;
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastFetch: number;

  setLocation: (loc: GeoLocation) => void;
  loadWeather: () => Promise<void>;
  loadFromGeolocation: () => Promise<void>;
}

export const useWeatherStore = create<WeatherState>()(
  persist(
    (set, get) => ({
      location: null,
      data: null,
      loading: false,
      error: null,
      lastFetch: 0,

      setLocation: (loc) => {
        set({ location: loc, data: null, error: null });
        get().loadWeather();
      },

      loadWeather: async () => {
        const { location } = get();
        if (!location) return;

        set({ loading: true, error: null });
        try {
          const data = await fetchWeather(location.latitude, location.longitude);
          set({ data, loading: false, lastFetch: Date.now() });
        } catch {
          set({ error: "Impossible de charger la météo", loading: false });
        }
      },

      loadFromGeolocation: async () => {
        set({ loading: true, error: null });
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 10000,
              enableHighAccuracy: false,
            })
          );
          const loc: GeoLocation = {
            id: 0,
            name: "Ma position",
            country: "",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          };
          set({ location: loc });
          const data = await fetchWeather(loc.latitude, loc.longitude);
          set({ data, loading: false, lastFetch: Date.now() });
        } catch {
          set({ error: "Géolocalisation refusée ou indisponible", loading: false });
        }
      },
    }),
    {
      name: "daylence-weather",
      partialize: (s) => ({ location: s.location }),
    }
  )
);
