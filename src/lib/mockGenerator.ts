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
  { title: "Strong Location Fundamentals", description: "The property is situated in an area with above-average infrastructure, transit access, and amenities density." },
  { title: "Favorable Market Dynamics", description: "Local market indicators suggest sustained demand with limited new supply in the pipeline." },
  { title: "Rental Yield Potential", description: "Comparable rental rates in the area indicate attractive cash-flow potential relative to acquisition cost." },
  { title: "Development Upside", description: "Zoning and planning conditions allow for potential value-add through renovation or expansion." },
  { title: "Aging Infrastructure Risk", description: "Building systems and structural elements show signs of deferred maintenance that may require capital expenditure." },
  { title: "Regulatory Complexity", description: "Local regulations, permits, or zoning restrictions add layers of complexity to the investment thesis." },
  { title: "Price-to-Value Alignment", description: "The asking price is within range of comparable transactions, indicating fair market positioning." },
  { title: "Neighborhood Trajectory", description: "The neighborhood is showing early signs of positive demographic and commercial shifts." },
  { title: "Liquidity Concerns", description: "The property type and location may present challenges for resale within a typical investment horizon." },
  { title: "Cash Flow Stability", description: "Historical occupancy rates and lease structures suggest predictable income generation." },
];

const EVIDENCE_POOL: Omit<EvidenceCard, 'isExample'>[] = [
  { title: "Median Price Trend", description: "Median sale prices in the area have increased 12% over the past 24 months." },
  { title: "Transit Score", description: "Property is within 500m of a major transit hub with daily ridership of 45,000+." },
  { title: "Vacancy Rate", description: "Local vacancy rate stands at 3.2%, well below the metropolitan average of 5.8%." },
  { title: "Rental Comparable", description: "Similar units in the building achieve $2,400/month, suggesting a 5.2% gross yield." },
  { title: "Population Growth", description: "The postal code has seen 8% population growth in the last 5 years." },
  { title: "Construction Pipeline", description: "2,300 new units are planned within 2km, potentially increasing supply by 15%." },
  { title: "Crime Index", description: "Area crime index is 22% below the city average, supporting property value stability." },
  { title: "School Rating", description: "Nearest schools rate 8/10 on average, a key driver for family-oriented demand." },
  { title: "Environmental Risk", description: "The area has a moderate flood risk rating, which may affect insurance premiums." },
  { title: "Employment Hub", description: "Within 3km of a major employment center with 15,000+ jobs." },
  { title: "Building Age", description: "The structure was built in 1985 with no major renovations recorded since 2005." },
  { title: "Price per sqft", description: "At $285/sqft, the property is 8% below the neighborhood median of $310/sqft." },
];

const RED_FLAG_POOL: RedFlag[] = [
  { title: "Deferred Maintenance", description: "Visible signs of aging HVAC, roofing, or plumbing systems that may require $15K–50K in near-term repairs.", severity: "high" },
  { title: "Flood Zone Proximity", description: "Property is located within or near a FEMA-designated flood zone, potentially affecting insurance costs.", severity: "medium" },
  { title: "Declining Area Demographics", description: "Population and employment trends in the immediate area show negative momentum over 3 years.", severity: "high" },
  { title: "Over-Supply Risk", description: "Multiple large developments under construction within 1km may dilute rental demand.", severity: "medium" },
  { title: "Title or Legal Complexity", description: "Public records indicate potential easements, liens, or boundary disputes requiring legal review.", severity: "high" },
  { title: "Limited Comparable Data", description: "Few recent transactions of similar properties make accurate valuation challenging.", severity: "low" },
  { title: "High HOA/Strata Fees", description: "Monthly association fees are above the 75th percentile for similar properties.", severity: "low" },
  { title: "Noise or Pollution Exposure", description: "Proximity to highways, industrial zones, or airports may affect livability and resale.", severity: "medium" },
];

const NEXT_STEP_POOL: NextStep[] = [
  { title: "Commission Professional Inspection", description: "Engage a licensed building inspector to assess structural, mechanical, and safety systems." },
  { title: "Verify Financial Projections", description: "Request actual income/expense statements and validate against market comparables." },
  { title: "Review Zoning & Permits", description: "Confirm current zoning classification and any pending permit applications or violations." },
  { title: "Conduct Title Search", description: "Engage a title company to verify clear ownership and identify any encumbrances." },
  { title: "Negotiate Based on Findings", description: "Use identified risks and repair needs as leverage in price negotiations." },
  { title: "Assess Financing Options", description: "Compare mortgage terms from multiple lenders to optimize capital structure." },
  { title: "Visit at Different Times", description: "Tour the property during morning, evening, and weekend to assess noise, traffic, and neighborhood activity." },
  { title: "Check Insurance Quotes", description: "Get preliminary insurance quotes to factor into total cost of ownership." },
];

const SELLER_QUESTIONS: string[] = [
  "What is the reason for selling, and how long has the property been on the market?",
  "Are there any known defects, past insurance claims, or pending assessments?",
  "What are the current monthly operating costs (utilities, taxes, HOA)?",
  "Have there been any recent renovations, and are permits on file?",
  "Is there any flexibility on the asking price or closing timeline?",
  "What is the current lease situation, and are tenants on fixed-term agreements?",
  "Are there any planned infrastructure or development projects nearby?",
  "What is the history of property tax assessments and any appeals?",
];

function getDisplayName(input: AssessmentInput): string {
  if (input.address) return input.address;
  if (input.url) {
    try {
      const u = new URL(input.url);
      return `${u.hostname} listing`;
    } catch {
      return input.url.slice(0, 50);
    }
  }
  if (input.latitude !== undefined && input.longitude !== undefined) {
    return `${input.latitude.toFixed(4)}, ${input.longitude.toFixed(4)}`;
  }
  if (input.photos && input.photos.length > 0) {
    return `Photo analysis (${input.photos.length} images)`;
  }
  return "Property Assessment";
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
    ? "This property presents a compelling opportunity with strong fundamentals. The location, market dynamics, and financial metrics align well with the stated investment goals."
    : zone === 'yellow'
      ? "This property has potential but comes with notable considerations. A thorough due diligence process is recommended before committing to ensure the investment aligns with risk tolerance."
      : "This property carries significant risk factors that warrant careful evaluation. While there may be upside potential, the current risk profile suggests proceeding only with a clear mitigation strategy.";

  const objection = zone === 'green'
    ? "The data supports a strong investment thesis. Market trends, comparable transactions, and location fundamentals all point to a well-positioned asset."
    : zone === 'yellow'
      ? "While some concerns exist, they are typical for this market segment. With proper due diligence and negotiation, the risk-reward profile can be optimized."
      : "The identified risks are real but can be mitigated. Consider negotiating a significant price reduction to account for the risk premium, or structure the deal with contingencies.";

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
