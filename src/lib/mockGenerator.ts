import type {
  AssessmentInput, AssessmentResult, Reason, RedFlag, NextStep,
  EvidenceCard, AgentContent, Zone, ConfidenceLevel, SubScores
} from '@/types/assessment';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function pickN<T>(arr: T[], n: number, rng: () => number): T[] {
  const shuffled = [...arr].sort(() => rng() - 0.5);
  return shuffled.slice(0, n);
}

const REASON_POOL: Omit<Reason, 'evidence'>[] = [
  { title: "Сильные локационные фундаменталы", description: "Объект расположен в районе с развитой инфраструктурой, хорошей транспортной доступностью и высокой плотностью сервисов." },
  { title: "Благоприятная рыночная динамика", description: "Индикаторы локального рынка указывают на устойчивый спрос при ограниченном новом предложении в стадии строительства." },
  { title: "Потенциал арендной доходности", description: "Сопоставимые арендные ставки в районе показывают привлекательный cash-flow относительно стоимости приобретения." },
  { title: "Потенциал девелопмента", description: "Зонирование и градостроительные условия допускают повышение стоимости через реновацию или расширение." },
  { title: "Риск устаревшей инфраструктуры", description: "Инженерные системы и конструктивные элементы показывают признаки отложенного обслуживания, что может потребовать капитальных вложений." },
  { title: "Регуляторная сложность", description: "Местные нормативные акты, разрешения или ограничения зонирования добавляют уровни сложности к инвестиционному тезису." },
  { title: "Соответствие цены и ценности", description: "Запрашиваемая цена находится в диапазоне сопоставимых сделок, что указывает на справедливое рыночное позиционирование." },
  { title: "Траектория района", description: "Район демонстрирует ранние признаки позитивных демографических и коммерческих сдвигов." },
  { title: "Проблемы ликвидности", description: "Тип объекта и локация могут создать сложности при перепродаже в рамках типичного инвестиционного горизонта." },
  { title: "Стабильность денежного потока", description: "Исторические показатели заполняемости и условия аренды указывают на предсказуемую генерацию дохода." },
];

const EVIDENCE_POOL: Omit<EvidenceCard, 'isExample'>[] = [
  { title: "Тренд медианной цены", description: "Медианные цены продаж в районе выросли на 12% за последние 24 месяца." },
  { title: "Транспортный рейтинг", description: "Объект находится в 500м от крупного транспортного узла с ежедневным пассажиропотоком 45 000+." },
  { title: "Уровень вакантности", description: "Местный уровень вакантности составляет 3.2%, что значительно ниже среднего по городу 5.8%." },
  { title: "Арендный аналог", description: "Аналогичные юниты в доме сдаются за ₽180 000/мес, что даёт валовую доходность 5.2%." },
  { title: "Рост населения", description: "В почтовом индексе зафиксирован рост населения на 8% за последние 5 лет." },
  { title: "Строительный пайплайн", description: "В радиусе 2 км запланировано 2 300 новых юнитов, что может увеличить предложение на 15%." },
  { title: "Индекс криминогенности", description: "Индекс преступности в районе на 22% ниже среднегородского, что поддерживает стабильность стоимости." },
  { title: "Рейтинг школ", description: "Ближайшие школы имеют средний рейтинг 8/10, что является ключевым драйвером семейного спроса." },
  { title: "Экологический риск", description: "Район имеет умеренный рейтинг риска подтопления, что может повлиять на стоимость страхования." },
  { title: "Центр занятости", description: "В радиусе 3 км находится крупный деловой центр с 15 000+ рабочих мест." },
  { title: "Возраст здания", description: "Здание построено в 1985 году, капитальный ремонт не проводился с 2005 года." },
  { title: "Цена за кв.м.", description: "При ₽285 000/кв.м объект на 8% ниже медианы по району ₽310 000/кв.м." },
];

const RED_FLAG_POOL: RedFlag[] = [
  { title: "Отложенное обслуживание", description: "Видимые признаки износа HVAC, кровли или сантехники, ремонт может потребовать ₽1.5–5 млн.", severity: "high" },
  { title: "Зона подтопления", description: "Объект расположен в зоне или вблизи зоны риска подтопления, что может повлиять на страховые расходы.", severity: "medium" },
  { title: "Негативная демография", description: "Тренды населения и занятости в непосредственной близости показывают отрицательную динамику за 3 года.", severity: "high" },
  { title: "Риск избыточного предложения", description: "Несколько крупных ЖК в стадии строительства в радиусе 1 км могут размыть арендный спрос.", severity: "medium" },
  { title: "Юридическая сложность", description: "Публичные реестры указывают на возможные сервитуты, залоги или границовые споры.", severity: "high" },
  { title: "Ограниченные сопоставимые данные", description: "Мало недавних сделок с аналогичными объектами, что затрудняет точную оценку.", severity: "low" },
  { title: "Высокие коммунальные платежи", description: "Ежемесячные платежи за обслуживание выше 75-го перцентиля для аналогичных объектов.", severity: "low" },
  { title: "Шум и загрязнение", description: "Близость к магистралям, промзонам или аэропортам может повлиять на комфорт и перепродажу.", severity: "medium" },
];

