// Interface strings for the three languages the site speaks. Names, labels and
// page copy switch at once; the long readings come from the Worker.
const STRINGS = {
  ru: {
    locale: 'ru-RU',
    docTitle: 'Натальная карта',
    'lang.label': 'Язык сайта',
    'tabs.label': 'Разделы',
    'tab.chart': 'Карта',
    'tab.forecast': 'Прогноз',
    'tab.synastry': 'Совместимость',
    'tab.solar': 'Соляр',
    'page.chart.title': 'Натальная карта',
    'page.chart.lead': 'Западная и ведическая карта по дате, времени и месту рождения. Показывает характер, сильные стороны и в чём стоит быть внимательнее.',
    'page.forecast.title': 'Прогноз',
    'page.forecast.lead': 'Что происходит в жизни сейчас. Сравнивает вашу карту с нынешним положением планет — на неделю, месяц или год вперёд.',
    'page.synastry.title': 'Совместимость',
    'page.synastry.lead': 'Насколько два человека подходят друг другу: сравнивает две карты, находит общие точки и считает процент совпадения. На практике он выходит примерно от 20% до 80% — 0% и 100% не бывает.',
    'page.solar.title': 'Соляр',
    'page.solar.lead': 'Тема года вперёд: карта на момент, когда Солнце возвращается в ту точку, где было при рождении, — это происходит в день рождения.',
    source: 'Расчёт — Swiss Ephemeris 2.10 на эфемеридах NASA/JPL DE441. Положения планет совпадают с JPL Horizons с точностью до 0,2 угловой секунды; для сравнения, одна секунда дуги — это 1/3600 градуса.',
    'notice.title': 'Время рождения важно — но не для всего.',
    'notice.text': 'Ошибка в один час сдвигает восход и дома примерно на 15° (половина знака), в два часа — на целый знак. Знаки Солнца, Луны и планет от часа почти не зависят: Луна меняет знак только при ошибке в несколько часов. Если время примерное — читайте знаки, а восход и дома считайте ориентиром.',
    'form.date': 'Дата рождения',
    'form.time': 'Время рождения',
    'form.timeHint': 'Если время неизвестно, оставьте 12:00 — дома и Луна будут неточными.',
    'form.city': 'Город рождения',
    'form.system': 'Какая карта',
    'form.western': 'Западная',
    'form.vedic': 'Ведическая',
    'form.asteroids': 'Астероиды',
    'form.asteroidsShow': 'Показывать астероиды',
    'form.asteroidsHint': 'Хирон, Фолус, Церера, Паллада, Юнона, Веста — добавляют оттенки к карте.',
    'form.solarCity': 'Город в день рождения',
    'form.solarCityHint': 'Если в этот день вы будете не там, где родились, — укажите этот город. Пусто — считаем по городу рождения.',
    'partner.title': 'Второй человек',
    'partner.date': 'Дата рождения',
    'partner.time': 'Время рождения',
    'partner.timeHint': 'Если неизвестно, оставьте 12:00 — Луна и дома будут неточными.',
    'partner.city': 'Город рождения',
    'period.title': 'На какой срок прогноз',
    'period.week': 'Неделя',
    'period.month': 'Месяц',
    'period.year': 'Год',
    'action.chart': 'Рассчитать',
    'action.forecast': 'Показать прогноз',
    'action.synastry': 'Сравнить карты',
    'action.solar': 'Показать соляр',
    'status.calculating': 'Считаем…',
    'status.offline': 'Сеть недоступна. Попробуйте ещё раз.',
    'error.place_not_found': 'Город не найден. Попробуйте написать иначе.',
    'error.geocoding_unavailable': 'Сервис поиска городов недоступен. Попробуйте позже.',
    'error.calculation_failed': 'Не удалось рассчитать карту.',
    'error.city_required': 'Укажите город рождения.',
    'error.invalid_date': 'Проверьте дату рождения.',
    'error.invalid_time': 'Проверьте время рождения.',
    'result.western': 'Западная карта',
    'result.vedic': 'Ведическая карта',
    'result.reading': 'Разбор',
    'result.wheel': 'Круг карты',
    'result.westernMeta': 'Тропический зодиак · дома Плацидуса · ASC {sign} {degree}',
    'result.vedicMeta': 'Сидерический зодиак · аянамша {ayanamsa} {value}° · ASC {sign}',
    'result.westernNote': 'ASC — асцендент, MC — середина неба, R — ретроградная планета.',
    'result.vedicNote': 'Дом считается от асцендента по целым знакам, пада — четверть накшатры.',
    'result.planetCol': 'Планета',
    'result.positionCol': 'Положение',
    'result.rashiCol': 'Раши',
    'result.nakshatraCol': 'Накшатра',
    'result.houseCol': 'Дом',
    'result.pada': 'пада',
    'result.wheelAria': 'Круг натальной карты: зодиак, дома, планеты и аспекты',
    'result.wheelMetaWestern': 'Тропический зодиак, дома Плацидуса.',
    'result.wheelMetaVedic': 'Сидерический зодиак, дома от восхода по целым знакам.',
    'result.wheelNote': 'Числа — номера домов. Лиловым показан восход (ASC). Зелёные линии — аспекты согласия, красные — напряжения.',
    'result.utc': 'Всемирное время',
    'result.scoreSuffix': '% совпадения',
    'result.twoCharts': 'Две карты',
    'result.and': ' и ',
    'result.noForecast': 'На этот период точных аспектов нет. Попробуйте взять срок подольше.',
    'result.noSynastry': 'Точных связей между личными планетами не нашлось — карты мало пересекаются. Это не приговор, просто читать нечего.',
    'result.solarTitle': 'Соляр',
    'result.solarReturn': 'возвращение Солнца',
    'result.solarIntro': 'Соляр — карта на момент, когда Солнце возвращается в ту точку, где было при рождении. Её читают как тему на год вперёд.',
    names: {
      signs: {
        Aries: 'Овен', Taurus: 'Телец', Gemini: 'Близнецы', Cancer: 'Рак', Leo: 'Лев', Virgo: 'Дева',
        Libra: 'Весы', Scorpio: 'Скорпион', Sagittarius: 'Стрелец', Capricorn: 'Козерог', Aquarius: 'Водолей', Pisces: 'Рыбы',
      },
      signShort: {
        Aries: 'Овн', Taurus: 'Тел', Gemini: 'Бли', Cancer: 'Рак', Leo: 'Лев', Virgo: 'Дев',
        Libra: 'Вес', Scorpio: 'Ско', Sagittarius: 'Стр', Capricorn: 'Коз', Aquarius: 'Вод', Pisces: 'Рыб',
      },
      planets: {
        sun: 'Солнце', moon: 'Луна', mercury: 'Меркурий', venus: 'Венера', mars: 'Марс', jupiter: 'Юпитер',
        saturn: 'Сатурн', uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон', rahu: 'Раху', chiron: 'Хирон',
        pholus: 'Фолус', ceres: 'Церера', pallas: 'Паллада', juno: 'Юнона', vesta: 'Веста',
      },
      planetShort: {
        sun: 'Сол', moon: 'Луна', mercury: 'Мер', venus: 'Вен', mars: 'Мар', jupiter: 'Юп', saturn: 'Сат',
        uranus: 'Ур', neptune: 'Неп', pluto: 'Пл', rahu: 'Рах', chiron: 'Хир', pholus: 'Фол',
        ceres: 'Цер', pallas: 'Пал', juno: 'Юно', vesta: 'Вест',
      },
    },
  },

  uk: {
    locale: 'uk-UA',
    docTitle: 'Натальна карта',
    'lang.label': 'Мова сайту',
    'tabs.label': 'Розділи',
    'tab.chart': 'Карта',
    'tab.forecast': 'Прогноз',
    'tab.synastry': 'Сумісність',
    'tab.solar': 'Соляр',
    'page.chart.title': 'Натальна карта',
    'page.chart.lead': 'Західна та ведична карта за датою, часом і місцем народження. Показує характер, сильні сторони і на що варто звернути увагу.',
    'page.forecast.title': 'Прогноз',
    'page.forecast.lead': 'Що відбувається в житті зараз. Порівнює вашу карту з поточним положенням планет — на тиждень, місяць або рік уперед.',
    'page.synastry.title': 'Сумісність',
    'page.synastry.lead': 'Наскільки двоє людей підходять одне одному: порівнює дві карти, знаходить спільні точки і рахує відсоток збігу. На практиці він виходить приблизно від 20% до 80% — 0% і 100% не буває.',
    'page.solar.title': 'Соляр',
    'page.solar.lead': 'Тема року вперед: карта на момент, коли Сонце повертається в ту точку, де було при народженні, — це відбувається в день народження.',
    source: 'Розрахунок — Swiss Ephemeris 2.10 на ефемеридах NASA/JPL DE441. Положення планет збігаються з JPL Horizons з точністю до 0,2 кутової секунди; для порівняння, одна секунда дуги — це 1/3600 градуса.',
    'notice.title': 'Час народження важливий — але не для всього.',
    'notice.text': 'Помилка в одну годину зсуває схід і доми приблизно на 15° (половина знака), у дві години — на цілий знак. Знаки Сонця, Місяця і планет від години майже не залежать: Місяць змінює знак лише при помилці в кілька годин. Якщо час приблизний — читайте знаки, а схід і доми сприймайте як орієнтир.',
    'form.date': 'Дата народження',
    'form.time': 'Час народження',
    'form.timeHint': 'Якщо час невідомий, залиште 12:00 — доми й Місяць будуть неточними.',
    'form.city': 'Місто народження',
    'form.system': 'Яка карта',
    'form.western': 'Західна',
    'form.vedic': 'Ведична',
    'form.asteroids': 'Астероїди',
    'form.asteroidsShow': 'Показувати астероїди',
    'form.asteroidsHint': 'Хірон, Фолус, Церера, Паллада, Юнона, Веста — додають відтінки до карти.',
    'form.solarCity': 'Місто в день народження',
    'form.solarCityHint': 'Якщо цього дня ви будете не там, де народилися, — вкажіть це місто. Порожньо — рахуємо за містом народження.',
    'partner.title': 'Друга людина',
    'partner.date': 'Дата народження',
    'partner.time': 'Час народження',
    'partner.timeHint': 'Якщо невідомо, залиште 12:00 — Місяць і доми будуть неточними.',
    'partner.city': 'Місто народження',
    'period.title': 'На який термін прогноз',
    'period.week': 'Тиждень',
    'period.month': 'Місяць',
    'period.year': 'Рік',
    'action.chart': 'Розрахувати',
    'action.forecast': 'Показати прогноз',
    'action.synastry': 'Порівняти карти',
    'action.solar': 'Показати соляр',
    'status.calculating': 'Рахуємо…',
    'status.offline': 'Мережа недоступна. Спробуйте ще раз.',
    'error.place_not_found': 'Місто не знайдено. Спробуйте написати інакше.',
    'error.geocoding_unavailable': 'Сервіс пошуку міст недоступний. Спробуйте пізніше.',
    'error.calculation_failed': 'Не вдалося розрахувати карту.',
    'error.city_required': 'Вкажіть місто народження.',
    'error.invalid_date': 'Перевірте дату народження.',
    'error.invalid_time': 'Перевірте час народження.',
    'result.western': 'Західна карта',
    'result.vedic': 'Ведична карта',
    'result.reading': 'Розбір',
    'result.wheel': 'Коло карти',
    'result.westernMeta': 'Тропічний зодіак · доми Плацидуса · ASC {sign} {degree}',
    'result.vedicMeta': 'Сидеричний зодіак · аянамша {ayanamsa} {value}° · ASC {sign}',
    'result.westernNote': 'ASC — схід, MC — середина неба, R — ретроградна планета.',
    'result.vedicNote': 'Дім рахується від сходу за цілими знаками, пада — чверть накшатри.',
    'result.planetCol': 'Планета',
    'result.positionCol': 'Положення',
    'result.rashiCol': 'Раші',
    'result.nakshatraCol': 'Накшатра',
    'result.houseCol': 'Дім',
    'result.pada': 'пада',
    'result.wheelAria': 'Коло натальної карти: зодіак, доми, планети й аспекти',
    'result.wheelMetaWestern': 'Тропічний зодіак, доми Плацидуса.',
    'result.wheelMetaVedic': 'Сидеричний зодіак, доми від сходу за цілими знаками.',
    'result.wheelNote': 'Числа — номери домів. Ліловим показано схід (ASC). Зелені лінії — аспекти згоди, червоні — напруги.',
    'result.utc': 'Всесвітній час',
    'result.scoreSuffix': '% збігу',
    'result.twoCharts': 'Дві карти',
    'result.and': ' та ',
    'result.noForecast': 'На цей період точних аспектів немає. Спробуйте взяти довший термін.',
    'result.noSynastry': 'Точних зв’язків між особистими планетами не знайшлося — карти мало перетинаються. Це не вирок, просто читати немає чого.',
    'result.solarTitle': 'Соляр',
    'result.solarReturn': 'повернення Сонця',
    'result.solarIntro': 'Соляр — карта на момент, коли Сонце повертається в ту точку, де було при народженні. Її читають як тему на рік уперед.',
    names: {
      signs: {
        Aries: 'Овен', Taurus: 'Тілець', Gemini: 'Близнята', Cancer: 'Рак', Leo: 'Лев', Virgo: 'Діва',
        Libra: 'Терези', Scorpio: 'Скорпіон', Sagittarius: 'Стрілець', Capricorn: 'Козеріг', Aquarius: 'Водолій', Pisces: 'Риби',
      },
      signShort: {
        Aries: 'Ове', Taurus: 'Тіл', Gemini: 'Бли', Cancer: 'Рак', Leo: 'Лев', Virgo: 'Дів',
        Libra: 'Тер', Scorpio: 'Ско', Sagittarius: 'Стр', Capricorn: 'Коз', Aquarius: 'Вод', Pisces: 'Риб',
      },
      planets: {
        sun: 'Сонце', moon: 'Місяць', mercury: 'Меркурій', venus: 'Венера', mars: 'Марс', jupiter: 'Юпітер',
        saturn: 'Сатурн', uranus: 'Уран', neptune: 'Нептун', pluto: 'Плутон', rahu: 'Раху', chiron: 'Хірон',
        pholus: 'Фолус', ceres: 'Церера', pallas: 'Паллада', juno: 'Юнона', vesta: 'Веста',
      },
      planetShort: {
        sun: 'Сон', moon: 'Міс', mercury: 'Мер', venus: 'Вен', mars: 'Мар', jupiter: 'Юп', saturn: 'Сат',
        uranus: 'Ур', neptune: 'Неп', pluto: 'Пл', rahu: 'Рах', chiron: 'Хір', pholus: 'Фол',
        ceres: 'Цер', pallas: 'Пал', juno: 'Юно', vesta: 'Вес',
      },
    },
  },

  en: {
    locale: 'en-GB',
    docTitle: 'Natal chart',
    'lang.label': 'Site language',
    'tabs.label': 'Sections',
    'tab.chart': 'Chart',
    'tab.forecast': 'Forecast',
    'tab.synastry': 'Compatibility',
    'tab.solar': 'Solar return',
    'page.chart.title': 'Natal chart',
    'page.chart.lead': 'Western and Vedic chart from your date, time and place of birth. Shows your character, your strengths and what to watch.',
    'page.forecast.title': 'Forecast',
    'page.forecast.lead': 'What is going on right now. Compares your chart with the current planets — for a week, a month or a year ahead.',
    'page.synastry.title': 'Compatibility',
    'page.synastry.lead': 'How well two people fit: compares two charts, finds the shared points and scores the match. In practice it lands roughly between 20% and 80% — 0% and 100% never happen.',
    'page.solar.title': 'Solar return',
    'page.solar.lead': 'The theme of the year ahead: a chart for the moment the Sun comes back to where it was at your birth, which happens on your birthday.',
    source: 'Calculated with Swiss Ephemeris 2.10 on NASA/JPL DE441 ephemerides. Planet positions match JPL Horizons to 0.2 arc seconds; for scale, one arc second is 1/3600 of a degree.',
    'notice.title': 'Birth time matters — but not for everything.',
    'notice.text': 'An hour of error moves the ascendant and the houses by about 15° (half a sign), two hours by a whole sign. Sun, Moon and planet signs barely depend on the hour: the Moon changes sign only with an error of several hours. If the time is approximate, read the signs and treat the ascendant and houses as a guide.',
    'form.date': 'Date of birth',
    'form.time': 'Time of birth',
    'form.timeHint': 'If the time is unknown, leave 12:00 — the houses and the Moon will be off.',
    'form.city': 'City of birth',
    'form.system': 'Which chart',
    'form.western': 'Western',
    'form.vedic': 'Vedic',
    'form.asteroids': 'Asteroids',
    'form.asteroidsShow': 'Show asteroids',
    'form.asteroidsHint': 'Chiron, Pholus, Ceres, Pallas, Juno, Vesta — they add nuance to the chart.',
    'form.solarCity': 'City on your birthday',
    'form.solarCityHint': 'If you will be somewhere else that day, name that city. Leave it empty to use your birth city.',
    'partner.title': 'Second person',
    'partner.date': 'Date of birth',
    'partner.time': 'Time of birth',
    'partner.timeHint': 'If unknown, leave 12:00 — the Moon and houses will be off.',
    'partner.city': 'City of birth',
    'period.title': 'Forecast period',
    'period.week': 'Week',
    'period.month': 'Month',
    'period.year': 'Year',
    'action.chart': 'Calculate',
    'action.forecast': 'Show forecast',
    'action.synastry': 'Compare charts',
    'action.solar': 'Show solar return',
    'status.calculating': 'Calculating…',
    'status.offline': 'No connection. Try again.',
    'error.place_not_found': 'City not found. Try another spelling.',
    'error.geocoding_unavailable': 'City search is unavailable. Try later.',
    'error.calculation_failed': 'Could not calculate the chart.',
    'error.city_required': 'Enter your birth city.',
    'error.invalid_date': 'Check the birth date.',
    'error.invalid_time': 'Check the birth time.',
    'result.western': 'Western chart',
    'result.vedic': 'Vedic chart',
    'result.reading': 'Reading',
    'result.wheel': 'Chart wheel',
    'result.westernMeta': 'Tropical zodiac · Placidus houses · ASC {sign} {degree}',
    'result.vedicMeta': 'Sidereal zodiac · ayanamsa {ayanamsa} {value}° · ASC {sign}',
    'result.westernNote': 'ASC — ascendant, MC — midheaven, R — retrograde planet.',
    'result.vedicNote': 'Houses are counted from the ascendant in whole signs; a pada is a quarter of a nakshatra.',
    'result.planetCol': 'Planet',
    'result.positionCol': 'Position',
    'result.rashiCol': 'Rashi',
    'result.nakshatraCol': 'Nakshatra',
    'result.houseCol': 'House',
    'result.pada': 'pada',
    'result.wheelAria': 'Natal chart wheel: zodiac, houses, planets and aspects',
    'result.wheelMetaWestern': 'Tropical zodiac, Placidus houses.',
    'result.wheelMetaVedic': 'Sidereal zodiac, houses from the ascendant in whole signs.',
    'result.wheelNote': 'Numbers are house numbers. Lilac marks the ascendant (ASC). Green lines are easy aspects, red lines are tense ones.',
    'result.utc': 'Universal time',
    'result.scoreSuffix': '% match',
    'result.twoCharts': 'Two charts',
    'result.and': ' and ',
    'result.noForecast': 'No exact aspects in this period. Try a longer range.',
    'result.noSynastry': 'No close contacts between the personal planets — the charts barely meet. That is not a verdict, there is just nothing to read.',
    'result.solarTitle': 'Solar return',
    'result.solarReturn': 'the Sun returns',
    'result.solarIntro': 'The solar return is the chart for the moment the Sun comes back to where it was at your birth. It is read as the theme for the year ahead.',
    names: {
      signs: {
        Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer', Leo: 'Leo', Virgo: 'Virgo',
        Libra: 'Libra', Scorpio: 'Scorpio', Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces',
      },
      signShort: {
        Aries: 'Ari', Taurus: 'Tau', Gemini: 'Gem', Cancer: 'Can', Leo: 'Leo', Virgo: 'Vir',
        Libra: 'Lib', Scorpio: 'Sco', Sagittarius: 'Sag', Capricorn: 'Cap', Aquarius: 'Aqu', Pisces: 'Pis',
      },
      planets: {
        sun: 'Sun', moon: 'Moon', mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter',
        saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune', pluto: 'Pluto', rahu: 'Rahu', chiron: 'Chiron',
        pholus: 'Pholus', ceres: 'Ceres', pallas: 'Pallas', juno: 'Juno', vesta: 'Vesta',
      },
      planetShort: {
        sun: 'Sun', moon: 'Moon', mercury: 'Mer', venus: 'Ven', mars: 'Mar', jupiter: 'Jup', saturn: 'Sat',
        uranus: 'Ura', neptune: 'Nep', pluto: 'Plu', rahu: 'Rah', chiron: 'Chi', pholus: 'Pho',
        ceres: 'Cer', pallas: 'Pal', juno: 'Jun', vesta: 'Ves',
      },
    },
  },
};

