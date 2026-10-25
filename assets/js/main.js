const SIGN_NAMES = {
  Aries: 'Овен',
  Taurus: 'Телец',
  Gemini: 'Близнецы',
  Cancer: 'Рак',
  Leo: 'Лев',
  Virgo: 'Дева',
  Libra: 'Весы',
  Scorpio: 'Скорпион',
  Sagittarius: 'Стрелец',
  Capricorn: 'Козерог',
  Aquarius: 'Водолей',
  Pisces: 'Рыбы',
};

const PLANET_NAMES = {
  sun: 'Солнце',
  moon: 'Луна',
  mercury: 'Меркурий',
  venus: 'Венера',
  mars: 'Марс',
  jupiter: 'Юпитер',
  saturn: 'Сатурн',
  uranus: 'Уран',
  neptune: 'Нептун',
  pluto: 'Плутон',
  rahu: 'Раху',
  chiron: 'Хирон',
  pholus: 'Фолус',
  ceres: 'Церера',
  pallas: 'Паллада',
  juno: 'Юнона',
  vesta: 'Веста',
};

// Short labels for the wheel: full names do not fit around a circle on a phone.
const SIGN_SHORT = {
  Aries: 'Овн',
  Taurus: 'Тел',
  Gemini: 'Бли',
  Cancer: 'Рак',
  Leo: 'Лев',
  Virgo: 'Дев',
  Libra: 'Вес',
  Scorpio: 'Ско',
  Sagittarius: 'Стр',
  Capricorn: 'Коз',
  Aquarius: 'Вод',
  Pisces: 'Рыб',
};

const PLANET_SHORT = {
  sun: 'Сол',
  moon: 'Луна',
  mercury: 'Мер',
  venus: 'Вен',
  mars: 'Мар',
  jupiter: 'Юп',
  saturn: 'Сат',
  uranus: 'Ур',
  neptune: 'Неп',
  pluto: 'Пл',
  rahu: 'Рах',
  chiron: 'Хир',
  pholus: 'Фол',
  ceres: 'Цер',
  pallas: 'Пал',
  juno: 'Юно',
  vesta: 'Вест',
};

const ERROR_MESSAGES = {
  place_not_found: 'Город не найден. Попробуйте написать иначе.',
  geocoding_unavailable: 'Сервис поиска городов недоступен. Попробуйте позже.',
  calculation_failed: 'Не удалось рассчитать карту.',
  city_required: 'Укажите город рождения.',
  invalid_date: 'Проверьте дату рождения.',
  invalid_time: 'Проверьте время рождения.',
};

// The module is also imported by the layout check outside a browser.
const hasDom = typeof document !== 'undefined';
const form = hasDom ? document.getElementById('chart-form') : null;
const status = hasDom ? document.getElementById('status') : null;
const result = hasDom ? document.getElementById('result') : null;
const submitButton = hasDom ? form.querySelector('button[type="submit"]') : null;
const periodField = hasDom ? document.getElementById('period-field') : null;
const systemField = hasDom ? document.getElementById('system-field') : null;
const partnerField = hasDom ? document.getElementById('partner-field') : null;
const solarField = hasDom ? document.getElementById('solar-field') : null;
const partnerInputs = hasDom ? [...document.querySelectorAll('[name^="partner"]')] : [];
const tabs = hasDom ? document.querySelectorAll('.tab') : [];
const chartOnlyBlocks = hasDom ? document.querySelectorAll('[data-chart-only]') : [];

const pageTitle = hasDom ? document.querySelector('.page__header h1') : null;
const pageLead = hasDom ? document.querySelector('.page__header .page__lead') : null;

// Each tab explains itself: what this page is for and why to fill the form.
const PAGE_COPY = {
  chart: {
    title: 'Натальная карта',
    lead: 'Западная и ведическая карта по дате, времени и месту рождения. Показывает характер, сильные стороны и в чём стоит быть внимательнее.',
  },
  forecast: {
    title: 'Прогноз',
    lead: 'Что происходит в жизни сейчас. Сравнивает вашу карту с нынешним положением планет — на неделю, месяц или год вперёд.',
  },
  synastry: {
    title: 'Совместимость',
    lead: 'Насколько два человека подходят друг другу: сравнивает две карты, находит общие точки и считает процент совпадения.',
  },
  solar: {
    title: 'Соляр',
    lead: 'Тема года вперёд: карта на момент, когда Солнце возвращается в ту точку, где было при рождении, — это происходит в день рождения.',
  },
};

