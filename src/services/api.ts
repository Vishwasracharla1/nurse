import { mockAgents, mockKPIs, mockObjectives, mockPatients, mockEncounters, mockMedications, mockDischargePlans, mockAuditEvents, mockTasks, mockComplianceStandards, mockCaseStudies } from './mockData';
import { Agent, KPI, Objective, Patient, Encounter, Medication, DischargePlan, AuditEvent, Task, ComplianceStandard, CaseStudy, Department } from '../types';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  agents: {
    getAll: async (dept?: Department): Promise<Agent[]> => {
      await delay(100);
      return dept ? mockAgents.filter(a => a.dept === dept) : mockAgents;
    },
    getById: async (id: string): Promise<Agent | undefined> => {
      await delay(50);
      return mockAgents.find(a => a.id === id);
    }
  },

  kpis: {
    getAll: async (dept?: Department): Promise<KPI[]> => {
      await delay(100);
      return dept ? mockKPIs.filter(k => k.dept === dept || k.dept === 'ALL') : mockKPIs;
    },
    getById: async (id: string): Promise<KPI | undefined> => {
      await delay(50);
      return mockKPIs.find(k => k.id === id);
    }
  },

  okrs: {
    getAll: async (): Promise<Objective[]> => {
      await delay(100);
      return mockObjectives;
    },
    create: async (objective: Objective): Promise<Objective> => {
      await delay(150);
      mockObjectives.push(objective);
      return objective;
    },
    update: async (id: string, updates: Partial<Objective>): Promise<Objective> => {
      await delay(150);
      const index = mockObjectives.findIndex(o => o.id === id);
      if (index !== -1) {
        mockObjectives[index] = { ...mockObjectives[index], ...updates };
        return mockObjectives[index];
      }
      throw new Error('Objective not found');
    }
  },

  audit: {
    getAll: async (filters?: { agentId?: string; standard?: string; patientId?: string; dept?: Department }): Promise<AuditEvent[]> => {
      await delay(100);
      let results = [...mockAuditEvents];
      if (filters?.agentId) results = results.filter(e => e.agentId === filters.agentId);
      if (filters?.standard) results = results.filter(e => e.standard === filters.standard);
      if (filters?.patientId) results = results.filter(e => e.patientId === filters.patientId);
      if (filters?.dept) results = results.filter(e => e.dept === filters.dept);
      return results;
    },
    getById: async (id: string): Promise<AuditEvent | undefined> => {
      await delay(50);
      return mockAuditEvents.find(e => e.id === id);
    }
  },

  departments: {
    getTasks: async (dept: Department): Promise<Task[]> => {
      await delay(100);
      return mockTasks.filter(t => t.dept === dept);
    },
    executeAction: async (dept: Department, action: string, data: any): Promise<{ success: boolean; message: string }> => {
      await delay(200);
      return { success: true, message: `${action} completed successfully` };
    }
  },

  compliance: {
    getStandards: async (standard?: 'JCI' | 'NABH' | 'DHA' | 'MOHAP'): Promise<ComplianceStandard[]> => {
      await delay(100);
      return standard ? mockComplianceStandards.filter(s => s.standard === standard) : mockComplianceStandards;
    }
  },

  businessObjects: {
    getPatients: async (): Promise<Patient[]> => {
      await delay(100);
      return mockPatients;
    },
    getEncounters: async (): Promise<Encounter[]> => {
      await delay(100);
      return mockEncounters;
    },
    getMedications: async (): Promise<Medication[]> => {
      await delay(100);
      return mockMedications;
    },
    getDischargePlans: async (): Promise<DischargePlan[]> => {
      await delay(100);
      return mockDischargePlans;
    }
  },

  caseStudies: {
    getAll: async (): Promise<CaseStudy[]> => {
      await delay(100);
      return mockCaseStudies;
    }
  }
};
