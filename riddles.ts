export interface Riddle {
  id: number; // original reference number 1..27 from user prompt
  letter: string; // Spanish alphabet letter: A to Z (including Ñ)
  letterRule: 'starts' | 'contains';
  letterDisplay: string; // e.g. "Empieza por la A" or "Contiene la B"
  spanishQuestion: string;
  russianQuestion: string;
  spanishAnswer: string;
  russianAnswer: string;
  acceptedAnswers: string[];
  vocabularyNotes?: string;
}

// 27 Riddles mapped in STRICT ALPHABETICAL ORDER:
// A, B, C, D, E, F, G, H, I, J, K, L, M, N, Ñ, O, P, Q, R, S, T, U, V, W, X, Y, Z
export const RIDDLES: Riddle[] = [
  {
    id: 7,
    letter: 'A',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la A',
    spanishQuestion: 'Soy transparente y me beben todos los días. Sin mí es difícil vivir. ¿Qué soy?',
    russianQuestion: 'Я прозрачная, меня пьют каждый день. Без меня трудно жить. Что я?',
    spanishAnswer: 'El agua',
    russianAnswer: 'Вода',
    acceptedAnswers: ['agua', 'el agua', 'un agua', 'la agua'],
    vocabularyNotes: 'transparente = прозрачная; me beben = меня пьют; todos los días = каждый день; sin mí = без меня; difícil vivir = трудно жить'
  },
  {
    id: 3,
    letter: 'B',
    letterRule: 'contains',
    letterDisplay: 'Contiene la B (li-B-ro)',
    spanishQuestion: 'Tengo muchas páginas, pero no soy un árbol. Dentro de mí hay historias. ¿Qué soy?',
    russianQuestion: 'У меня много страниц, но я не дерево. Внутри меня есть истории. Что я?',
    spanishAnswer: 'El libro',
    russianAnswer: 'Книга',
    acceptedAnswers: ['libro', 'el libro', 'un libro'],
    vocabularyNotes: 'páginas = страницы; árbol = дерево; dentro de mí = внутри меня; historias = истории'
  },
  {
    id: 9,
    letter: 'C',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la C',
    spanishQuestion: 'Tengo ruedas, puertas y volante. Voy por la carretera. ¿Qué soy?',
    russianQuestion: 'У меня есть колёса, двери и руль. Я езжу по дороге. Что я?',
    spanishAnswer: 'El coche',
    russianAnswer: 'Машина',
    acceptedAnswers: ['coche', 'el coche', 'un coche', 'auto', 'el auto', 'carro', 'el carro', 'automovil', 'automóvil', 'el automóvil'],
    vocabularyNotes: 'ruedas = колёса; puertas = двери; volante = руль; carretera = шоссе, дорога'
  },
  {
    id: 19,
    letter: 'D',
    letterRule: 'contains',
    letterDisplay: 'Contiene la D (pue-D-o / cerra-D-a)',
    spanishQuestion: 'Puedo estar abierta o cerrada. Por mí entran y salen. ¿Qué soy?',
    russianQuestion: 'Я могу быть открытой или закрытой. Через меня входят и выходят. Что я?',
    spanishAnswer: 'La puerta',
    russianAnswer: 'Дверь',
    acceptedAnswers: ['puerta', 'la puerta', 'una puerta'],
    vocabularyNotes: 'abierta = открытая; cerrada = закрытая; entran y salen = входят и выходят'
  },
  {
    id: 4,
    letter: 'E',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la E',
    spanishQuestion: 'Te muestro, pero no digo nada. ¿Qué soy?',
    russianQuestion: 'Я показываю тебя, но ничего не говорю. Что я?',
    spanishAnswer: 'El espejo',
    russianAnswer: 'Зеркало',
    acceptedAnswers: ['espejo', 'el espejo', 'un espejo'],
    vocabularyNotes: 'te muestro = показываю тебя; no digo nada = ничего не говорю (от decir)'
  },
  {
    id: 10,
    letter: 'F',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la F (o N)',
    spanishQuestion: 'Vivo en la cocina y siempre estoy frío por dentro. ¿Qué soy?',
    russianQuestion: 'Я живу на кухне и всегда холодный внутри. Что я?',
    spanishAnswer: 'El frigorífico / La nevera',
    russianAnswer: 'Холодильник',
    acceptedAnswers: ['frigorifico', 'frigorífico', 'el frigorifico', 'el frigorífico', 'nevera', 'la nevera', 'una nevera', 'refrigerador', 'el refrigerador'],
    vocabularyNotes: 'cocina = кухня; siempre = всегда; frío = холодный; por dentro = внутри'
  },
  {
    id: 18,
    letter: 'G',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la G',
    spanishQuestion: 'Vivo en casa, digo «miau» y me gusta dormir. ¿Qué soy?',
    russianQuestion: 'Я живу дома, говорю «мяу» и люблю спать. Что я?',
    spanishAnswer: 'El gato / La gata',
    russianAnswer: 'Кошка / Кот',
    acceptedAnswers: ['gato', 'el gato', 'un gato', 'gata', 'la gata', 'una gata'],
    vocabularyNotes: 'casa = дом; digo = говорю (decir); me gusta dormir = люблю спать'
  },
  {
    id: 23,
    letter: 'H',
    letterRule: 'contains',
    letterDisplay: 'Contiene la H (almo-H-ada)',
    spanishQuestion: 'Soy blanda, estoy en la cama y pones la cabeza sobre mí. ¿Qué soy?',
    russianQuestion: 'Я мягкая, лежу на кровати, и ты кладёшь на меня голову. Что я?',
    spanishAnswer: 'La almohada',
    russianAnswer: 'Подушка',
    acceptedAnswers: ['almohada', 'la almohada', 'una almohada'],
    vocabularyNotes: 'blanda = мягкая; cama = кровать; pones la cabeza = кладёшь голову; sobre mí = на меня'
  },
  {
    id: 24,
    letter: 'I',
    letterRule: 'contains',
    letterDisplay: 'Contiene la I (pe-I-ne)',
    spanishQuestion: 'Tengo dientes, pero no muerdo. Me usan para el pelo. ¿Qué soy?',
    russianQuestion: 'У меня есть зубы, но я не кусаю. Меня используют для волос. Что я?',
    spanishAnswer: 'El peine',
    russianAnswer: 'Расчёска',
    acceptedAnswers: ['peine', 'el peine', 'un peine'],
    vocabularyNotes: 'dientes = зубы; no muerdo = не кусаю (morder); para el pelo = для волос'
  },
  {
    id: 17,
    letter: 'J',
    letterRule: 'contains',
    letterDisplay: 'Contiene la J (pá-J-aro)',
    spanishQuestion: 'Tengo alas, puedo volar y canto por la mañana. ¿Qué soy?',
    russianQuestion: 'У меня есть крылья, я умею летать и пою утром. Что я?',
    spanishAnswer: 'El pájaro',
    russianAnswer: 'Птица',
    acceptedAnswers: ['pajaro', 'pájaro', 'el pajaro', 'el pájaro', 'un pajaro', 'un pájaro', 'ave', 'el ave'],
    vocabularyNotes: 'alas = крылья; volar = летать; canto = пою (cantar); por la mañana = утром'
  },
  {
    id: 25,
    letter: 'K',
    letterRule: 'contains',
    letterDisplay: 'Contiene sonido K / El cine (Кинотеатр)',
    spanishQuestion: 'Muestro películas en una pantalla grande. La gente compra una entrada y viene aquí. ¿Qué es?',
    russianQuestion: 'Я показываю фильмы на большом экране. Люди покупают билет и приходят ко мне. Что это?',
    spanishAnswer: 'El cine',
    russianAnswer: 'Кинотеатр',
    acceptedAnswers: ['cine', 'el cine', 'un cine', 'kino', 'cinema'],
    vocabularyNotes: 'muestro películas = показываю фильмы; pantalla grande = большой экран; la gente = люди; entrada = входной билет'
  },
  {
    id: 22,
    letter: 'L',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la L',
    spanishQuestion: 'Me necesitas cuando está oscuro. Doy luz. ¿Qué soy?',
    russianQuestion: 'Я нужен, когда темно. Я даю свет. Что я?',
    spanishAnswer: 'La lámpara',
    russianAnswer: 'Лампа',
    acceptedAnswers: ['lampara', 'lámpara', 'la lampara', 'la lámpara', 'una lampara', 'una lámpara'],
    vocabularyNotes: 'me necesitas = я тебе нужен; oscuro = темно; doy luz = даю свет (dar)'
  },
  {
    id: 1,
    letter: 'M',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la M',
    spanishQuestion: 'Tengo cuatro patas, pero no puedo caminar. Sobre mí se come y se escribe. ¿Qué soy?',
    russianQuestion: 'У меня четыре ноги, но я не умею ходить. На мне едят и пишут. Что я?',
    spanishAnswer: 'La mesa',
    russianAnswer: 'Стол',
    acceptedAnswers: ['mesa', 'la mesa', 'una mesa'],
    vocabularyNotes: 'cuatro patas = четыре ножки; no puedo caminar = не могу ходить; sobre mí = на мне; se come y se escribe = едят и пишут'
  },
  {
    id: 14,
    letter: 'N',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la N',
    spanishQuestion: 'Soy blanco y frío. En invierno caigo del cielo. ¿Qué soy?',
    russianQuestion: 'Я белый и холодный. Зимой падаю с неба. Что я?',
    spanishAnswer: 'La nieve',
    russianAnswer: 'Снег',
    acceptedAnswers: ['nieve', 'la nieve', 'una nieve'],
    vocabularyNotes: 'blanco = белый; frío = холодный; en invierno = зимой; caigo = падаю (caer); cielo = небо'
  },
  {
    id: 12,
    letter: 'Ñ',
    letterRule: 'contains',
    letterDisplay: 'Contiene la Ñ / N (ma-N-zana)',
    spanishQuestion: 'Puedo ser roja, verde o amarilla. Crezco en un árbol. ¿Qué soy?',
    russianQuestion: 'Я могу быть красным, зелёным или жёлтым. Я расту на дереве. Что я?',
    spanishAnswer: 'La manzana',
    russianAnswer: 'Яблоко',
    acceptedAnswers: ['manzana', 'la manzana', 'una manzana'],
    vocabularyNotes: 'roja = красная; verde = зелёная; amarilla = жёлтая; crezco = расту (crecer); árbol = дерево'
  },
  {
    id: 20,
    letter: 'O',
    letterRule: 'contains',
    letterDisplay: 'Contiene la O (per-O, c-O-ches / El mapa)',
    spanishQuestion: 'Tengo ciudades, pero no casas; ríos, pero no agua; carreteras, pero no coches. ¿Qué soy?',
    russianQuestion: 'У меня есть города, но нет домов; есть реки, но нет воды; есть дороги, но нет машин. Что я?',
    spanishAnswer: 'El mapa',
    russianAnswer: 'Карта',
    acceptedAnswers: ['mapa', 'el mapa', 'un mapa'],
    vocabularyNotes: 'ciudades = города; casas = дома; ríos = реки; carreteras = дороги; coches = машины'
  },
  {
    id: 16,
    letter: 'P',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la P',
    spanishQuestion: 'Vivo en el mar, sé nadar, pero no sé caminar. ¿Qué soy?',
    russianQuestion: 'Я живу в море, умею плавать, но не умею ходить. Что я?',
    spanishAnswer: 'El pez',
    russianAnswer: 'Рыба',
    acceptedAnswers: ['pez', 'el pez', 'un pez', 'pescado', 'el pescado'],
    vocabularyNotes: 'mar = море; sé nadar = умею плавать (saber); caminar = ходить пешком'
  },
  {
    id: 2,
    letter: 'Q',
    letterRule: 'contains',
    letterDisplay: 'Contiene la Q (pe-Q-ueño / La llave)',
    spanishQuestion: 'Soy pequeño, pero puedo abrir una puerta grande. ¿Qué soy?',
    russianQuestion: 'Я маленький, но могу открыть большую дверь. Что я?',
    spanishAnswer: 'La llave',
    russianAnswer: 'Ключ',
    acceptedAnswers: ['llave', 'la llave', 'una llave'],
    vocabularyNotes: 'pequeño = маленький; abrir = открывать; puerta grande = большая дверь'
  },
  {
    id: 6,
    letter: 'R',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la R',
    spanishQuestion: 'Tengo cara y agujas, pero no tengo ojos. ¿Qué soy?',
    russianQuestion: 'У меня есть лицо и стрелки, но нет глаз. Что я?',
    spanishAnswer: 'El reloj',
    russianAnswer: 'Часы',
    acceptedAnswers: ['reloj', 'el reloj', 'un reloj'],
    vocabularyNotes: 'cara = лицо (циферблат); agujas = стрелки (букв. иголки); ojos = глаза'
  },
  {
    id: 26,
    letter: 'S',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la S',
    spanishQuestion: 'Aquí puedes comprar pan, leche, verduras y muchas cosas más. ¿Qué es?',
    russianQuestion: 'Здесь можно купить хлеб, молоко, овощи и многое другое. Что это?',
    spanishAnswer: 'El supermercado',
    russianAnswer: 'Супермаркет',
    acceptedAnswers: ['supermercado', 'el supermercado', 'un supermercado', 'super', 'el super'],
    vocabularyNotes: 'puedes comprar = можешь купить; pan = хлеб; leche = молоко; verduras = овощи; muchas cosas más = многое другое'
  },
  {
    id: 13,
    letter: 'T',
    letterRule: 'starts',
    letterDisplay: 'Empieza por la T',
    spanishQuestion: 'Sueno, pero no tengo voz. Conmigo puedes hablar con otras personas. ¿Qué soy?',
    russianQuestion: 'Я звоню, но у меня нет голоса. Через меня можно разговаривать с людьми. Что я?',
    spanishAnswer: 'El teléfono',
    russianAnswer: 'Телефон',
    acceptedAnswers: ['telefono', 'teléfono', 'el telefono', 'el teléfono', 'un telefono', 'un teléfono', 'movil', 'móvil', 'el móvil'],
    vocabularyNotes: 'sueno = звучу / звоню (sonar); voz = голос; conmigo = со мной; hablar = говорить'
  },
  {
    id: 15,
    letter: 'U',
    letterRule: 'contains',
    letterDisplay: 'Contiene la U (ll-U-via)',
    spanishQuestion: 'Soy húmeda, caigo del cielo, pero no soy nieve. ¿Qué soy?',
    russianQuestion: 'Я мокрый, падаю с неба, но я не снег. Что я?',
    spanishAnswer: 'La lluvia',
    russianAnswer: 'Дождь',
    acceptedAnswers: ['lluvia', 'la lluvia', 'una lluvia'],
    vocabularyNotes: 'húmeda = влажная, мокрая; caigo = падаю; pero = но'
  },
  {
    id: 8,
    letter: 'V',
    letterRule: 'contains',
    letterDisplay: 'Contiene la V (a-V-ión)',
    spanishQuestion: 'Vuelo, pero no soy un pájaro. Llevo personas de un país a otro. ¿Qué soy?',
    russianQuestion: 'Я летаю, но я не птица. Я перевожу людей из одной страны в другую. Что я?',
    spanishAnswer: 'El avión',
    russianAnswer: 'Самолёт',
    acceptedAnswers: ['avion', 'avión', 'el avion', 'el avión', 'un avion', 'un avión'],
    vocabularyNotes: 'vuelo = летаю (от volar); pájaro = птица; llevo = везу / перевожу (от llevar); país = страна'
  },
  {
    id: 21,
    letter: 'W',
    letterRule: 'contains',
    letterDisplay: 'Contiene sonido Water / El paraguas',
    spanishQuestion: 'Me usas cuando llueve. Te protejo del agua. ¿Qué soy?',
    russianQuestion: 'Меня используют, когда идёт дождь. Я защищаю тебя от воды. Что я?',
    spanishAnswer: 'El paraguas',
    russianAnswer: 'Зонт',
    acceptedAnswers: ['paraguas', 'el paraguas', 'un paraguas'],
    vocabularyNotes: 'usas = используешь; cuando llueve = когда идет дождь; te protejo = защищаю тебя (proteger)'
  },
  {
    id: 27,
    letter: 'X',
    letterRule: 'contains',
    letterDisplay: 'Contiene la X (é-X-ito / El zapato)',
    spanishQuestion: 'Tengo lengua, pero no sé hablar. Me ponen en el pie. ¿Qué soy?',
    russianQuestion: 'У меня есть язык, но я не умею говорить. Меня надевают на ногу. Что я?',
    spanishAnswer: 'El zapato / Botín',
    russianAnswer: 'Ботинок / обувь',
    acceptedAnswers: [
      'zapato', 'el zapato', 'un zapato', 
      'botin', 'botín', 'el botin', 'el botín', 'un botin', 'un botín',
      'bota', 'la bota', 'una bota',
      'calzado', 'el calzado'
    ],
    vocabularyNotes: 'tengo lengua = у меня есть язык (язычок обуви); no sé hablar = не умею говорить; en el pie = на ногу/ступню'
  },
  {
    id: 11,
    letter: 'Y',
    letterRule: 'contains',
    letterDisplay: 'Contiene la Y (ayuda a caminar / Los zapatos)',
    spanishQuestion: 'Me ponen en los pies antes de salir de casa. ¿Qué soy?',
    russianQuestion: 'Меня надевают на ноги перед выходом из дома. Что я?',
    spanishAnswer: 'Los zapatos',
    russianAnswer: 'Обувь',
    acceptedAnswers: ['zapatos', 'los zapatos', 'unos zapatos', 'zapato', 'el zapato', 'calzado', 'el calzado'],
    vocabularyNotes: 'me ponen = меня надевают; pies = ступни, ноги; antes de salir = перед выходом'
  },
  {
    id: 5,
    letter: 'Z',
    letterRule: 'contains',
    letterDisplay: 'Contiene la Z (lápi-Z)',
    spanishQuestion: 'Cuanto más me usan, más corto me hago. ¿Qué soy?',
    russianQuestion: 'Чем больше меня используют, тем короче я становлюсь. Что я?',
    spanishAnswer: 'El lápiz',
    russianAnswer: 'Карандаш',
    acceptedAnswers: ['lapiz', 'lápiz', 'el lapiz', 'el lápiz', 'un lapiz', 'un lápiz'],
    vocabularyNotes: 'cuanto más... más... = чем больше... тем...; usan = используют; corto = короткий; me hago = становлюсь'
  }
];

export type RiddleStatus = 'pending' | 'correct' | 'wrong' | 'passed';

export function normalizeAnswer(str: string): string {
  return str
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents: á -> a, é -> e, etc.
    .replace(/[^a-z0-9ñ]/g, ''); // keep alphanumeric and ñ
}

export function checkAnswerMatch(userInput: string, riddle: Riddle): boolean {
  const normUser = normalizeAnswer(userInput);
  if (!normUser) return false;

  for (const acc of riddle.acceptedAnswers) {
    if (normalizeAnswer(acc) === normUser) return true;
  }

  // Also check without common articles if user typed with/without article
  const withoutArticles = normUser.replace(/^(el|la|los|las|un|una|unos|unas)/, '');
  if (withoutArticles.length >= 2) {
    for (const acc of riddle.acceptedAnswers) {
      const normAccWithout = normalizeAnswer(acc).replace(/^(el|la|los|las|un|una|unos|unas)/, '');
      if (normAccWithout === withoutArticles) return true;
    }
  }

  return false;
}
