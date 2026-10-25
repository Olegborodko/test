import { getEngine } from './swe.js';

export const BODIES = [
  ['sun', 'Sun'],
  ['moon', 'Moon'],
  ['mercury', 'Mercury'],
  ['venus', 'Venus'],
  ['mars', 'Mars'],
  ['jupiter', 'Jupiter'],
  ['saturn', 'Saturn'],
  ['uranus', 'Uranus'],
  ['neptune', 'Neptune'],
  ['pluto', 'Pluto'],
  ['rahu', 'NorthNodeMean'],
  ['chiron', 'Chiron'],
  ['pholus', 'Pholus'],
  ['ceres', 'Ceres'],
  ['pallas', 'Pallas'],
  ['juno', 'Juno'],
  ['vesta', 'Vesta'],
];

// Asteroids have no analytic theory: their calls throw unless the asteroid
// ephemeris file is mounted. They are opt-in for exactly that reason.
export const ASTEROIDS = new Set(['chiron', 'pholus', 'ceres', 'pallas', 'juno', 'vesta']);

export function bodiesFor(includeAsteroids) {
  return BODIES.filter(([key]) => includeAsteroids || !ASTEROIDS.has(key));
}

const NAKSHATRAS = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu',
  'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta',
  'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha',
  'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada',
  'Uttara Bhadrapada', 'Revati',
];

const NAKSHATRA_SPAN = 360 / 27;
const PADA_SPAN = NAKSHATRA_SPAN / 4;

/** Offset of a time zone from UTC at a given instant, in milliseconds. */
function zoneOffsetMs(instant, timeZone) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(new Date(instant));

  const partsByType = {};
  for (const part of parts) partsByType[part.type] = part.value;
  const hour = partsByType.hour === '24' ? '0' : partsByType.hour;

  const asUtc = Date.UTC(
    Number(partsByType.year),
    Number(partsByType.month) - 1,
    Number(partsByType.day),
    Number(hour),
    Number(partsByType.minute),
    Number(partsByType.second),
  );

  return asUtc - instant;
}

/** Local wall-clock birth time in a time zone to the matching UTC instant. */
export function localToUtc(date, time, timeZone) {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const wallClock = Date.UTC(year, month - 1, day, hour, minute);

  let instant = wallClock;
  for (let i = 0; i < 3; i += 1) {
    const next = wallClock - zoneOffsetMs(instant, timeZone);
    if (next === instant) break;
    instant = next;
  }

  return new Date(instant);
}

