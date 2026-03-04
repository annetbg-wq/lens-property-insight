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
      address: '350 West 42nd Street, Apt 12F, New York, NY 10036',
      goal: 'invest',
      notes: 'Looking at a 2BR luxury apartment in Midtown Manhattan with Hudson River views.',
    },
  },
  {
    key: 'house',
    input: {
      method: 'address',
      address: '4521 Cedar Lane, Austin, TX 78745',
      goal: 'buy',
      notes: 'Suburban family home, 4BR/3BA, recently renovated kitchen, good school district.',
    },
  },
  {
    key: 'land',
    input: {
      method: 'coordinates',
      latitude: 34.0522,
      longitude: -118.2437,
      goal: 'invest',
      notes: 'Vacant lot near downtown, zoned for mixed-use development. 0.5 acres.',
    },
  },
  {
    key: 'commercial',
    input: {
      method: 'address',
      address: '1200 Woodward Avenue, Detroit, MI 48226',
      goal: 'business',
      notes: 'Former retail space, 5,000 sqft, ground floor in revitalizing downtown corridor.',
    },
  },
  {
    key: 'view',
    input: {
      method: 'photo',
      photos: ['demo_window_view.jpg'],
      goal: 'rent',
      notes: 'Evaluating apartment based on the view from the 8th floor. Coastal city, balcony facing west.',
    },
  },
  {
    key: 'listing',
    input: {
      method: 'url',
      url: 'https://zillow.com/homedetails/925-Pacific-Ave-San-Francisco-CA-94133/15063422_zpid/',
      goal: 'invest',
      notes: 'San Francisco Victorian, listed at $1.2M, needs moderate renovation.',
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
