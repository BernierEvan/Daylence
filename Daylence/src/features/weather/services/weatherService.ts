import type { GeoLocation, WeatherData, HourlyForecast, DailyForecast } from "../types";

const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_BASE = "https://api.open-meteo.com/v1/forecast";

/* ── Geocoding ── */
export async function searchLocations(query: string): Promise<GeoLocation[]> {
  if (!query.trim()) return [];
  const url = new URL(GEO_BASE);
  url.searchParams.set("name", query.trim());
  url.searchParams.set("count", "6");
  url.searchParams.set("language", "fr");
  url.searchParams.set("format", "json");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Geocoding failed");
  const data = await res.json();
  if (!data.results) return [];

  return data.results.map((r: any) => ({
    id: r.id,
    name: r.name,
    country: r.country ?? "",
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
  }));
}

/* ── Weather codes → label + icon ── */
const WMO: Record<number, { label: string; icon: string; night?: string }> = {
  0:  { label: "Ciel dégagé",       icon: "☀️", night: "🌙" },
  1:  { label: "Presque dégagé",    icon: "🌤️", night: "🌙" },
  2:  { label: "Partiellement nuageux", icon: "⛅", night: "☁️" },
  3:  { label: "Couvert",           icon: "☁️" },
  45: { label: "Brouillard",        icon: "🌫️" },
  48: { label: "Brouillard givrant",icon: "🌫️" },
  51: { label: "Bruine légère",     icon: "🌦️" },
  53: { label: "Bruine modérée",    icon: "🌦️" },
  55: { label: "Bruine dense",      icon: "🌧️" },
  56: { label: "Bruine verglaçante",icon: "🌧️" },
  57: { label: "Bruine verglaçante dense", icon: "🌧️" },
  61: { label: "Pluie légère",      icon: "🌧️" },
  63: { label: "Pluie modérée",     icon: "🌧️" },
  65: { label: "Pluie forte",       icon: "🌧️" },
  66: { label: "Pluie verglaçante", icon: "🌧️" },
  67: { label: "Pluie verglaçante forte", icon: "🌧️" },
  71: { label: "Neige légère",      icon: "🌨️" },
  73: { label: "Neige modérée",     icon: "🌨️" },
  75: { label: "Neige forte",       icon: "❄️" },
  77: { label: "Grains de neige",   icon: "❄️" },
  80: { label: "Averses légères",   icon: "🌦️" },
  81: { label: "Averses modérées",  icon: "🌧️" },
  82: { label: "Averses violentes", icon: "🌧️" },
  85: { label: "Averses de neige",  icon: "🌨️" },
  86: { label: "Fortes averses de neige", icon: "❄️" },
  95: { label: "Orage",             icon: "⛈️" },
  96: { label: "Orage grêle légère",icon: "⛈️" },
  99: { label: "Orage grêle forte", icon: "⛈️" },
};

export function weatherLabel(code: number): string {
  return WMO[code]?.label ?? "Inconnu";
}

export function weatherIcon(code: number, isDay = true): string {
  const entry = WMO[code];
  if (!entry) return "❓";
  return !isDay && entry.night ? entry.night : entry.icon;
}

/* ── Fetch weather data ── */
export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = new URL(WEATHER_BASE);
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m,pressure_msl,uv_index,is_day"
  );
  url.searchParams.set(
    "hourly",
    "temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation_probability"
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max"
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error("Weather fetch failed");
  const d = await res.json();

  const current = {
    temperature: d.current.temperature_2m,
    apparentTemperature: d.current.apparent_temperature,
    humidity: d.current.relative_humidity_2m,
    weatherCode: d.current.weather_code,
    windSpeed: d.current.wind_speed_10m,
    windDirection: d.current.wind_direction_10m,
    windGusts: d.current.wind_gusts_10m,
    pressure: d.current.pressure_msl,
    uvIndex: d.current.uv_index,
    isDay: !!d.current.is_day,
  };

  const now = new Date();
  const hourly: HourlyForecast[] = d.hourly.time
    .map((t: string, i: number) => ({
      time: t,
      temperature: d.hourly.temperature_2m[i],
      weatherCode: d.hourly.weather_code[i],
      windSpeed: d.hourly.wind_speed_10m[i],
      humidity: d.hourly.relative_humidity_2m[i],
      precipitationProbability: d.hourly.precipitation_probability[i],
    }))
    .filter((h: HourlyForecast) => new Date(h.time) >= now)
    .slice(0, 24);

  const daily: DailyForecast[] = d.daily.time.map((t: string, i: number) => ({
    date: t,
    weatherCode: d.daily.weather_code[i],
    tempMax: d.daily.temperature_2m_max[i],
    tempMin: d.daily.temperature_2m_min[i],
    sunrise: d.daily.sunrise[i],
    sunset: d.daily.sunset[i],
    precipitationSum: d.daily.precipitation_sum[i],
    precipitationProbability: d.daily.precipitation_probability_max[i],
    windSpeedMax: d.daily.wind_speed_10m_max[i],
    uvIndexMax: d.daily.uv_index_max[i],
  }));

  return { current, hourly, daily, timezone: d.timezone };
}

/* ── Wind direction label ── */
export function windDirectionLabel(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return dirs[Math.round(deg / 45) % 8];
}
