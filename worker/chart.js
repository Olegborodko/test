import { getEngine } from './swe.js';

const BODIES = [
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
];

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

function julianDayUtc(swe, utc) {
  const hour = utc.getUTCHours() + utc.getUTCMinutes() / 60 + utc.getUTCSeconds() / 3600;
  return swe.julianDay(utc.getUTCFullYear(), utc.getUTCMonth() + 1, utc.getUTCDate(), hour);
}

function round(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
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

export async function computeChart({ date, time, timeZone, latitude, longitude }) {
  const { swe, mod } = await getEngine();

  const utc = localToUtc(date, time, timeZone);
  if (Number.isNaN(utc.getTime())) throw new Error('Некорректные дата или время рождения');
  const jd = julianDayUtc(swe, utc);

  // Everything below is synchronous on purpose: the engine instance is shared
  // inside the isolate, so the sidereal mode must not leak between requests.
  const westernPlanets = BODIES.map(([key, name]) => ({
    key,
    ...describePosition(swe.calcWithSign(jd, mod.Body[name], { flags: mod.Flag.Speed })),
  }));

  const tropicalHouses = swe.houses(jd, latitude, longitude, 'P');

  const western = {
    zodiac: 'tropical',
    houseSystem: 'Placidus',
    ascendant: round(tropicalHouses.ascendant, 6),
    midheaven: round(tropicalHouses.midheaven, 6),
    cusps: tropicalHouses.cusps.map((cusp) => round(cusp, 6)),
    planets: westernPlanets,
  };

  swe.setSiderealMode(mod.Ayanamsa.Lahiri);
  const siderealFlags = mod.Flag.Speed | mod.Flag.Sidereal;

  const vedicPlanets = BODIES.map(([key, name]) => {
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
  const vedicHouses = vedicPlanets.map((planet) => ({
    key: planet.key,
    house: ((planet.signIndex - ascendantRashi + 12) % 12) + 1,
  }));

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
    western,
    vedic,
  };
}
