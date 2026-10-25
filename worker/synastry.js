import { ASTEROIDS, computeChart, findAspectsBetween } from './chart.js';

// Slow planets sit in the same sign for years, so two people of a similar age look
// "compatible" through them alone. Compatibility is read through personal planets
// and, when enabled, the asteroids.
const PERSONAL = new Set(['sun', 'moon', 'mercury', 'venus', 'mars']);

const LIMIT = 12;

// How much a contact helps or strains, before its tightness is taken into account.
const WEIGHTS = {
  conjunction: 1,
  sextile: 1,
  trine: 2,
  square: -1,
  opposition: -1.5,
};

function isRelevant(first, second) {
  if (PERSONAL.has(first) && PERSONAL.has(second)) return true;
  return (PERSONAL.has(first) && ASTEROIDS.has(second))
    || (ASTEROIDS.has(first) && PERSONAL.has(second));
}

/**
 * A deliberately simple score: the balance of easy and tense contacts between the
 * personal planets, each weighted by how exact it is. 50% means an even mix; the
 * formula cannot reach 0 or 100, because no chart is purely one or the other.
 */
function compatibility(aspects) {
  let harmony = 0;
  let tension = 0;

  for (const aspect of aspects) {
    if (!PERSONAL.has(aspect.first) || !PERSONAL.has(aspect.second)) continue;
    const weight = WEIGHTS[aspect.type] || 0;
    if (!weight) continue;
    const tightness = Math.max(0.2, 1 - aspect.orb / 8);
    const value = weight * tightness;
    if (value > 0) harmony += value;
    else tension -= value;
  }

  const percent = Math.round(50 + (50 * (harmony - tension)) / (harmony + tension + 3));
  return {
    percent,
    harmony: Math.round(harmony * 10) / 10,
    tension: Math.round(tension * 10) / 10,
  };
}

export async function computeSynastry({ first, second, asteroids = false }) {
  const firstChart = await computeChart({ ...first, asteroids });
  const secondChart = await computeChart({ ...second, asteroids });

  const all = findAspectsBetween(firstChart.western.planets, secondChart.western.planets);
  const relevant = all.filter((aspect) => isRelevant(aspect.first, aspect.second));

  return {
    aspects: relevant.slice(0, LIMIT),
    truncated: relevant.length > LIMIT,
    score: compatibility(all),
  };
}