const NEXT_STEP_POOL: NextStep[] = [
  { title: "Заказать профессиональную инспекцию", description: "Привлечь лицензированного инспектора для оценки конструктивных, инженерных систем и систем безопасности." },
  { title: "Верифицировать финансовые проекции", description: "Запросить реальные отчёты о доходах/расходах и сверить с рыночными аналогами." },
  { title: "Проверить зонирование и разрешения", description: "Подтвердить текущую классификацию зонирования и наличие/отсутствие нарушений." },
  { title: "Провести проверку правового титула", description: "Привлечь юриста для верификации чистоты собственности и выявления обременений." },
  { title: "Вести переговоры на основе результатов", description: "Использовать выявленные риски и потребности в ремонте как рычаг в ценовых переговорах." },
  { title: "Оценить варианты финансирования", description: "Сравнить условия ипотеки от нескольких банков для оптимизации структуры капитала." },
  { title: "Посетить в разное время", description: "Осмотреть объект утром, вечером и в выходные для оценки шума, трафика и активности района." },
  { title: "Получить котировки страхования", description: "Запросить предварительные котировки страхования для учёта в полной стоимости владения." },
];

const SELLER_QUESTIONS: string[] = [
  "Какова причина продажи и как давно объект на рынке?",
  "Есть ли известные дефекты, прошлые страховые случаи или ожидаемые начисления?",
  "Каковы текущие ежемесячные операционные расходы (коммуналка, налоги, обслуживание)?",
  "Проводился ли ремонт недавно, и есть ли документы на разрешения?",
  "Есть ли гибкость по запрашиваемой цене или срокам закрытия сделки?",
  "Какова текущая ситуация с арендой, есть ли долгосрочные договоры?",
  "Планируются ли инфраструктурные или девелоперские проекты поблизости?",
  "Какова история налоговых оценок и были ли обжалования?",
];

function getDisplayName(input: AssessmentInput): string {
  if (input.address) return input.address;
  if (input.url) {
    try {
      const u = new URL(input.url);
      return `Листинг ${u.hostname}`;
    } catch {
      return input.url.slice(0, 50);
    }
  }
  if (input.latitude !== undefined && input.longitude !== undefined) {
    return `${input.latitude.toFixed(4)}, ${input.longitude.toFixed(4)}`;
  }
  if (input.photos && input.photos.length > 0) {
    return `Анализ фото (${input.photos.length} изобр.)`;
  }
  return "Оценка объекта";
}

export function generateAssessment(input: AssessmentInput): AssessmentResult {
  const seedStr = JSON.stringify({
    method: input.method,
    address: input.address,
    url: input.url,
    lat: input.latitude,
    lng: input.longitude,
    goal: input.goal,
    notes: input.notes,
    photoCount: input.photos?.length ?? 0,
  });

  const seed = hashString(seedStr);
  const rng = seededRandom(seed);

  const score = Math.round(20 + rng() * 75);
  const zone: Zone = score >= 70 ? 'green' : score >= 45 ? 'yellow' : 'red';

  const riskBase = score >= 70 ? 20 + rng() * 30 : score >= 45 ? 40 + rng() * 30 : 60 + rng() * 30;
  const returnBase = score >= 70 ? 60 + rng() * 30 : score >= 45 ? 35 + rng() * 35 : 15 + rng() * 30;
  const stabilityBase = score >= 70 ? 55 + rng() * 35 : score >= 45 ? 30 + rng() * 40 : 10 + rng() * 35;

  const subScores: SubScores = {
    risk: Math.round(Math.min(100, Math.max(0, riskBase))),
    return: Math.round(Math.min(100, Math.max(0, returnBase))),
    stability: Math.round(Math.min(100, Math.max(0, stabilityBase))),
  };

  const reasonCount = 3 + Math.floor(rng() * 3);
  const selectedReasons = pickN(REASON_POOL, reasonCount, rng);
  const reasons: Reason[] = selectedReasons.map(r => ({
    ...r,
    evidence: pickN(EVIDENCE_POOL, 2 + Math.floor(rng() * 2), rng).map(e => ({ ...e, isExample: true })),
  }));

  const flagCount = zone === 'red' ? 3 + Math.floor(rng() * 2) : zone === 'yellow' ? 1 + Math.floor(rng() * 2) : Math.floor(rng() * 2);
  const redFlags = pickN(RED_FLAG_POOL, flagCount, rng);

  const stepCount = 3 + Math.floor(rng() * 3);
  const nextSteps = pickN(NEXT_STEP_POOL, stepCount, rng);

  const confidence: ConfidenceLevel = input.method === 'address' ? 'high' : input.method === 'url' ? 'medium' : 'low';

  const summaryTone = zone === 'green'
    ? "Этот объект представляет убедительную возможность с сильными фундаменталами. Локация, рыночная динамика и финансовые показатели хорошо согласуются с заявленными инвестиционными целями."
    : zone === 'yellow'
      ? "Объект обладает потенциалом, но сопряжён с заметными рисками. Рекомендуется тщательная проверка перед принятием решения."
      : "Объект несёт значительные факторы риска, требующие внимательной оценки. Рекомендуется действовать только при наличии чёткой стратегии митигации рисков.";

  const objection = zone === 'green'
    ? "Данные поддерживают сильный инвестиционный тезис. Рыночные тренды, сопоставимые сделки и локационные фундаменталы указывают на хорошо позиционированный актив."
    : zone === 'yellow'
      ? "Выявленные риски типичны для данного сегмента рынка. При грамотной проверке и переговорах профиль риск/доходность может быть оптимизирован."
      : "Риски реальны, но поддаются управлению. Рассмотрите значительное снижение цены с учётом премии за риск или структурируйте сделку с условиями.";

  const questionsForSeller = pickN(SELLER_QUESTIONS, 3 + Math.floor(rng() * 3), rng);

  const agentContent: AgentContent = {
    clientSummary: summaryTone,
    objectionKiller: objection,
    questionsForSeller,
  };

  const id = seed.toString(36) + Date.now().toString(36);

  return {
    id,
    input,
    score,
    zone,
    subScores,
    reasons,
    redFlags,
    nextSteps,
    confidence,
    agentContent,
    createdAt: new Date().toISOString(),
    displayName: getDisplayName(input),
  };
}