let mode = 'chart';

function setMode(next) {
  mode = next;
  for (const tab of tabs) {
    const active = tab.dataset.mode === next;
    tab.classList.toggle('tab--active', active);
    tab.setAttribute('aria-selected', String(active));
  }
  const copy = PAGE_COPY[next] || PAGE_COPY.chart;
  if (pageTitle) pageTitle.textContent = copy.title;
  if (pageLead) pageLead.textContent = copy.lead;
  if (periodField) periodField.hidden = next !== 'forecast';
  if (partnerField) partnerField.hidden = next !== 'synastry';
  if (solarField) solarField.hidden = next !== 'solar';
  if (systemField) systemField.hidden = next === 'synastry' || next === 'solar';
  for (const block of chartOnlyBlocks) block.hidden = next !== 'chart';
  for (const input of partnerInputs) input.required = next === 'synastry';

  const labels = {
    chart: 'Рассчитать',
    forecast: 'Показать прогноз',
    synastry: 'Сравнить карты',
    solar: 'Показать соляр',
  };
  submitButton.textContent = labels[next] || labels.chart;
  status.textContent = '';
  result.hidden = true;
}

for (const tab of tabs) tab.addEventListener('click', () => setMode(tab.dataset.mode));

// Warm the server's full ephemeris while the visitor fills the form.
fetch('/api/warm', { method: 'POST' }).catch(() => {});

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function table(headers, rows) {
  const tableNode = element('table', 'table');
  const head = element('thead');
  const headRow = element('tr');
  for (const header of headers) headRow.append(element('th', null, header));
  head.append(headRow);

  const body = element('tbody');
  for (const row of rows) {
    const rowNode = element('tr');
    for (const cell of row) rowNode.append(element('td', null, cell));
    body.append(rowNode);
  }

  tableNode.append(head, body);
  return tableNode;
}

function formatDegree(degreeInSign) {
  const degrees = Math.floor(degreeInSign);
  const minutes = Math.round((degreeInSign - degrees) * 60);
  return `${degrees}° ${String(minutes).padStart(2, '0')}'`;
}

function signLabel(signName) {
  return SIGN_NAMES[signName] || signName;
}

function renderWestern(container, western) {
  const card = element('section', 'card');
  card.append(element('h2', null, 'Западная карта'));
  const meta = element('p', 'card__meta', `Тропический зодиак · дома Плацидуса · ASC ${signLabel(signNameOf(western.ascendant))} ${formatDegree(western.ascendant % 30)}`);
  card.append(meta);

  const rows = western.planets.map((planet) => [
    PLANET_NAMES[planet.key] || planet.key,
    `${signLabel(planet.sign)} ${formatDegree(planet.degreeInSign)}${planet.retrograde ? ' R' : ''}`,
  ]);

  card.append(table(['Планета', 'Положение'], rows));
  card.append(element('p', 'card__meta', 'ASC — асцендент, MC — середина неба, R — ретроградная планета.'));
  container.append(card);
}

function renderVedic(container, vedic) {
  const card = element('section', 'card');
  card.append(element('h2', null, 'Ведическая карта'));
  const meta = element('p', 'card__meta', `Сидерический зодиак · аянамша ${vedic.ayanamsa} ${vedic.ayanamsaValue}° · ASC ${signLabel(vedic.ascendantRashi)}`);
  card.append(meta);

  const rows = vedic.planets.map((planet) => [
    PLANET_NAMES[planet.key] || planet.key,
    `${signLabel(planet.sign)}`,
    `${planet.nakshatra} · пада ${planet.pada}`,
    String(vedic.houseOfPlanet[planet.key]),
  ]);

  card.append(table(['Планета', 'Раши', 'Накшатра', 'Дом'], rows));
  card.append(element('p', 'card__meta', 'Дом считается от асцендента по целым знакам, пада — четверть накшатры.'));
  container.append(card);
}

