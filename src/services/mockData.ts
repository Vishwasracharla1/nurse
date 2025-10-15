import { Agent, KPI, Objective, Patient, Encounter, Medication, DischargePlan, ComplianceAudit, AuditEvent, Task, ComplianceStandard, CaseStudy, Department } from '../types';

const agentDefinitions = [
  { id: 'vitalguard', name: 'VitalGuard', dept: 'IP' as Department, purpose: 'Monitors vital signs and alerts on anomalies', standards: ['PSG 3', 'COP 8'] },
  { id: 'wardflow', name: 'WardFlow', dept: 'IP' as Department, purpose: 'Task orchestration and prioritization', standards: ['MOM 1'] },
  { id: 'medicheck', name: 'MediCheck', dept: 'IP' as Department, purpose: 'BCMA validation and reconciliation', standards: ['MMU', 'PSG 3'] },
  { id: 'docunurse', name: 'DocuNurse', dept: 'IP' as Department, purpose: 'Auto-generates discharge summaries', standards: ['MOM 1', 'COP 8'] },
  { id: 'triagemate', name: 'TriageMate', dept: 'ED' as Department, purpose: 'ESI acuity scoring and door-to-triage tracking', standards: ['COP 3'] },
  { id: 'watchtower', name: 'Watchtower', dept: 'ED' as Department, purpose: 'Real-time LWBS prediction and mitigation', standards: ['PSG 1'] },
  { id: 'flowrunner', name: 'FlowRunner', dept: 'ED' as Department, purpose: 'ED throughput optimization', standards: ['COP 3'] },
  { id: 'orguard', name: 'ORGuard', dept: 'OR' as Department, purpose: 'WHO checklist automation', standards: ['IPSG 4'] },
  { id: 'instrumentiq', name: 'InstrumentIQ', dept: 'OR' as Department, purpose: 'Instrument count verification', standards: ['IPSG 4'] },
  { id: 'pacuguard', name: 'PACUGuard', dept: 'OR' as Department, purpose: 'Aldrete scoring and dual-attestation', standards: ['COP 8'] },
  { id: 'bridge', name: 'Bridge', dept: 'IP' as Department, purpose: 'ISBAR handoff coordination', standards: ['COP 1'] },
  { id: 'audittrailx', name: 'AuditTrailX', dept: 'IP' as Department, purpose: 'Immutable audit logging', standards: ['MOM 1', 'GLD 13'] },
  { id: 'timeoutx', name: 'TimeOutX', dept: 'OR' as Department, purpose: 'Surgical timeout verification', standards: ['IPSG 4'] },
  { id: 'postoplink', name: 'PostOpLink', dept: 'OR' as Department, purpose: 'Post-op handoff to ward', standards: ['COP 1'] },
  { id: 'triagex', name: 'TriageX', dept: 'ED' as Department, purpose: 'Advanced triage decision support', standards: ['COP 3'] },
];

export const mockAgents: Agent[] = agentDefinitions.map(def => ({
  ...def,
  status: Math.random() > 0.1 ? 'Active' as const : (Math.random() > 0.5 ? 'Idle' as const : 'Error' as const),
  lastAction: `Processed ${Math.floor(Math.random() * 50 + 10)} records ${Math.floor(Math.random() * 15 + 1)}m ago`,
  compliance: Math.floor(Math.random() * 10 + 90),
  inputs: ['Patient Data', 'Clinical Events', 'Protocol Rules'],
  outputs: ['Alerts', 'Task Updates', 'Audit Events'],
  dependencies: ['EMR', 'HL7 Feed'],
  recentActions: Array(5).fill(0).map((_, i) => ({
    ts: new Date(Date.now() - i * 300000).toISOString(),
    action: `Validated patient ${1000 + i} vitals`,
    outcome: 'Success'
  })),
  linkedKpis: ['vitals-compliance', 'med-accuracy']
}));

