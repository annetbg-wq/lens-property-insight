export type InputMethod = 'gps' | 'photo' | 'url' | 'manual';

export type PropertyType = 'apartment' | 'house' | 'land' | 'commercial';

export interface PropertyInput {
  method: InputMethod;
  latitude?: number;
  longitude?: number;
  photos?: File[];
  url?: string;
  address?: string;
  propertyType?: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  askingPrice?: number;
  notes?: string;
}

export interface Evaluation {
  id: string;
  user_id: string;
  input_method: string;
  input_data: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  results: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}