function signNameOf(longitude) {
  const names = Object.keys(SIGN_NAMES);
  return names[Math.floor(longitude / 30) % 12];
}

function renderReading(container, reading) {
  const card = element('section', 'card');
  card.append(element('h2', null, 'Разбор'));

  for (const section of reading.sections) {
    card.append(element('h3', 'reading__title', section.title));
    if (section.text) card.append(element('p', 'reading__text', section.text));
    if (section.note) card.append(element('p', 'reading__note', section.note));
    if (section.items) {
      const list = element('ul', 'reading__list');
      for (const item of section.items) list.append(element('li', null, item));
      card.append(list);
    }
  }

  container.append(card);
}

function round1(value) {
  return Math.round(value * 10) / 10;
}

/** Point on the wheel for a longitude, with the ascendant on the left. */
function polar(longitude, ascendant, radius) {
  const angle = ((longitude - ascendant) * Math.PI) / 180;
  return {
    x: round1(180 - radius * Math.cos(angle)),
    y: round1(180 + radius * Math.sin(angle)),
  };
}

function radialLine(longitude, ascendant, inner, outer) {
  const start = polar(longitude, ascendant, inner);
  const end = polar(longitude, ascendant, outer);
  return { x1: start.x, y1: start.y, x2: end.x, y2: end.y };
}

/** Coordinates for every part of the wheel; kept apart from the SVG for checks. */
export function wheelLayout({ ascendant, cusps, planets, aspects }) {
  const signs = Object.keys(SIGN_NAMES).map((sign, index) => {
    const point = polar(index * 30 + 15, ascendant, 156);
    return { text: SIGN_SHORT[sign], x: point.x, y: point.y };
  });

  const houseLines = cusps.map((cusp) => radialLine(cusp, ascendant, 92, 140));

  const houseNumbers = cusps.map((cusp, index) => {
    const span = (cusps[(index + 1) % 12] - cusp + 360) % 360;
    const point = polar(cusp + span / 2, ascendant, 128);
    return { text: String(index + 1), x: point.x, y: point.y };
  });

  // Planets standing next to each other would print their labels on top of one
  // another, so close neighbours alternate between two radii.
  const ordered = [...planets].sort((first, second) => (
    ((first.longitude - ascendant + 360) % 360) - ((second.longitude - ascendant + 360) % 360)
  ));

  let previousOffset = null;
  let shifted = false;
  const markers = ordered.map((planet) => {
    const offset = (planet.longitude - ascendant + 360) % 360;
    if (previousOffset !== null && offset - previousOffset < 8) shifted = !shifted;
    else shifted = false;
    previousOffset = offset;

    const dot = polar(planet.longitude, ascendant, 139);
    const label = polar(planet.longitude, ascendant, shifted ? 102 : 114);
    return {
      key: planet.key,
      text: PLANET_SHORT[planet.key] || planet.key,
      dotX: dot.x,
      dotY: dot.y,
      x: label.x,
      y: label.y,
    };
  });

  const aspectLines = aspects
    .filter((aspect) => aspect.type !== 'conjunction')
    .map((aspect) => {
      const from = planets.find((planet) => planet.key === aspect.from);
      const to = planets.find((planet) => planet.key === aspect.to);
      if (!from || !to) return null;
      const start = polar(from.longitude, ascendant, 92);
      const end = polar(to.longitude, ascendant, 92);
      return { type: aspect.type, x1: start.x, y1: start.y, x2: end.x, y2: end.y };
    })
    .filter(Boolean);

  return {
    ascendant: radialLine(ascendant, ascendant, 92, 140),
    signs,
    houseLines,
    houseNumbers,
    markers,
    aspectLines,
  };
}

function svgNode(tag, attributes, text) {
  const node = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, String(value));
  if (text !== undefined) node.textContent = text;
  return node;
}