const generateTrend = (base: number, variance: number, points: number = 30) => {
  return Array(points).fill(0).map((_, i) => ({
    date: new Date(Date.now() - (points - i) * 86400000).toISOString().split('T')[0],
    value: Math.max(0, Math.min(100, base + (Math.random() - 0.5) * variance))
  }));
};

export const mockKPIs: KPI[] = [
  { id: 'vitals-compliance', name: 'Vitals Compliance', target: 95, value: 96.5, unit: '%', dept: 'IP', sql: 'SELECT compliance FROM vitals_checks', source: 'EMR', trend: generateTrend(96, 3) },
  { id: 'med-accuracy', name: 'Med Accuracy (BCMA)', target: 99.5, value: 99.7, unit: '%', dept: 'IP', sql: 'SELECT bcma_match FROM medications', source: 'Pharmacy', trend: generateTrend(99.5, 1) },
  { id: 'discharge-noon', name: 'Discharge Before Noon', target: 90, value: 87.2, unit: '%', dept: 'IP', sql: 'SELECT discharge_time FROM encounters', source: 'EMR', trend: generateTrend(87, 5) },
  { id: 'education-teachback', name: 'Education Teach-Back', target: 95, value: 94.8, unit: '%', dept: 'IP', sql: 'SELECT teachback_complete FROM patient_education', source: 'EMR', trend: generateTrend(94, 3) },
  { id: 'readmit-30day', name: '30-Day Readmit Rate', target: 10, value: 8.3, unit: '%', dept: 'IP', sql: 'SELECT readmissions FROM outcomes', source: 'Analytics', trend: generateTrend(8.5, 2) },
  { id: 'door-to-triage', name: 'Door-to-Triage Time', target: 10, value: 8.5, unit: 'mins', dept: 'ED', sql: 'SELECT avg(triage_mins) FROM ed_encounters', source: 'EMR', trend: generateTrend(8.5, 1.5) },
  { id: 'lwbs-rate', name: 'LWBS Rate', target: 2, value: 1.8, unit: '%', dept: 'ED', sql: 'SELECT lwbs FROM ed_visits', source: 'EMR', trend: generateTrend(1.8, 0.5) },
  { id: 'or-timeout-compliance', name: 'OR Timeout Compliance', target: 100, value: 99.2, unit: '%', dept: 'OR', sql: 'SELECT timeout_complete FROM surgeries', source: 'OR System', trend: generateTrend(99, 1) },
  { id: 'instrument-count', name: 'Instrument Count Accuracy', target: 100, value: 100, unit: '%', dept: 'OR', sql: 'SELECT count_match FROM instruments', source: 'OR System', trend: generateTrend(100, 0.5) },
];

export const mockObjectives: Objective[] = [
  {
    id: 'obj-1',
    title: 'Achieve 98% Clinical Compliance',
    owner: 'CNO',
    level: 'Company',
    keyResults: [
      { id: 'kr-1', metricId: 'vitals-compliance', target: 98, current: 96.5, status: 'AT_RISK' },
      { id: 'kr-2', metricId: 'med-accuracy', target: 99.8, current: 99.7, status: 'ON_TRACK' }
    ],
    children: [
      {
        id: 'obj-1-1',
        title: 'IP Department Excellence',
        owner: 'IP Director',
        level: 'Department',
        keyResults: [
          { id: 'kr-3', metricId: 'discharge-noon', target: 92, current: 87.2, status: 'OFF_TRACK' },
          { id: 'kr-4', metricId: 'readmit-30day', target: 8, current: 8.3, status: 'AT_RISK' }
        ]
      }
    ]
  },
  {
    id: 'obj-2',
    title: 'Optimize ED Throughput',
    owner: 'ED Director',
    level: 'Company',
    keyResults: [
      { id: 'kr-5', metricId: 'door-to-triage', target: 8, current: 8.5, status: 'AT_RISK' },
      { id: 'kr-6', metricId: 'lwbs-rate', target: 1.5, current: 1.8, status: 'AT_RISK' }
    ]
  }
];

