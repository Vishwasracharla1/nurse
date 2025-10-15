export type Role = 'Nurse' | 'Charge Nurse' | 'Admin';

export type Department = 'IP' | 'OP' | 'ED' | 'OR';

export type AgentStatus = 'Active' | 'Idle' | 'Error';

export interface Agent {
  id: string;
  name: string;
  dept: Department;
  status: AgentStatus;
  lastAction: string;
  compliance: number;
  standards: string[];
  purpose: string;
  inputs: string[];
  outputs: string[];
  dependencies: string[];
  recentActions: { ts: string; action: string; outcome: string }[];
  linkedKpis: string[];
}

export interface KPI {
  id: string;
  name: string;
  target: number;
  value: number;
  unit: '%' | 'number' | 'mins';
  dept: Department | 'ALL';
  sql: string;
  source: string;
  trend: { date: string; value: number }[];
}

export interface KeyResult {
  id: string;
  metricId: string;
  target: number;
  current: number;
  status: 'ON_TRACK' | 'AT_RISK' | 'OFF_TRACK';
}

export interface Objective {
  id: string;
  title: string;
  owner: string;
  level: 'Company' | 'Department' | 'Unit';
  children?: Objective[];
  keyResults: KeyResult[];
}

export interface Patient {
  patientid: string;
  name: string;
  vitals: { ts: string; hr: number; bp: string; rr: number; spo2: number }[];
  riskScores: { type: string; score: number }[];
  allergies: string[];
}

export interface Encounter {
  encounterid: string;
  patientid: string;
  patientName: string;
  acuityLevel: number;
  doorToTriageMins: number;
  lwbs: boolean;
  dept: Department;
  status: 'Active' | 'Discharged' | 'Admitted';
}

export interface Medication {
  medid: string;
  patientid: string;
  patientName: string;
  name: string;
  bcmaCompliance: number;
  reconciliationStatus: 'PENDING' | 'DONE';
}

export interface DischargePlan {
  id: string;
  patientid: string;
  patientName: string;
  readinessScore: number;
  followUps: { type: string; date: string }[];
  educationStatus: 'PENDING' | 'COMPLETE';
}

export interface ComplianceAudit {
  auditid: string;
  evidenceTrail: { ts: string; agentId: string; action: string; hash: string }[];
  isbarHandoff: boolean;
  standard: string;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  agentId: string;
  agentName: string;
  patientId?: string;
  action: string;
  standard: string;
  dept: Department;
  actor: 'DH' | 'OH';
  signature: string;
  hash: string;
  beforeState?: any;
  afterState?: any;
  notes: string;
}

export interface Task {
  id: string;
  title: string;
  priority: 'High' | 'Medium' | 'Low';
  owner: string;
  due: string;
  patientId?: string;
  patientName?: string;
  status: 'Pending' | 'In Progress' | 'Complete';
  dept: Department;
}

export interface ComplianceStandard {
  standard: 'JCI' | 'NABH' | 'DHA' | 'MOHAP';
  requirement: string;
  code: string;
  evidence: {
    agentId: string;
    agentName: string;
    timestamp: string;
    notes: string;
  }[];
  gaps: boolean;
}

export interface CaseStudy {
  id: string;
  title: string;
  dept: Department;
  metric: string;
  improvement: string;
  method: string;
  standards: string[];
}