export function renderWheel(container, chart, system) {
  const data = chart[system];
  if (!data) return;
  const vedic = system === 'vedic';

  // Vedic charts count whole signs from the rashi of the ascendant, so there the
  // cusps are sign boundaries that start at the ascendant's sign.
  const ascendantSign = Math.floor(data.ascendant / 30) * 30;
  const cusps = vedic
    ? Array.from({ length: 12 }, (_, index) => (ascendantSign + index * 30) % 360)
    : data.cusps;

  const layout = wheelLayout({
    ascendant: data.ascendant,
    cusps,
    planets: data.planets,
    aspects: chart.aspects || [],
  });

  const card = element('section', 'card');
  card.append(element('h2', null, 'Круг карты'));
  card.append(element('p', 'card__meta', vedic
    ? 'Сидерический зодиак, дома от восхода по целым знакам.'
    : 'Тропический зодиак, дома Плацидуса.'));

  const svg = svgNode('svg', {
    class: 'wheel',
    viewBox: '0 0 360 360',
    role: 'img',
    'aria-label': 'Круг натальной карты: зодиак, дома, планеты и аспекты',
  });

  const text = (className, point, content) => svgNode('text', {
    class: className,
    x: point.x,
    y: point.y,
    'text-anchor': 'middle',
    'dominant-baseline': 'middle',
  }, content);

  svg.append(
    svgNode('circle', { class: 'wheel__ring', cx: 180, cy: 180, r: 172 }),
    svgNode('circle', { class: 'wheel__ring', cx: 180, cy: 180, r: 140 }),
    svgNode('circle', { class: 'wheel__ring wheel__ring--dashed', cx: 180, cy: 180, r: 92 }),
  );

  for (const line of layout.aspectLines) {
    const tone = line.type === 'trine' || line.type === 'sextile' ? 'good' : 'tension';
    svg.append(svgNode('line', {
      class: `wheel__aspect wheel__aspect--${tone}`,
      x1: line.x1,
      y1: line.y1,
      x2: line.x2,
      y2: line.y2,
    }));
  }

  for (const line of layout.houseLines) {
    svg.append(svgNode('line', { class: 'wheel__cusp', ...line }));
  }
  svg.append(svgNode('line', { class: 'wheel__cusp wheel__cusp--asc', ...layout.ascendant }));

  for (const house of layout.houseNumbers) svg.append(text('wheel__house', house, house.text));
  for (const point of layout.signs) svg.append(text('wheel__sign', point, point.text));

  for (const marker of layout.markers) {
    svg.append(svgNode('circle', {
      class: 'wheel__planet-dot',
      cx: marker.dotX,
      cy: marker.dotY,
      r: 2.4,
    }));
    svg.append(text('wheel__planet', marker, marker.text));
  }

  card.append(svg);
  card.append(element('p', 'card__meta',
    'Числа — номера домов. Лиловым показан восход (ASC). Зелёные линии — аспекты согласия, красные — напряжения.'));
  container.append(card);
}

function render(chart) {
  result.replaceChildren();

  const header = element('section', 'card');
  const place = chart.place ? `${chart.place.name}, ${chart.place.country}` : chart.input.timeZone;
  header.append(element('h2', null, place));
  header.append(element('p', 'card__meta', `Всемирное время: ${chart.utc.replace('T', ' ').slice(0, 16)} · JD ${chart.julianDay}`));
  result.append(header);

  renderWheel(result, chart, chart.system);

  if (chart.reading) renderReading(result, chart.reading);
  if (chart.western) renderWestern(result, chart.western);
  if (chart.vedic) renderVedic(result, chart.vedic);
  result.hidden = false;
}

function formatDay(iso, withYear) {
  const date = new Date(`${iso}T00:00:00Z`);
  const options = { day: 'numeric', month: 'long', timeZone: 'UTC' };
  if (withYear) options.year = 'numeric';
  return new Intl.DateTimeFormat('ru-RU', options).format(date);
}