const firstNames = ['John', 'Sarah', 'Michael', 'Emily', 'David', 'Jessica', 'Robert', 'Lisa', 'James', 'Mary', 'William', 'Patricia', 'Richard', 'Jennifer', 'Thomas', 'Linda', 'Charles', 'Barbara', 'Daniel', 'Susan'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];

export const mockPatients: Patient[] = Array(20).fill(0).map((_, i) => ({
  patientid: `PT${1000 + i}`,
  name: `${firstNames[i % firstNames.length]} ${lastNames[Math.floor(i / firstNames.length)]}`,
  vitals: Array(5).fill(0).map((_, j) => ({
    ts: new Date(Date.now() - j * 3600000).toISOString(),
    hr: Math.floor(Math.random() * 40 + 60),
    bp: `${Math.floor(Math.random() * 40 + 110)}/${Math.floor(Math.random() * 30 + 60)}`,
    rr: Math.floor(Math.random() * 8 + 12),
    spo2: Math.floor(Math.random() * 5 + 95)
  })),
  riskScores: [
    { type: 'Fall Risk', score: Math.floor(Math.random() * 10) },
    { type: 'Sepsis', score: Math.floor(Math.random() * 5) }
  ],
  allergies: ['Penicillin', 'Latex'].slice(0, Math.floor(Math.random() * 3))
}));

const depts: Department[] = ['IP', 'OP', 'ED', 'OR'];

export const mockEncounters: Encounter[] = Array(60).fill(0).map((_, i) => {
  const patient = mockPatients[i % mockPatients.length];
  return {
    encounterid: `ENC${2000 + i}`,
    patientid: patient.patientid,
    patientName: patient.name,
    acuityLevel: Math.floor(Math.random() * 5 + 1),
    doorToTriageMins: Math.floor(Math.random() * 20 + 2),
    lwbs: Math.random() < 0.05,
    dept: depts[i % depts.length],
    status: ['Active', 'Discharged', 'Admitted'][Math.floor(Math.random() * 3)] as any
  };
});

export const mockMedications: Medication[] = Array(40).fill(0).map((_, i) => {
  const patient = mockPatients[i % mockPatients.length];
  return {
    medid: `MED${3000 + i}`,
    patientid: patient.patientid,
    patientName: patient.name,
    name: ['Aspirin', 'Lisinopril', 'Metformin', 'Atorvastatin', 'Omeprazole'][i % 5],
    bcmaCompliance: Math.random() > 0.05 ? 100 : 0,
    reconciliationStatus: Math.random() > 0.2 ? 'DONE' : 'PENDING'
  };
});

export const mockDischargePlans: DischargePlan[] = Array(15).fill(0).map((_, i) => {
  const patient = mockPatients[i];
  return {
    id: `DP${4000 + i}`,
    patientid: patient.patientid,
    patientName: patient.name,
    readinessScore: Math.floor(Math.random() * 30 + 70),
    followUps: [
      { type: 'Primary Care', date: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] },
      { type: 'Lab Work', date: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0] }
    ],
    educationStatus: Math.random() > 0.3 ? 'COMPLETE' : 'PENDING'
  };
});

export const mockAuditEvents: AuditEvent[] = Array(200).fill(0).map((_, i) => {
  const agent = mockAgents[i % mockAgents.length];
  const patient = mockPatients[i % mockPatients.length];
  return {
    id: `AUD${5000 + i}`,
    timestamp: new Date(Date.now() - i * 180000).toISOString(),
    agentId: agent.id,
    agentName: agent.name,
    patientId: Math.random() > 0.3 ? patient.patientid : undefined,
    action: ['Vital Check', 'Med Verification', 'Discharge Ready', 'Triage Score', 'WHO Checklist'][i % 5],
    standard: agent.standards[0],
    dept: agent.dept,
    actor: Math.random() > 0.3 ? 'DH' : 'OH',
    signature: `SIG-${Math.random().toString(36).substr(2, 9)}`,
    hash: `SHA256-${Math.random().toString(36).substr(2, 16)}`,
    notes: 'Automated validation completed successfully'
  };
});

