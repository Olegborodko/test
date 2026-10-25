import { computeChart, findAspectsBetween } from './chart.js';

// Slow planets sit in the same sign for years, so two people of a similar age look
// "compatible" through them alone. Compatibility is read through personal planets.
const PERSONAL = new Set(['sun', 'moon', 'mercury', 'venus', 'mars']);

const LIMIT = 12;

export async function computeSynastry({ first, second }) {
  const firstChart = await computeChart(first);
  const secondChart = await computeChart(second);

  const all = findAspectsBetween(firstChart.western.planets, secondChart.western.planets);
  const personal = all.filter((aspect) => PERSONAL.has(aspect.first) || PERSONAL.has(aspect.second));

  return {
    aspects: personal.slice(0, LIMIT),
    truncated: personal.length > LIMIT,
  };
}