export function julianDayUtc(swe, utc) {
  const hour = utc.getUTCHours() + utc.getUTCMinutes() / 60 + utc.getUTCSeconds() / 3600;
  return swe.julianDay(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate(), hour);
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

/** Which of the twelve houses a longitude falls into, from house cusps. */
function houseFromCusps(longitude, cusps) {
  for (let index = 0; index < 12; index += 1) {
    const start = cusps[index];
    const end = cusps[(index + 1) % 12];
    const inside = start <= end
      ? longitude >= start && longitude < end
      : longitude >= start || longitude < end;
    if (inside) return index + 1;
  }
  return 12;
}

// Angular aspect types with the deviation from the exact angle still counted.
const ASPECTS = [
  { type: 'conjunction', angle: 0, orb: 8 },
  { type: 'opposition', angle: 180, orb: 8 },
  { type: 'trine', angle: 120, orb: 7 },
  { type: 'square', angle: 90, orb: 7 },
  { type: 'sextile', angle: 60, orb: 5 },
];

/** Shortest angular distance between two longitudes, 0-180 degrees. */
function angularDistance(first, second) {
  const difference = Math.abs(first - second) % 360;
  return difference > 180 ? 360 - difference : difference;
}

/** Major aspects between the planets, the tightest ones first. */
function computeAspects(planets) {
  const found = [];

  for (let i = 0; i < planets.length; i += 1) {
    for (let j = i + 1; j < planets.length; j += 1) {
      const distance = angularDistance(planets[i].longitude, planets[j].longitude);
      const aspect = ASPECTS.find((candidate) => Math.abs(distance - candidate.angle) <= candidate.orb);
      if (!aspect) continue;
      found.push({
        from: planets[i].key,
        to: planets[j].key,
        type: aspect.type,
        angle: aspect.angle,
        orb: round(Math.abs(distance - aspect.angle), 2),
      });
    }
  }

  return found.sort((first, second) => first.orb - second.orb);
}

/** Major aspects between two sets of planets, the tightest ones first. */
export function findAspectsBetween(firstPlanets, secondPlanets) {
  const found = [];

  for (const first of firstPlanets) {
    for (const second of secondPlanets) {
      const distance = angularDistance(first.longitude, second.longitude);
      const aspect = ASPECTS.find((candidate) => Math.abs(distance - candidate.angle) <= candidate.orb);
      if (!aspect) continue;
      found.push({
        first: first.key,
        second: second.key,
        type: aspect.type,
        angle: aspect.angle,
        orb: round(Math.abs(distance - aspect.angle), 2),
      });
    }
  }

  return found.sort((a, b) => a.orb - b.orb);
}

function describePosition(position) {
  return {
    sign: position.sign,
    signIndex: position.signIndex,
    degreeInSign: round(position.degreeInSign, 4),
    longitude: round(position.longitude, 6),
    retrograde: position.retrograde,
  };
}

export async function computeChart({ date, time, timeZone, latitude, longitude, asteroids = false }) {
  const { swe, mod } = await getEngine();

  const utc = localToUtc(date, time, timeZone);
  if (Number.isNaN(utc.getTime())) throw new Error('Некорректные дата или время рождения');
  const jd = julianDayUtc(swe, utc);

  // Everything below is synchronous on purpose: the engine instance is shared
  // inside the isolate, so the sidereal mode must not leak between requests.
  const bodies = bodiesFor(asteroids);

  const westernPlanets = bodies.map(([key, name]) => ({
    key,
    ...describePosition(swe.calcWithSign(jd, mod.Body[name], { flags: mod.Flag.Speed })),
  }));

  const tropicalHouses = swe.houses(jd, latitude, longitude, 'P');

  const westernCusps = tropicalHouses.cusps.map((cusp) => round(cusp, 6));

  const western = {
    zodiac: 'tropical',
    houseSystem: 'Placidus',
    ascendant: round(tropicalHouses.ascendant, 6),
    midheaven: round(tropicalHouses.midheaven, 6),
    cusps: westernCusps,
    planets: westernPlanets.map((planet) => ({
      ...planet,
      house: houseFromCusps(planet.longitude, westernCusps),
    })),
  };

  swe.setSiderealMode(mod.Ayanamsa.Lahiri);
  const siderealFlags = mod.Flag.Speed | mod.Flag.Sidereal;

  let vedicPlanets = bodies.map(([key, name]) => {
    const position = swe.calcWithSign(jd, mod.Body[name], { flags: siderealFlags });
    const withinNakshatra = position.longitude % NAKSHATRA_SPAN;
    return {
      key,
      ...describePosition(position),
      nakshatra: NAKSHATRAS[Math.floor(position.longitude / NAKSHATRA_SPAN)],
      pada: Math.floor(withinNakshatra / PADA_SPAN) + 1,
    };
  });

  const siderealHouses = swe.houses(jd, latitude, longitude, 'P', { flags: mod.Flag.Sidereal });
  const ascendantRashi = Math.floor(siderealHouses.ascendant / 30);

  // Vedic charts conventionally use whole-sign houses counted from the rashi
  // that holds the ascendant.
  vedicPlanets = vedicPlanets.map((planet) => ({
    ...planet,
    house: ((planet.signIndex - ascendantRashi + 12) % 12) + 1,
  }));
  const vedicHouses = vedicPlanets.map((planet) => ({ key: planet.key, house: planet.house }));

  const vedic = {
    zodiac: 'sidereal',
    ayanamsa: 'Lahiri',
    ayanamsaValue: round(swe.ayanamsa(jd), 6),
    houseSystem: 'Whole sign',
    ascendant: round(siderealHouses.ascendant, 6),
    ascendantRashi: mod.SIGNS[ascendantRashi],
    planets: vedicPlanets,
    houseOfPlanet: Object.fromEntries(vedicHouses.map((entry) => [entry.key, entry.house])),
  };

  return {
    input: { date, time, timeZone, latitude, longitude },
    utc: utc.toISOString(),
    julianDay: round(jd, 6),
    // The ayanamsa shifts both longitudes by the same amount, so the angles between
    // planets, and therefore the aspects, are the same in both zodiacs.
    aspects: computeAspects(westernPlanets),
    western,
    vedic,
  };
}
