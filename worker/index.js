import { computeChart } from './chart.js';
import { findPlace } from './geo.js';
import { buildReading } from './interpretation.js';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^\d{2}:\d{2}$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function readNumber(value) {
  if (value === undefined || value === null || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : NaN;
}

async function handleChart(request) {
  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const date = String(body.date || '').trim();
  const time = String(body.time || '').trim() || '12:00';
  if (!DATE_PATTERN.test(date)) return json({ error: 'invalid_date' }, 400);
  if (!TIME_PATTERN.test(time)) return json({ error: 'invalid_time' }, 400);

  let latitude = readNumber(body.latitude);
  let longitude = readNumber(body.longitude);
  let timeZone = body.timeZone ? String(body.timeZone) : null;
  let place = null;

  if (latitude === null || longitude === null || !timeZone) {
    const city = String(body.city || '').trim();
    if (!city) return json({ error: 'city_required' }, 400);
    const found = await findPlace(city);
    if (found.error) return json({ error: found.error }, 502);
    place = { name: found.name, country: found.country };
    latitude = found.latitude;
    longitude = found.longitude;
    timeZone = found.timeZone;
  }

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return json({ error: 'invalid_coordinates' }, 400);
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return json({ error: 'invalid_coordinates' }, 400);

  // The visitor picks one system before calculating; only that chart is returned.
  const system = body.system === 'vedic' ? 'vedic' : 'western';

  try {
    const chart = await computeChart({ date, time, timeZone, latitude, longitude });
    const { western, vedic, ...shared } = chart;
    const selected = system === 'vedic' ? vedic : western;
    const reading = buildReading({
      system,
      planets: selected.planets,
      ascendantSignIndex: Math.floor(selected.ascendant / 30),
      ascendantLongitude: selected.ascendant,
    });
    return json({ place, system, ...shared, [system]: selected, reading });
  } catch (error) {
    return json({ error: 'calculation_failed', message: String(error && error.message) }, 500);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/chart') return handleChart(request);
    return env.ASSETS.fetch(request);
  },
};