export function renderForecast(forecast) {
  result.replaceChildren();
  const withYear = forecast.period === 'year';

  const header = element('section', 'card');
  header.append(element('h2', null, forecast.reading.title));
  const place = forecast.place ? `${forecast.place.name}, ${forecast.place.country}` : '';
  header.append(element('p', 'card__meta',
    [place, `${formatDay(forecast.from, withYear)} — ${formatDay(forecast.to, withYear)}`].filter(Boolean).join(' · ')));
  result.append(header);

  const card = element('section', 'card');
  if (!forecast.reading.items.length) {
    card.append(element('p', 'reading__text', 'На этот период точных аспектов нет. Попробуйте взять срок подольше.'));
  } else {
    const list = element('ul', 'forecast');
    for (const item of forecast.reading.items) {
      const row = element('li', 'forecast__item');
      row.append(element('span', 'forecast__date', formatDay(item.date, withYear)));
      row.append(element('span', 'forecast__text', item.text));
      list.append(row);
    }
    card.append(list);
  }
  card.append(element('p', 'card__meta', forecast.reading.note));
  result.append(card);
  result.hidden = false;
}

export function renderSolar(solar) {
  result.replaceChildren();

  const header = element('section', 'card');
  header.append(element('h2', null, 'Соляр'));
  const place = solar.place ? solar.place.name : '';
  const moment = `${formatDay(solar.local.date, true)}, ${solar.local.time}`;
  header.append(element('p', 'card__meta', [place, `возвращение Солнца ${moment}`].filter(Boolean).join(' · ')));
  header.append(element('p', 'reading__text',
    'Соляр — карта на момент, когда Солнце возвращается в ту точку, где было при рождении. Её читают как тему на год вперёд.'));
  header.append(element('p', 'reading__note', solar.note));
  result.append(header);

  if (solar.reading) {
    const card = element('section', 'card');
    for (const section of solar.reading.sections) {
      card.append(element('h3', 'reading__title', section.title));
      if (section.text) card.append(element('p', 'reading__text', section.text));
    }
    result.append(card);
  }
  result.hidden = false;
}

export function renderSynastry(synastry) {
  result.replaceChildren();

  const header = element('section', 'card');
  header.append(element('h2', null, synastry.reading.title));
  if (synastry.reading.score) {
    header.append(element('p', 'score', `${synastry.reading.score.percent}% совпадения`));
  }
  const places = [synastry.first.place, synastry.second.place]
    .filter(Boolean)
    .map((place) => place.name);
  header.append(element('p', 'card__meta', places.length === 2 ? places.join(' и ') : 'Две карты'));
  result.append(header);

  const card = element('section', 'card');
  if (!synastry.reading.items.length) {
    card.append(element('p', 'reading__text', 'Точных связей между личными планетами не нашлось — карты мало пересекаются. Это не приговор, просто читать нечего.'));
  } else {
    const list = element('ul', 'reading__list');
    for (const item of synastry.reading.items) list.append(element('li', null, item));
    card.append(list);
  }
  card.append(element('p', 'card__meta', synastry.reading.note));
  result.append(card);
  result.hidden = false;
}

async function submitChart(event) {
  event.preventDefault();
  submitButton.disabled = true;
  status.textContent = 'Считаем…';
  result.hidden = true;

  const data = new FormData(form);
  const payload = mode === 'synastry'
    ? {
        first: { date: data.get('date'), time: data.get('time'), city: data.get('city') },
        second: {
          date: data.get('partnerDate'),
          time: data.get('partnerTime'),
          city: data.get('partnerCity'),
        },
      }
    : {
        date: data.get('date'),
        time: data.get('time'),
        city: data.get('city'),
        system: data.get('system'),
      };
  payload.asteroids = data.get('asteroids') === 'on';
  if (mode === 'forecast') payload.period = data.get('period');
  if (mode === 'solar') payload.returnCity = data.get('returnCity');

  const endpoint = {
    chart: '/api/chart',
    forecast: '/api/transits',
    synastry: '/api/synastry',
    solar: '/api/solar',
  }[mode];

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const body = await response.json();

    if (!response.ok) {
      status.textContent = ERROR_MESSAGES[body.error] || ERROR_MESSAGES.calculation_failed;
      return;
    }

    status.textContent = '';
    if (mode === 'forecast') renderForecast(body);
    else if (mode === 'synastry') renderSynastry(body);
    else if (mode === 'solar') renderSolar(body);
    else render(body);
  } catch {
    status.textContent = 'Сеть недоступна. Попробуйте ещё раз.';
  } finally {
    submitButton.disabled = false;
  }
}

if (hasDom) form.addEventListener('submit', submitChart);