const SIGN_ORDER = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

let lang = 'ru';

function t(key) {
  const table = STRINGS[lang] || STRINGS.ru;
  const value = table[key];
  if (value !== undefined) return value;
  const fallback = STRINGS.ru[key];
  return fallback === undefined ? key : fallback;
}

function fill(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, name) => (
    values[name] === undefined ? match : String(values[name])
  ));
}

function names() {
  return (STRINGS[lang] || STRINGS.ru).names;
}

function signName(sign) {
  return names().signs[sign] || sign;
}

function planetName(key) {
  return names().planets[key] || key;
}

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

const langButtons = hasDom ? document.querySelectorAll('[data-lang]') : [];
const translatable = hasDom ? document.querySelectorAll('[data-i18n]') : [];
const langNav = hasDom ? document.querySelector('.lang') : null;
const tabsNav = hasDom ? document.querySelector('.tabs') : null;

let mode = 'chart';
let lastResult = null;

function applyPageCopy() {
  if (pageTitle) pageTitle.textContent = t(`page.${mode}.title`);
  if (pageLead) pageLead.textContent = t(`page.${mode}.lead`);
  if (submitButton) submitButton.textContent = t(`action.${mode}`);
}

/** Switch the whole interface: static labels, names, page copy and result labels. */
function applyLanguage(next, { persist = true } = {}) {
  lang = STRINGS[next] ? next : 'ru';
  document.documentElement.lang = lang;
  document.title = t('docTitle');

  for (const node of translatable) {
    const value = STRINGS[lang][node.dataset.i18n];
    if (value !== undefined) node.textContent = value;
  }
  for (const button of langButtons) {
    const active = button.dataset.lang === lang;
    button.classList.toggle('lang__button--active', active);
    button.setAttribute('aria-pressed', String(active));
  }
  if (langNav) langNav.setAttribute('aria-label', t('lang.label'));
  if (tabsNav) tabsNav.setAttribute('aria-label', t('tabs.label'));

  applyPageCopy();
  if (lastResult) showResult(lastResult.mode, lastResult.body);

  if (persist) {
    try {
      localStorage.setItem('lang', lang);
    } catch {
      // Private mode without storage still switches languages for this visit.
    }
  }
}

