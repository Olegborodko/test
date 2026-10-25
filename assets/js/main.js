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
};

const ERROR_MESSAGES = {
  place_not_found: 'Город не найден. Попробуйте написать иначе.',
  geocoding_unavailable: 'Сервис поиска городов недоступен. Попробуйте позже.',
  calculation_failed: 'Не удалось рассчитать карту.',
  city_required: 'Укажите город рождения.',
  invalid_date: 'Проверьте дату рождения.',
  invalid_time: 'Проверьте время рождения.',
};

const form = document.getElementById('chart-form');
const status = document.getElementById('status');
const result = document.getElementById('result');
const submitButton = form.querySelector('button[type="submit"]');

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
  card.append(element('p', 'card__meta', `Тропический зодиак · дома Плацидуса · ASC ${signLabel(signNameOf(western.ascendant))} ${formatDegree(western.ascendant % 30)}`));

  const rows = western.planets.map((planet) => [
    PLANET_NAMES[planet.key] || planet.key,
    `${signLabel(planet.sign)} ${formatDegree(planet.degreeInSign)}${planet.retrograde ? ' R' : ''}`,
  ]);

  card.append(table(['Планета', 'Положение'], rows));
  container.append(card);
}

function renderVedic(container, vedic) {
  const card = element('section', 'card');
  card.append(element('h2', null, 'Ведическая карта'));
  card.append(element('p', 'card__meta', `Сидерический зодиак · аянамша ${vedic.ayanamsa} ${vedic.ayanamsaValue}° · ASC ${signLabel(vedic.ascendantRashi)}`));

  const rows = vedic.planets.map((planet) => [
    PLANET_NAMES[planet.key] || planet.key,
    `${signLabel(planet.sign)}`,
    `${planet.nakshatra} · пада ${planet.pada}`,
    String(vedic.houseOfPlanet[planet.key]),
  ]);

  card.append(table(['Планета', 'Раши', 'Накшатра', 'Дом'], rows));
  container.append(card);
}

function signNameOf(longitude) {
  const names = Object.keys(SIGN_NAMES);
  return names[Math.floor(longitude / 30) % 12];
}

function render(chart) {
  result.replaceChildren();

  const header = element('section', 'card');
  const place = chart.place ? `${chart.place.name}, ${chart.place.country}` : chart.input.timeZone;
  header.append(element('h2', null, place));
  header.append(element('p', 'card__meta', `Всемирное время: ${chart.utc.replace('T', ' ').slice(0, 16)} · JD ${chart.julianDay}`));
  result.append(header);

  renderWestern(result, chart.western);
  renderVedic(result, chart.vedic);
  result.hidden = false;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  submitButton.disabled = true;
  status.textContent = 'Считаем…';
  result.hidden = true;

  const data = new FormData(form);
  const payload = {
    date: data.get('date'),
    time: data.get('time'),
    city: data.get('city'),
  };

  try {
    const response = await fetch('/api/chart', {
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
    render(body);
  } catch {
    status.textContent = 'Сеть недоступна. Попробуйте ещё раз.';
  } finally {
    submitButton.disabled = false;
  }
});