export const mockTasks: Task[] = Array(50).fill(0).map((_, i) => {
  const patient = mockPatients[i % mockPatients.length];
  const dept = depts[i % depts.length];
  return {
    id: `TASK${6000 + i}`,
    title: ['Admit Assessment', 'Med Reconciliation', 'Discharge Planning', 'Triage Assessment', 'Pre-op Checklist'][i % 5],
    priority: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)] as any,
    owner: `Nurse ${String.fromCharCode(65 + (i % 10))}`,
    due: new Date(Date.now() + (Math.random() * 48 - 24) * 3600000).toISOString(),
    patientId: patient.patientid,
    patientName: patient.name,
    status: ['Pending', 'In Progress', 'Complete'][Math.floor(Math.random() * 3)] as any,
    dept
  };
});

export const mockComplianceStandards: ComplianceStandard[] = [
  {
    standard: 'JCI',
    requirement: 'Medication Management (MMU)',
    code: 'MMU.1',
    evidence: [
      { agentId: 'medicheck', agentName: 'MediCheck', timestamp: new Date(Date.now() - 3600000).toISOString(), notes: 'BCMA verification completed' }
    ],
    gaps: false
  },
  {
    standard: 'JCI',
    requirement: 'Patient Safety Goals (PSG)',
    code: 'PSG.3',
    evidence: [
      { agentId: 'vitalguard', agentName: 'VitalGuard', timestamp: new Date(Date.now() - 7200000).toISOString(), notes: 'Vital monitoring active' }
    ],
    gaps: false
  },
  {
    standard: 'JCI',
    requirement: 'Care of Patients (COP)',
    code: 'COP.8',
    evidence: [
      { agentId: 'docunurse', agentName: 'DocuNurse', timestamp: new Date(Date.now() - 1800000).toISOString(), notes: 'Documentation completed' }
    ],
    gaps: false
  },
  {
    standard: 'NABH',
    requirement: 'Patient Rights (PR)',
    code: 'PR.1',
    evidence: [],
    gaps: true
  },
  {
    standard: 'DHA',
    requirement: 'Clinical Governance',
    code: 'CG.2',
    evidence: [
      { agentId: 'audittrailx', agentName: 'AuditTrailX', timestamp: new Date(Date.now() - 900000).toISOString(), notes: 'Audit trail maintained' }
    ],
    gaps: false
  },
  {
    standard: 'MOHAP',
    requirement: 'Quality Indicators',
    code: 'QI.3',
    evidence: [],
    gaps: true
  }
];

export const mockCaseStudies: CaseStudy[] = [
  {
    id: 'cs-1',
    title: 'ED LWBS Reduction',
    dept: 'ED',
    metric: 'LWBS Rate',
    improvement: '18% reduction',
    method: 'TriageMate + Watchtower predictive alerting',
    standards: ['COP 3', 'PSG 1']
  },
  {
    id: 'cs-2',
    title: 'Medication Error Prevention',
    dept: 'IP',
    metric: 'Med Errors',
    improvement: '42% reduction',
    method: 'MediCheck BCMA automation',
    standards: ['MMU', 'PSG 3']
  },
  {
    id: 'cs-3',
    title: 'OR Safety Compliance',
    dept: 'OR',
    metric: 'WHO Checklist Compliance',
    improvement: '99.2% compliance',
    method: 'ORGuard + TimeOutX automation',
    standards: ['IPSG 4']
  },
  {
    id: 'cs-4',
    title: 'Discharge Optimization',
    dept: 'IP',
    metric: 'Discharge Before Noon',
    improvement: '23% increase',
    method: 'DocuNurse + WardFlow coordination',
    standards: ['COP 8', 'MOM 1']
  }
];