function setMode(next) {
  mode = next;
  for (const tab of tabs) {
    const active = tab.dataset.mode === next;
    tab.classList.toggle('tab--active', active);
    tab.setAttribute('aria-selected', String(active));
  }
  applyPageCopy();
  if (periodField) periodField.hidden = next !== 'forecast';
  if (partnerField) partnerField.hidden = next !== 'synastry';
  if (solarField) solarField.hidden = next !== 'solar';
  if (systemField) systemField.hidden = next === 'synastry' || next === 'solar';
  for (const block of chartOnlyBlocks) block.hidden = next !== 'chart';
  for (const input of partnerInputs) input.required = next === 'synastry';

  status.textContent = '';
  result.hidden = true;
}

for (const tab of tabs) tab.addEventListener('click', () => setMode(tab.dataset.mode));
for (const button of langButtons) button.addEventListener('click', () => applyLanguage(button.dataset.lang));

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

function renderWestern(container, western) {
  const card = element('section', 'card');
  card.append(element('h2', null, t('result.western')));
  const meta = element('p', 'card__meta', fill(t('result.westernMeta'), {
    sign: signName(signNameOf(western.ascendant)),
    degree: formatDegree(western.ascendant % 30),
  }));
  card.append(meta);

  const rows = western.planets.map((planet) => [
    planetName(planet.key),
    `${signName(planet.sign)} ${formatDegree(planet.degreeInSign)}${planet.retrograde ? ' R' : ''}`,
  ]);

  card.append(table([t('result.planetCol'), t('result.positionCol')], rows));
  card.append(element('p', 'card__meta', t('result.westernNote')));
  container.append(card);
}

