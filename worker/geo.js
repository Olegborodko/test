// Free geocoding without an API key (Open-Meteo). Only the first match is used:
// the form asks for a city, and ambiguity is resolved by the user retyping.
const ENDPOINT = 'https://geocoding-api.open-meteo.com/v1/search';

export async function findPlace(name) {
  const url = new URL(ENDPOINT);
  url.searchParams.set('name', name);
  url.searchParams.set('count', '1');
  url.searchParams.set('language', 'ru');
  url.searchParams.set('format', 'json');

  let response;
  try {
    response = await fetch(url, { headers: { accept: 'application/json' } });
  } catch {
    return { error: 'geocoding_unavailable' };
  }
  if (!response.ok) return { error: 'geocoding_unavailable' };

  const data = await response.json();
  const place = data.results && data.results[0];
  if (!place) return { error: 'place_not_found' };

  return {
    name: place.name,
    country: place.country,
    latitude: place.latitude,
    longitude: place.longitude,
    timeZone: place.timezone,
  };
}
