import { computeChart, julianDayUtc } from './chart.js';
import { getEngine } from './swe.js';

const MS_PER_DAY = 86400000;
const UNIX_EPOCH_JD = 2440587.5;

function instantFromJulianDay(jd) {
  return new Date((jd - UNIX_EPOCH_JD) * MS_PER_DAY);
}

/** Wall-clock parts of an instant in a time zone, as the chart input expects them. */
function localParts(instant, timeZone) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);

  const byType = {};
  for (const part of parts) byType[part.type] = part.value;

  return {
    date: `${byType.year}-${byType.month}-${byType.day}`,
    time: `${byType.hour}:${byType.minute}`,
    preciseTime: `${byType.hour}:${byType.minute}:${byType.second}`,
  };
}

/**
 * The solar return is the moment the Sun comes back to its natal longitude. The
 * chart for that moment is read as the forecast for the year ahead.
 */
export async function computeSolarReturn({ birth, asteroids = false, after = new Date() }) {
  const { swe } = await getEngine();

  const natal = await computeChart(birth);
  const afterJd = julianDayUtc(swe, after);
  const { jd } = swe.solarReturn(natal.julianDay, { after: afterJd });

  const instant = instantFromJulianDay(jd);
  const local = localParts(instant, birth.timeZone);

  const chart = await computeChart({
    date: local.date,
    time: local.preciseTime,
    timeZone: birth.timeZone,
    latitude: birth.latitude,
    longitude: birth.longitude,
    asteroids,
  });

  return {
    returnedAt: instant.toISOString(),
    local: { date: local.date, time: local.time },
    chart,
  };
}
