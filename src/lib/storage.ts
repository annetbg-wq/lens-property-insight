import type { AssessmentResult, AgentInfo } from '@/types/assessment';

const ASSESSMENTS_KEY = 'propa_assessments';
const AGENT_KEY = 'propa_agent';

export function saveAssessment(result: AssessmentResult): void {
  const all = getAllAssessments();
  all[result.id] = result;
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(all));
}

export function getAssessment(id: string): AssessmentResult | null {
  const all = getAllAssessments();
  return all[id] ?? null;
}

export function getAllAssessments(): Record<string, AssessmentResult> {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, AssessmentResult>;
  } catch {
    return {};
  }
}

export function getAllAssessmentsList(): AssessmentResult[] {
  const map = getAllAssessments();
  return Object.values(map).sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function deleteAssessment(id: string): void {
  const all = getAllAssessments();
  delete all[id];
  localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(all));
}

export function getAgentInfo(): AgentInfo {
  try {
    const raw = localStorage.getItem(AGENT_KEY);
    if (raw) return JSON.parse(raw) as AgentInfo;
  } catch { /* empty */ }
  return { name: '', phone: '', email: '', company: '', showOnShare: false };
}

export function saveAgentInfo(info: AgentInfo): void {
  localStorage.setItem(AGENT_KEY, JSON.stringify(info));
}
