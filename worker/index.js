import { computeChart } from './chart.js';
import { findPlace } from './geo.js';
import { buildForecast, buildReading, buildSolarReading, buildSynastry } from './interpretation.js';
import { isPrecisionReady, loadPrecisionFiles } from './swe.js';
import { computeSolarReturn } from './solar.js';
import { computeSynastry } from './synastry.js';
import { computeTransits, PERIOD_KEYS } from './transits.js';

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

/** Coordinates and time zone from either a city name or explicit numbers. */
async function resolveLocation(body) {
  let latitude = readNumber(body.latitude);
  let longitude = readNumber(body.longitude);
  let timeZone = body.timeZone ? String(body.timeZone) : null;
  let place = null;

  if (latitude === null || longitude === null || !timeZone) {
    const city = String(body.city || '').trim();
    if (!city) return { error: 'city_required', status: 400 };
    const found = await findPlace(city);
    if (found.error) return { error: found.error, status: 502 };
    place = { name: found.name, country: found.country };
    latitude = found.latitude;
    longitude = found.longitude;
    timeZone = found.timeZone;
  }

  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return { error: 'invalid_coordinates', status: 400 };
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return { error: 'invalid_coordinates', status: 400 };

  return { place, latitude, longitude, timeZone };
}

async function handleChart(request, env) {
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

  const location = await resolveLocation(body);
  if (location.error) return json({ error: location.error }, location.status);
  const { place, latitude, longitude, timeZone } = location;

  // The visitor picks one system before calculating; only that chart is returned.
  const system = body.system === 'vedic' ? 'vedic' : 'western';

  try {
    // Exact positions need the ephemeris files; the fetch is cached per isolate,
    // so only the first calculation of an isolate pays for it.
    await loadPrecisionFiles(env.ASSETS);
    const chart = await computeChart({
      date,
      time,
      timeZone,
      latitude,
      longitude,
      asteroids: body.asteroids === true && isPrecisionReady(),
    });
    const { western, vedic, ...shared } = chart;
    const selected = system === 'vedic' ? vedic : western;
    const reading = buildReading({
      system,
      planets: selected.planets,
      ascendantSignIndex: Math.floor(selected.ascendant / 30),
      ascendantLongitude: selected.ascendant,
      aspects: chart.aspects,
    });
    return json({ place, system, ...shared, [system]: selected, reading });
  } catch (error) {
    return json({ error: 'calculation_failed', message: String(error && error.message) }, 500);
  }
}

function parseBirth(input) {
  const date = String(input.date || '').trim();
  const time = String(input.time || '').trim() || '12:00';
  if (!DATE_PATTERN.test(date)) return { error: 'invalid_date' };
  if (!TIME_PATTERN.test(time)) return { error: 'invalid_time' };
  return { date, time };
}

async function handleSynastry(request, env) {
  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const firstBirth = parseBirth(body.first || {});
  if (firstBirth.error) return json({ error: firstBirth.error }, 400);
  const secondBirth = parseBirth(body.second || {});
  if (secondBirth.error) return json({ error: secondBirth.error }, 400);

  const firstLocation = await resolveLocation(body.first || {});
  if (firstLocation.error) return json({ error: firstLocation.error }, firstLocation.status);
  const secondLocation = await resolveLocation(body.second || {});
  if (secondLocation.error) return json({ error: secondLocation.error }, secondLocation.status);

  try {
    await loadPrecisionFiles(env.ASSETS);
    const result = await computeSynastry({
      first: { ...firstBirth, ...firstLocation },
      second: { ...secondBirth, ...secondLocation },
      asteroids: body.asteroids === true && isPrecisionReady(),
    });
    const reading = buildSynastry({
      aspects: result.aspects,
      truncated: result.truncated,
      score: result.score,
    });
    return json({
      first: { place: firstLocation.place },
      second: { place: secondLocation.place },
      aspects: result.aspects,
      reading,
    });
  } catch (error) {
    return json({ error: 'calculation_failed', message: String(error && error.message) }, 500);
  }
}

async function handleSolar(request, env) {
  if (request.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid_json' }, 400);
  }

  const birth = parseBirth(body);
  if (birth.error) return json({ error: birth.error }, 400);

  const location = await resolveLocation(body);
  if (location.error) return json({ error: location.error }, location.status);

  try {
    await loadPrecisionFiles(env.ASSETS);
    const result = await computeSolarReturn({
      birth: { ...birth, ...location },
      asteroids: body.asteroids === true && isPrecisionReady(),
    });
    const chart = result.chart;
    const reading = buildSolarReading({
      planets: chart.western.planets,
      ascendantSignIndex: Math.floor(chart.western.ascendant / 30),
    });

    return json({
      place: location.place,
      system: 'western',
      returnedAt: result.returnedAt,
      local: result.local,
      note: 'Карта построена на город рождения. Если в день рождения вы будете в другом городе, тема года сдвинется.',
      input: chart.input,
      utc: chart.utc,
      julianDay: chart.julianDay,
      aspects: chart.aspects,
      western: chart.western,
      reading,
    });
  } catch (error) {
    return json({ error: 'calculation_failed', message: String(error && error.message) }, 500);
  }
}

async function handleTransits(request, env) {
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

  const location = await resolveLocation(body);
  if (location.error) return json({ error: location.error }, location.status);
  const { place, latitude, longitude, timeZone } = location;

  const period = PERIOD_KEYS.includes(body.period) ? body.period : 'month';

  try {
    await loadPrecisionFiles(env.ASSETS);
    const chart = await computeChart({
      date,
      time,
      timeZone,
      latitude,
      longitude,
      asteroids: body.asteroids === true && isPrecisionReady(),
    });
    const forecast = await computeTransits({
      natalPlanets: chart.western.planets,
      period,
      asteroids: body.asteroids === true && isPrecisionReady(),
    });
    const reading = buildForecast({
      period,
      events: forecast.events,
      truncated: forecast.truncated,
    });
    return json({
      place,
      period,
      from: forecast.from,
      to: forecast.to,
      events: forecast.events,
      reading,
    });
  } catch (error) {
    return json({ error: 'calculation_failed', message: String(error && error.message) }, 500);
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Warm the full ephemeris in the background, so no visitor waits for it.
    if (url.pathname.startsWith('/api/') && env.ASSETS && ctx && typeof ctx.waitUntil === 'function') {
      ctx.waitUntil(loadPrecisionFiles(env.ASSETS));
    }

    if (url.pathname === '/api/warm') return json({ ok: true });
    if (url.pathname === '/api/chart') return handleChart(request, env);
    if (url.pathname === '/api/transits') return handleTransits(request, env);
    if (url.pathname === '/api/synastry') return handleSynastry(request, env);
    if (url.pathname === '/api/solar') return handleSolar(request, env);
    return env.ASSETS.fetch(request);
  },
};
