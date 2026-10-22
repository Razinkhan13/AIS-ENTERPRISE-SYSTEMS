export type Language = 'en' | 'bn';

export type TargetCategory = 'all' | 'tier1' | 'mid' | 'ecom';

export interface VerifiedTarget {
  id: string;
  slug: string;
  name: string;
  established: number;
  projectsCount: number;
  location: string;
  category: 'tier1' | 'mid' | 'ecom';
  phone: string;
  flagshipProject: string;
  unitSpec: string;
  bdtPrice: string;
  diagnosedVulnerability: string;
  customSolution: string;
  defaultCurrency: 'USD' | 'GBP' | 'AED';
  currentStatus: 'Uncontacted' | 'Pitch Sent' | 'Boardroom Scheduled' | 'Locked & Mobilized';
  dealValueLakh: number;
}

export interface BoardroomScript {
  id: string;
  title: string;
  titleBn: string;
  targetRole: string;
  englishScript: string;
  banglaScript: string;
  strategicNote: string;
}

export interface TransactionRecord {
  id: string;
  txCode: string;
  clientName: string;
  clientSlug: string;
  packageType: string;
  amountBDT: number;
  serviceCategory: 'Tier-1 RE' | 'Mid-RE' | 'E-Com COD' | 'Vault MSA';
  paymentMethod: 'Trust Bank PLC (00110466000494)' | 'bKash (01715219176)' | 'Nagad (01708761298)';
  status: 'Pending Verification' | 'Locked & Mobilized';
  lockedTimestamp?: string;
  referenceNote: string;
}

export interface RedmaPreset {
  name: string;
  katha: number;
  sqft: number;
  priceSqft: number;
  cancelledUnits: number;
  stalledUnits: number;
  bankOdCrore: number;
  description: string;
}

export interface InboundLead {
  id: string;
  developer_slug: string;
  lead_name: string;
  diaspora_location: string;
  currency: string;
  budget_local: string;
  budget_bdt: string;
  preferred_project: string;
  response_time_sec: number;
  ai_score: number;
  status: 'NRTA Verified' | '48h Unit Hold' | 'Contract Sent' | 'Escrow Pending';
  timestamp: string;
}

export interface ProjectAsset {
  id: string;
  developer_slug: string;
  project_name: string;
  location: string;
  unsold_sqft: number;
  avg_price_sqft: number;
  od_rate_pct: number;
  monthly_od_bleed_cr: number;
  status: 'Critical Bleed' | 'Active Sandbox' | 'Liquidated';
}
