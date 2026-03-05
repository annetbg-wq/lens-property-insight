import { useState, useEffect, useMemo } from 'react';
import { generateAssessment } from '@/lib/mockGenerator';
import type { AssessmentInput, AssessmentResult, Goal } from '@/types/assessment';

interface GeoRegion {
  id: string;
  name: string;
  lat: number;
  lng: number;
  currency: string;
  properties: {
    address: string;
    goal: Goal;
    notes: string;
    priceUSD: number;
    priceEUR: number;
    dealType: string;
    emoji: string;
  }[];
}

const REGIONS: GeoRegion[] = [
  {
    id: 'moscow',
    name: 'Москва',
    lat: 55.7558,
    lng: 37.6173,
    currency: 'RUB',
    properties: [
      { address: 'ул. Тверская 15, кв. 42, Москва', goal: 'invest', notes: '2-комнатная, видовой этаж, м. Тверская', priceUSD: 320_000, priceEUR: 295_000, dealType: 'Продажа', emoji: '🏢' },
      { address: 'пос. Барвиха, ул. Сосновая 8, МО', goal: 'buy', notes: 'Дом 250 кв.м, 15 соток, лес', priceUSD: 1_200_000, priceEUR: 1_105_000, dealType: 'Продажа', emoji: '🏡' },
      { address: 'Невский пр. 100, Санкт-Петербург', goal: 'business', notes: 'Торговое 300 кв.м, 1-я линия', priceUSD: 890_000, priceEUR: 820_000, dealType: 'Продажа', emoji: '🏬' },
    ],
  },
  {
    id: 'bali',
    name: 'Bali',
    lat: -8.4095,
    lng: 115.1889,
    currency: 'IDR',
    properties: [
      { address: 'Jl. Pantai Berawa, Canggu, Bali', goal: 'invest', notes: 'Villa 3BR, pool, 200m to beach', priceUSD: 285_000, priceEUR: 262_000, dealType: 'Leasehold 25y', emoji: '🏝️' },
      { address: 'Jl. Raya Ubud, Gianyar, Bali', goal: 'rent', notes: 'Boutique villa, rice field view', priceUSD: 1_800, priceEUR: 1_660, dealType: 'Аренда/мес', emoji: '🌿' },
      { address: 'Jl. Sunset Road, Seminyak, Bali', goal: 'business', notes: 'Retail space 150 sqm, tourist area', priceUSD: 420_000, priceEUR: 387_000, dealType: 'Leasehold 30y', emoji: '🏪' },
    ],
  },
  {
    id: 'dubai',
    name: 'Dubai',
    lat: 25.2048,
    lng: 55.2708,
    currency: 'AED',
    properties: [
      { address: 'Dubai Marina, Tower A, Apt 3204', goal: 'invest', notes: '2BR, sea view, 110 sqm', priceUSD: 520_000, priceEUR: 479_000, dealType: 'Freehold', emoji: '🏙️' },
      { address: 'Palm Jumeirah, Frond N, Villa 12', goal: 'buy', notes: '5BR villa, private beach', priceUSD: 3_500_000, priceEUR: 3_225_000, dealType: 'Freehold', emoji: '🏖️' },
      { address: 'Business Bay, Churchill Tower, 1801', goal: 'rent', notes: 'Office 85 sqm, fitted', priceUSD: 3_200, priceEUR: 2_950, dealType: 'Аренда/мес', emoji: '🏢' },
    ],
  },
  {
    id: 'london',
    name: 'London',
    lat: 51.5074,
    lng: -0.1278,
    currency: 'GBP',
    properties: [
      { address: 'Kensington High St 42, London W8', goal: 'invest', notes: '2BR flat, period conversion, 75 sqm', priceUSD: 890_000, priceEUR: 820_000, dealType: 'Sale', emoji: '🏠' },
      { address: 'Canary Wharf, One Canada Sq, 2205', goal: 'rent', notes: '1BR, river view, furnished', priceUSD: 2_800, priceEUR: 2_580, dealType: 'Аренда/мес', emoji: '🏢' },
      { address: 'Shoreditch, Redchurch St 15', goal: 'business', notes: 'Retail unit, 120 sqm, high footfall', priceUSD: 1_200_000, priceEUR: 1_105_000, dealType: 'Leasehold', emoji: '🏬' },
    ],
  },
  {
    id: 'nyc',
    name: 'New York',
    lat: 40.7128,
    lng: -74.0060,
    currency: 'USD',
    properties: [
      { address: '350 5th Ave, Apt 45B, Manhattan', goal: 'invest', notes: '1BR condo, Empire State views', priceUSD: 1_150_000, priceEUR: 1_060_000, dealType: 'Sale', emoji: '🗽' },
      { address: '200 Water St, DUMBO, Brooklyn', goal: 'rent', notes: 'Loft 95 sqm, bridge views', priceUSD: 4_500, priceEUR: 4_150, dealType: 'Аренда/мес', emoji: '🌉' },
      { address: '55 Hudson Yards, Unit 3301', goal: 'buy', notes: '3BR, 180 sqm, high floor', priceUSD: 4_200_000, priceEUR: 3_870_000, dealType: 'Sale', emoji: '🏙️' },
    ],
  },
  {
    id: 'bangkok',
    name: 'Bangkok',
    lat: 13.7563,
    lng: 100.5018,
    currency: 'THB',
    properties: [
      { address: 'Sukhumvit Soi 24, Phrom Phong', goal: 'invest', notes: 'Condo 2BR, 65 sqm, BTS access', priceUSD: 185_000, priceEUR: 170_000, dealType: 'Freehold', emoji: '🏢' },
      { address: 'Silom Rd, Sathorn, Bangkok', goal: 'business', notes: 'Office 200 sqm, CBD location', priceUSD: 5_200, priceEUR: 4_790, dealType: 'Аренда/мес', emoji: '🏬' },
      { address: 'Thonglor, Soi 13, Bangkok', goal: 'rent', notes: 'House 4BR, garden, 250 sqm', priceUSD: 3_800, priceEUR: 3_500, dealType: 'Аренда/мес', emoji: '🏡' },
    ],
  },
];