function renderVedic(container, vedic) {
  const card = element('section', 'card');
  card.append(element('h2', null, t('result.vedic')));
  const meta = element('p', 'card__meta', fill(t('result.vedicMeta'), {
    ayanamsa: vedic.ayanamsa,
    value: vedic.ayanamsaValue,
    sign: signName(vedic.ascendantRashi),
  }));
  card.append(meta);

  const rows = vedic.planets.map((planet) => [
    planetName(planet.key),
    signName(planet.sign),
    `${planet.nakshatra} · ${t('result.pada')} ${planet.pada}`,
    String(vedic.houseOfPlanet[planet.key]),
  ]);

  card.append(table([
    t('result.planetCol'), t('result.rashiCol'), t('result.nakshatraCol'), t('result.houseCol'),
  ], rows));
  card.append(element('p', 'card__meta', t('result.vedicNote')));
  container.append(card);
}

function signNameOf(longitude) {
  return SIGN_ORDER[Math.floor(longitude / 30) % 12];
}

function renderReading(container, reading) {
  const card = element('section', 'card');
  card.append(element('h2', null, t('result.reading')));

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
  const signs = SIGN_ORDER.map((sign, index) => {
    const point = polar(index * 30 + 15, ascendant, 156);
    return { text: names().signShort[sign], x: point.x, y: point.y };
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
      text: names().planetShort[planet.key] || planet.key,
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
  card.append(element('h2', null, t('result.wheel')));
  card.append(element('p', 'card__meta', vedic
    ? t('result.wheelMetaVedic')
    : t('result.wheelMetaWestern')));

  const svg = svgNode('svg', {
    class: 'wheel',
    viewBox: '0 0 360 360',
    role: 'img',
    'aria-label': t('result.wheelAria'),
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
  card.append(element('p', 'card__meta', t('result.wheelNote')));
  container.append(card);
}

function render(chart) {
  result.replaceChildren();

  const header = element('section', 'card');
  const place = chart.place ? `${chart.place.name}, ${chart.place.country}` : chart.input.timeZone;
  header.append(element('h2', null, place));
  header.append(element('p', 'card__meta', `${t('result.utc')}: ${chart.utc.replace('T', ' ').slice(0, 16)} · JD ${chart.julianDay}`));
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
  return new Intl.DateTimeFormat(STRINGS[lang].locale, options).format(date);
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
    card.append(element('p', 'reading__text', t('result.noForecast')));
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
  header.append(element('h2', null, t('result.solarTitle')));
  const place = solar.place ? solar.place.name : '';
  const moment = `${formatDay(solar.local.date, true)}, ${solar.local.time}`;
  header.append(element('p', 'card__meta', [place, `${t('result.solarReturn')} ${moment}`].filter(Boolean).join(' · ')));
  header.append(element('p', 'reading__text', t('result.solarIntro')));
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
    header.append(element('p', 'score', `${synastry.reading.score.percent}${t('result.scoreSuffix')}`));
  }
  const places = [synastry.first.place, synastry.second.place]
    .filter(Boolean)
    .map((place) => place.name);
  header.append(element('p', 'card__meta', places.length === 2 ? places.join(t('result.and')) : t('result.twoCharts')));
  result.append(header);

  const card = element('section', 'card');
  if (!synastry.reading.items.length) {
    card.append(element('p', 'reading__text', t('result.noSynastry')));
  } else {
    const list = element('ul', 'reading__list');
    for (const item of synastry.reading.items) list.append(element('li', null, item));
    card.append(list);
  }
  card.append(element('p', 'card__meta', synastry.reading.note));
  result.append(card);
  result.hidden = false;
}

function showResult(kind, body) {
  lastResult = { mode: kind, body };
  if (kind === 'forecast') renderForecast(body);
  else if (kind === 'synastry') renderSynastry(body);
  else if (kind === 'solar') renderSolar(body);
  else render(body);
}

function savedLanguage() {
  try {
    const saved = localStorage.getItem('lang');
    if (saved && STRINGS[saved]) return saved;
  } catch {
    // Storage may be blocked; Russian stays the default.
  }
  return 'ru';
}

async function submitChart(event) {
  event.preventDefault();
  submitButton.disabled = true;
  status.textContent = t('status.calculating');
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
      status.textContent = t(`error.${body.error}`) === `error.${body.error}`
        ? t('error.calculation_failed')
        : t(`error.${body.error}`);
      return;
    }

    status.textContent = '';
    showResult(mode, body);
  } catch {
    status.textContent = t('status.offline');
  } finally {
    submitButton.disabled = false;
  }
}

if (hasDom) {
  applyLanguage(savedLanguage(), { persist: false });
  form.addEventListener('submit', submitChart);
}
