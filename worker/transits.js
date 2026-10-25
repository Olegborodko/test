import { BODIES, julianDayUtc } from './chart.js';
import { getEngine } from './swe.js';

// Exact transits only: the moment a moving planet reaches an aspect to a natal
// planet, found by sampling and then bisecting the angular difference.
const ASPECTS = [
  { type: 'conjunction', angle: 0 },
  { type: 'opposition', angle: 180 },
  { type: 'trine', angle: 120 },
  { type: 'square', angle: 90 },
  { type: 'sextile', angle: 60 },
];

// Fast planets touch everything every few days, so they are read against the Sun
// and the Moon only. Slow planets are what a forecast is actually about.
const FAST_BODIES = new Set(['sun', 'mercury', 'venus', 'mars']);
const FAST_TARGETS = new Set(['sun', 'moon']);

const PERIODS = {
  week: {
    days: 7,
    stepHours: 6,
    limit: 12,
    bodies: ['sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'],
  },
  month: {
    days: 30,
    stepHours: 24,
    limit: 20,
    bodies: ['sun', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
  },
  year: {
    days: 365,
    stepHours: 120,
    limit: 24,
    bodies: ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'],
  },
};

export const PERIOD_KEYS = Object.keys(PERIODS);

const DAY_MS = 86400000;

/** Signed difference within (-180, 180]. */
function wrap180(value) {
  return (((value + 180) % 360) + 360) % 360 - 180;
}

/** Exact angles to look for: a square is both +90 and -90 from the natal point. */
function aspectAngles(angle) {
  if (angle === 0 || angle === 180) return [angle];
  return [angle, -angle];
}

function bodyNumber(mod, key) {
  const entry = BODIES.find(([id]) => id === key);
  return entry ? mod.Body[entry[1]] : null;
}

function dateAt(startMs, startJd, jd) {
  return new Date(startMs + (jd - startJd) * DAY_MS).toISOString().slice(0, 10);
}

export async function computeTransits({ natalPlanets, period = 'month', start = new Date(), asteroids = false }) {
  const config = PERIODS[period] || PERIODS.month;
  // Asteroids move fast enough to flood a forecast, except Chiron, which is the
  // one asteroid astrologers actually follow by transit.
  const bodies = asteroids ? [...config.bodies, 'chiron'] : config.bodies;
  const { swe, mod } = await getEngine();

  const startMs = start.getTime();
  const startJd = julianDayUtc(swe, start);
  const step = config.stepHours / 24;
  const steps = Math.ceil(config.days / step);

  const natal = new Map(natalPlanets.map((planet) => [planet.key, planet.longitude]));

  // Longitudes of every transiting body at every sample, computed once.
  const samples = new Map();
  for (const key of bodies) {
    const body = bodyNumber(mod, key);
    if (body === null) continue;
    const values = [];
    for (let index = 0; index <= steps; index += 1) {
      values.push(swe.calc(startJd + index * step, body).longitude);
    }
    samples.set(key, values);
  }

  const events = [];
  const seen = new Set();

  const addEvent = (key, target, aspect, jd) => {
    const signature = `${key}|${target}|${aspect}|${jd.toFixed(2)}`;
    if (seen.has(signature)) return;
    seen.add(signature);
    events.push({ jd, transit: key, natal: target, aspect });
  };

  for (const [key, values] of samples) {
    const body = bodyNumber(mod, key);
    const targets = FAST_BODIES.has(key)
      ? [...natal.keys()].filter((target) => FAST_TARGETS.has(target))
      : [...natal.keys()];

    for (const target of targets) {
      const natalLongitude = natal.get(target);

      for (const aspect of ASPECTS) {
        for (const angle of aspectAngles(aspect.angle)) {
          const offsets = values.map((value) => wrap180(value - natalLongitude - angle));

          for (let index = 0; index < offsets.length; index += 1) {
            if (offsets[index] === 0) addEvent(key, target, aspect.type, startJd + index * step);
            if (index === 0) continue;

            const previous = offsets[index - 1];
            const current = offsets[index];
            // A jump of nearly 360 degrees is the wrap of the angle, not a crossing.
            if (Math.abs(previous) > 90 || Math.abs(current) > 90) continue;
            if (Math.sign(previous) === Math.sign(current)) continue;

            let low = startJd + (index - 1) * step;
            let high = startJd + index * step;
            let lowValue = previous;
            for (let pass = 0; pass < 14; pass += 1) {
              const middle = (low + high) / 2;
              const value = wrap180(swe.calc(middle, body).longitude - natalLongitude - angle);
              if (Math.sign(value) === Math.sign(lowValue)) {
                low = middle;
                lowValue = value;
              } else {
                high = middle;
              }
            }
            addEvent(key, target, aspect.type, (low + high) / 2);
          }
        }
      }
    }
  }

  events.sort((first, second) => first.jd - second.jd);
  const limited = events.slice(0, config.limit);

  return {
    period,
    from: dateAt(startMs, startJd, startJd),
    to: dateAt(startMs, startJd, startJd + config.days),
    truncated: events.length > limited.length,
    events: limited.map((event) => ({
      date: dateAt(startMs, startJd, event.jd),
      at: new Date(startMs + (event.jd - startJd) * DAY_MS).toISOString(),
      transit: event.transit,
      aspect: event.aspect,
      natal: event.natal,
    })),
  };
}