const DEFAULT_REGION = REGIONS[0];

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findClosestRegion(lat: number, lng: number): GeoRegion {
  let closest = REGIONS[0];
  let minDist = Infinity;
  for (const region of REGIONS) {
    const d = getDistance(lat, lng, region.lat, region.lng);
    if (d < minDist) { minDist = d; closest = region; }
  }
  return closest;
}

export interface GeoProperty {
  result: AssessmentResult;
  priceUSD: number;
  priceEUR: number;
  dealType: string;
  emoji: string;
}

export interface UseGeoPropertiesReturn {
  properties: GeoProperty[];
  regionName: string;
  loading: boolean;
  error: string | null;
  userLat: number | null;
  userLng: number | null;
}

async function getLocationByIP(): Promise<{ lat: number; lng: number } | null> {
  try {
    // Try multiple free IP geolocation services
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data.latitude && data.longitude) {
        return { lat: data.latitude, lng: data.longitude };
      }
    }
  } catch {
    // fallback
  }
  try {
    const res = await fetch('https://ip-api.com/json/?fields=lat,lon', { signal: AbortSignal.timeout(5000) });
    if (res.ok) {
      const data = await res.json();
      if (data.lat && data.lon) {
        return { lat: data.lat, lng: data.lon };
      }
    }
  } catch {
    // fallback
  }
  return null;
}

export function useGeoProperties(): UseGeoPropertiesReturn {
  const [userLat, setUserLat] = useState<number | null>(null);
  const [userLng, setUserLng] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function detectLocation() {
      // Try browser geolocation first
      if (navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false,
              timeout: 5000,
            });
          });
          if (!cancelled) {
            setUserLat(pos.coords.latitude);
            setUserLng(pos.coords.longitude);
            setLoading(false);
            return;
          }
        } catch {
          // Browser geo failed, try IP
        }
      }

      // Fallback: IP-based geolocation
      const ipLoc = await getLocationByIP();
      if (!cancelled) {
        if (ipLoc) {
          setUserLat(ipLoc.lat);
          setUserLng(ipLoc.lng);
        } else {
          setError('Could not detect location');
        }
        setLoading(false);
      }
    }

    detectLocation();
    return () => { cancelled = true; };
  }, []);

  const region = useMemo(() => {
    if (userLat !== null && userLng !== null) {
      return findClosestRegion(userLat, userLng);
    }
    return DEFAULT_REGION;
  }, [userLat, userLng]);

  const properties = useMemo<GeoProperty[]>(() => {
    return region.properties.map(p => {
      const input: AssessmentInput = {
        method: 'address',
        address: p.address,
        goal: p.goal,
        notes: p.notes,
      };
      return {
        result: generateAssessment(input),
        priceUSD: p.priceUSD,
        priceEUR: p.priceEUR,
        dealType: p.dealType,
        emoji: p.emoji,
      };
    });
  }, [region]);

  return { properties, regionName: region.name, loading, error, userLat, userLng };
}
