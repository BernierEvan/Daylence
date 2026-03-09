import type { SncfPlacesResponse, SncfJourneysResponse } from "../types";

// ──────────────────────────────────────────────
// SNCF API key — hardcoded for dev.
// TODO: move this to a backend proxy before production.
// ──────────────────────────────────────────────
const SNCF_API_KEY = "0397b08a-4b7c-46b8-85e4-1b89aa11683a";
const BASE_URL = "https://api.sncf.com/v1/coverage/sncf";

const headers = { Authorization: SNCF_API_KEY };

/**
 * Autocomplete stop areas from user input.
 */
export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<SncfPlacesResponse> {
  if (query.trim().length < 2) return { places: [] };

  const url = `${BASE_URL}/places?q=${encodeURIComponent(query)}&type[]=stop_area&count=6`;
  const res = await fetch(url, { headers, signal });
  if (!res.ok) throw new Error(`SNCF places error ${res.status}`);
  return res.json();
}

/**
 * Search journeys between two stop_areas.
 */
export async function searchJourneys(
  from: string,
  to: string,
  datetime: string,
  signal?: AbortSignal,
): Promise<SncfJourneysResponse> {
  const sncfDatetime = datetime.replace(/[-:]/g, "");
  const url =
    `${BASE_URL}/journeys?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}` +
    `&datetime=${sncfDatetime}&count=10`;
  const res = await fetch(url, { headers, signal });
  if (!res.ok) throw new Error(`SNCF journeys error ${res.status}`);
  return res.json();
}
