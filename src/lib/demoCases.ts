import type { AssessmentInput } from '@/types/assessment';
import { generateAssessment } from './mockGenerator';
import type { AssessmentResult } from '@/types/assessment';

interface DemoCase {
  key: string;
  input: AssessmentInput;
}

const DEMO_CASES: DemoCase[] = [
  {
    key: 'apartment',
    input: {
      method: 'address',
      address: 'ул. Тверская 15, кв. 42, Москва, 125009',
      goal: 'invest',
      notes: '2-комнатная квартира в центре Москвы, видовой этаж, рядом с метро.',
    },
  },
  {
    key: 'house',
    input: {
      method: 'address',
      address: 'пос. Барвиха, ул. Сосновая 8, Московская область',
      goal: 'buy',
      notes: 'Загородный дом 250 кв.м, 4 спальни, участок 15 соток, лес рядом.',
    },
  },
  {
    key: 'land',
    input: {
      method: 'coordinates',
      latitude: 55.7558,
      longitude: 37.6173,
      goal: 'invest',
      notes: 'Земельный участок 0.5 га вблизи МКАД, зонирование под смешанную застройку.',
    },
  },
  {
    key: 'commercial',
    input: {
      method: 'address',
      address: 'Невский проспект 100, Санкт-Петербург, 191025',
      goal: 'business',
      notes: 'Торговое помещение 300 кв.м на первой линии, высокий пешеходный трафик.',
    },
  },
  {
    key: 'view',
    input: {
      method: 'photo',
      photos: ['demo_window_view.jpg'],
      goal: 'rent',
      notes: 'Оценка квартиры по виду из окна. 12 этаж, вид на набережную, западная сторона.',
    },
  },
  {
    key: 'listing',
    input: {
      method: 'url',
      url: 'https://cian.ru/sale/flat/298745123/',
      goal: 'invest',
      notes: 'Квартира в сталинке на Кутузовском, 85 кв.м, требует косметического ремонта.',
    },
  },
];

export function getDemoInput(key: string): AssessmentInput | null {
  const demo = DEMO_CASES.find(d => d.key === key);
  return demo?.input ?? null;
}

export function getDemoResult(key: string): AssessmentResult | null {
  const input = getDemoInput(key);
  if (!input) return null;
  return generateAssessment(input);
}

export function getAllDemoKeys(): string[] {
  return DEMO_CASES.map(d => d.key);
}
