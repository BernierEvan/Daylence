import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Wind, Droplets, Thermometer, Gauge, Sun, Eye } from "lucide-react";
import { useWeatherStore } from "../store/weatherStore";
import { searchLocations, weatherIcon, weatherLabel, windDirectionLabel } from "../services/weatherService";
import type { GeoLocation } from "../types";
import PageHeader from "../../../components/layout/PageHeader";
import "../css/WeatherPage.css";

const DAY_NAMES = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const FULL_DAYS = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

function formatHour(iso: string) {
  return new Date(iso).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function dayLabel(dateStr: string, idx: number) {
  if (idx === 0) return "Aujourd'hui";
  if (idx === 1) return "Demain";
  const d = new Date(dateStr + "T00:00:00");
  return FULL_DAYS[d.getDay()];
}

export default function WeatherPage() {
  const { location, data, loading, error, setLocation, loadWeather, loadFromGeolocation } = useWeatherStore();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Load weather on mount if location exists but no data
  useEffect(() => {
    if (location && !data && !loading) loadWeather();
  }, []);

  // Auto-geolocate if no saved location
  useEffect(() => {
    if (!location && !loading) loadFromGeolocation();
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(searchTimeout.current);
    if (query.length < 2) { setResults([]); return; }
    searchTimeout.current = setTimeout(async () => {
      const r = await searchLocations(query);
      setResults(r);
      setShowResults(true);
    }, 350);
    return () => clearTimeout(searchTimeout.current);
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const pickLocation = (loc: GeoLocation) => {
    setLocation(loc);
    setQuery("");
    setResults([]);
    setShowResults(false);
  };

  // Temp bar positions for daily forecast
  const allTemps = data ? data.daily.flatMap(d => [d.tempMin, d.tempMax]) : [];
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const tempRange = globalMax - globalMin || 1;

  return (
    <div className="wp">
      <PageHeader />

      <main className="wp__body">
        {/* ── Location search ── */}
        <div className="wp__location-bar">
          <div className="wp__search-wrapper" ref={wrapperRef}>
            <Search size={16} className="wp__search-icon" />
            <input
              className="wp__search"
              type="text"
              placeholder="Rechercher une ville…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
            />
            {showResults && results.length > 0 && (
              <div className="wp__results">
                {results.map(r => (
                  <button key={r.id} className="wp__result-item" onClick={() => pickLocation(r)}>
                    <span className="wp__result-name">{r.name}</span>
                    <span className="wp__result-sub">
                      {[r.admin1, r.country].filter(Boolean).join(", ")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="wp__geo-btn" onClick={loadFromGeolocation}>
            <MapPin size={15} /> Ma position
          </button>
        </div>

        {/* ── Loading ── */}
        {loading && (
          <div className="wp__loading">Chargement de la météo…</div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <div className="wp__error">{error}</div>
        )}

        {/* ── No location ── */}
        {!location && !loading && !error && (
          <div className="wp__empty">
            <div className="wp__empty-icon">🌍</div>
            Choisissez une ville ou activez la géolocalisation
          </div>
        )}

        {/* ── Weather data ── */}
        {data && !loading && (
          <>
            {/* Current */}
            <section className="wp__current">
              <div className="wp__current-icon">
                {weatherIcon(data.current.weatherCode, data.current.isDay)}
              </div>
              <div className="wp__current-info">
                <div className="wp__current-temp">{Math.round(data.current.temperature)}°</div>
                <div className="wp__current-label">{weatherLabel(data.current.weatherCode)}</div>
                <div className="wp__current-feels">
                  Ressenti {Math.round(data.current.apparentTemperature)}°
                </div>
                {location && (
                  <div className="wp__current-location">
                    📍 {location.name}{location.country ? `, ${location.country}` : ""}
                  </div>
                )}
              </div>
            </section>

            {/* Detail cards */}
            <section className="wp__details">
              <div className="wp__detail-card" title="Vitesse et direction du vent">
                <span className="wp__detail-label"><Wind size={13} /> Vent</span>
                <span className="wp__detail-value">{Math.round(data.current.windSpeed)} km/h</span>
                <span className="wp__detail-extra">
                  {windDirectionLabel(data.current.windDirection)} · Rafales {Math.round(data.current.windGusts)} km/h
                </span>
              </div>
              <div className="wp__detail-card" title="Taux d'humidité relative dans l'air">
                <span className="wp__detail-label"><Droplets size={13} /> Humidité</span>
                <span className="wp__detail-value">{data.current.humidity}%</span>
              </div>
              <div className="wp__detail-card" title="Température ressentie en tenant compte du vent et de l'humidité">
                <span className="wp__detail-label"><Thermometer size={13} /> Ressenti</span>
                <span className="wp__detail-value">{Math.round(data.current.apparentTemperature)}°</span>
              </div>
              <div className="wp__detail-card" title="Pression atmosphérique au niveau de la mer">
                <span className="wp__detail-label"><Gauge size={13} /> Pression</span>
                <span className="wp__detail-value">{Math.round(data.current.pressure)} hPa</span>
              </div>
              <div className="wp__detail-card" title="Indice UV — intensité du rayonnement solaire">
                <span className="wp__detail-label"><Sun size={13} /> UV</span>
                <span className="wp__detail-value">{data.current.uvIndex}</span>
                <span className="wp__detail-extra">
                  {data.current.uvIndex <= 2 ? "Faible" : data.current.uvIndex <= 5 ? "Modéré" : data.current.uvIndex <= 7 ? "Élevé" : "Très élevé"}
                </span>
              </div>
              <div className="wp__detail-card" title="Heure du lever et du coucher du soleil">
                <span className="wp__detail-label"><Eye size={13} /> Lever / coucher</span>
                <span className="wp__detail-value" style={{ fontSize: "1rem" }}>
                  {data.daily[0] ? `${formatHour(data.daily[0].sunrise)} — ${formatHour(data.daily[0].sunset)}` : "—"}
                </span>
              </div>
            </section>

            {/* Hourly */}
            <section>
              <h2 className="wp__section-title">Prévisions par heure</h2>
              <div className="wp__hourly-scroll" style={{ marginTop: 10 }}>
                {data.hourly.map((h, i) => {
                  const isNow = i === 0;
                  return (
                    <div className={`wp__hour-card${isNow ? " wp__hour-card--now" : ""}`} key={i}>
                      <span className="wp__hour-time">{isNow ? "Maintenant" : formatHour(h.time)}</span>
                      <span className="wp__hour-icon" title={weatherLabel(h.weatherCode)}>{weatherIcon(h.weatherCode)}</span>
                      <span className="wp__hour-temp" title="Température">{Math.round(h.temperature)}°</span>
                      <span className="wp__hour-humidity" title="Humidité relative">💧 {h.humidity}%</span>
                      {h.precipitationProbability > 0 && (
                        <span className="wp__hour-rain" title="Probabilité de précipitations">🌧️ {h.precipitationProbability}%</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Daily */}
            <section>
              <h2 className="wp__section-title">Prévisions 7 jours</h2>
              <div className="wp__daily-list" style={{ marginTop: 10 }}>
                {data.daily.map((d, i) => {
                  const left = ((d.tempMin - globalMin) / tempRange) * 100;
                  const width = ((d.tempMax - d.tempMin) / tempRange) * 100;
                  return (
                    <div className="wp__day-row" key={i}>
                      <span className="wp__day-name">{dayLabel(d.date, i)}</span>
                      <span className="wp__day-icon" title={weatherLabel(d.weatherCode)}>{weatherIcon(d.weatherCode)}</span>
                      <span className="wp__day-label">{weatherLabel(d.weatherCode)}</span>
                      <div className="wp__day-bar">
                        <div
                          className="wp__day-bar-fill"
                          style={{ left: `${left}%`, width: `${Math.max(width, 8)}%` }}
                        />
                      </div>
                      <span className="wp__day-temps" title="Températures min / max">
                        <span className="wp__day-min">{Math.round(d.tempMin)}°</span>
                        <span className="wp__day-max">{Math.round(d.tempMax)}°</span>
                      </span>
                      <span className="wp__day-extra">
                        <span title="Probabilité de précipitations">🌧️ {d.precipitationProbability}%</span>
                        <span title="Vent max">💨 {Math.round(d.windSpeedMax)} km/h</span>
                        {d.precipitationSum > 0 && <span title="Précipitations cumulées">💧 {d.precipitationSum} mm</span>}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
