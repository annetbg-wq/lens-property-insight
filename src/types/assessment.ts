export type InputMethod = 'photo' | 'address' | 'coordinates' | 'url';
export type Goal = 'rent' | 'buy' | 'invest' | 'business';
export type Zone = 'green' | 'yellow' | 'red';
export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type Severity = 'low' | 'medium' | 'high';

export interface AssessmentInput {
  method: InputMethod;
  photos?: string[];
  address?: string;
  latitude?: number;
  longitude?: number;
  url?: string;
  goal: Goal;
  notes?: string;
}

export interface SubScores {
  risk: number;
  return: number;
  stability: number;
}

export interface EvidenceCard {
  title: string;
  description: string;
  isExample: boolean;
}

export interface Reason {
  title: string;
  description: string;
  evidence: EvidenceCard[];
}

export interface RedFlag {
  title: string;
  description: string;
  severity: Severity;
}

export interface NextStep {
  title: string;
  description: string;
}

export interface AgentContent {
  clientSummary: string;
  objectionKiller: string;
  questionsForSeller: string[];
}

export interface AgentInfo {
  name: string;
  phone: string;
  email: string;
  company: string;
  showOnShare: boolean;
}

export interface AssessmentResult {
  id: string;
  input: AssessmentInput;
  score: number;
  zone: Zone;
  subScores: SubScores;
  reasons: Reason[];
  redFlags: RedFlag[];
  nextSteps: NextStep[];
  confidence: ConfidenceLevel;
  agentContent: AgentContent;
  createdAt: string;
  displayName: string;
}
