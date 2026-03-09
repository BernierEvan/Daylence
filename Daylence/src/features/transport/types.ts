// ── SNCF API Types ──

export interface SncfPlace {
  id: string;
  name: string;
  quality: number;
  stop_area: {
    id: string;
    name: string;
    label: string;
    coord: { lon: string; lat: string };
  };
  embedded_type: string;
}

export interface SncfPlacesResponse {
  places: SncfPlace[];
}

export interface SncfStopDateTime {
  departure_date_time: string;
  arrival_date_time: string;
  stop_point: {
    id: string;
    name: string;
    label: string;
    coord: { lon: string; lat: string };
  };
}

export interface SncfSection {
  id: string;
  type: string; // "public_transport" | "street_network" | "waiting" | "transfer" | "crow_fly"
  mode?: string; // "walking" etc.
  duration: number;
  departure_date_time: string;
  arrival_date_time: string;
  from: {
    id: string;
    name: string;
    embedded_type: string;
  };
  to: {
    id: string;
    name: string;
    embedded_type: string;
  };
  display_informations?: {
    commercial_mode: string; // "TGV INOUI", "TER", "Intercités"…
    network: string;
    direction: string;
    label: string;
    headsign: string;
    name: string;
    physical_mode: string;
    trip_short_name: string;
    company: string;
    code: string;
    color: string;
    text_color: string;
  };
  stop_date_times?: SncfStopDateTime[];
  co2_emission: { value: number; unit: string };
  geojson?: {
    type: string;
    coordinates: number[][];
  };
}

export interface SncfJourney {
  duration: number;
  nb_transfers: number;
  departure_date_time: string;
  arrival_date_time: string;
  requested_date_time: string;
  type: string;
  status: string;
  co2_emission: { value: number; unit: string };
  sections: SncfSection[];
  durations: {
    total: number;
    walking: number;
  };
}

export interface SncfJourneysResponse {
  journeys: SncfJourney[];
}
