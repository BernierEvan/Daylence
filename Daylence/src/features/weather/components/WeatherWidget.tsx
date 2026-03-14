import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useWeatherStore } from "../store/weatherStore";
import { weatherIcon, weatherLabel } from "../services/weatherService";

export default function WeatherWidget() {
  const { location, data, loading, loadWeather, loadFromGeolocation } = useWeatherStore();

  useEffect(() => {
    if (location && !data) loadWeather();
    else if (!location) loadFromGeolocation();
  }, []);

  if (loading || !data) {
    return (
      <Link to="/weather" className="weather-widget weather-widget--loading">
        <span className="weather-widget__icon">🌤️</span>
        <span className="weather-widget__temp">--°</span>
      </Link>
    );
  }

  return (
    <Link to="/weather" className="weather-widget" title="Voir la météo complète">
      <span className="weather-widget__icon">
        {weatherIcon(data.current.weatherCode, data.current.isDay)}
      </span>
      <span className="weather-widget__temp">{Math.round(data.current.temperature)}°</span>
      <span className="weather-widget__label">
        {weatherLabel(data.current.weatherCode)}
      </span>
    </Link>
  );
}
