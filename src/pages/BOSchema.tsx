import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { Database, FileJson } from 'lucide-react';

interface SchemaObject {
  name: string;
  description: string;
  fields: { name: string; type: string; description: string }[];
  sample: any;
}

export function BOSchema() {
  const [selectedObject, setSelectedObject] = useState<string>('Patient');

  const schemas: SchemaObject[] = [
    {
      name: 'Patient',
      description: 'Core patient demographic and clinical data',
      fields: [
        { name: 'patientid', type: 'string', description: 'Unique patient identifier' },
        { name: 'name', type: 'string', description: 'Patient full name' },
        { name: 'vitals', type: 'array', description: 'Time-series vital signs measurements' },
        { name: 'riskScores', type: 'array', description: 'Clinical risk assessment scores' },
        { name: 'allergies', type: 'string[]', description: 'Known allergies and sensitivities' }
      ],
      sample: {
        patientid: 'PT1000',
        name: 'John Smith',
        vitals: [{ ts: '2024-10-15T10:00:00Z', hr: 72, bp: '120/80', rr: 16, spo2: 98 }],
        riskScores: [{ type: 'Fall Risk', score: 3 }],
        allergies: ['Penicillin']
      }
    },
    {
      name: 'Encounter',
      description: 'Patient visit or admission episode',
      fields: [
        { name: 'encounterid', type: 'string', description: 'Unique encounter identifier' },
        { name: 'patientid', type: 'string', description: 'Reference to patient' },
        { name: 'acuityLevel', type: 'number', description: 'ESI acuity score (1-5)' },
        { name: 'doorToTriageMins', type: 'number', description: 'Minutes from arrival to triage' },
        { name: 'lwbs', type: 'boolean', description: 'Left without being seen flag' },
        { name: 'dept', type: 'string', description: 'Department (IP/OP/ED/OR)' },
        { name: 'status', type: 'string', description: 'Current encounter status' }
      ],
      sample: {
        encounterid: 'ENC2000',
        patientid: 'PT1000',
        acuityLevel: 3,
        doorToTriageMins: 8,
        lwbs: false,
        dept: 'ED',
        status: 'Active'
      }
    },
    {
      name: 'Medication',
      description: 'Medication orders and administration records',
      fields: [
        { name: 'medid', type: 'string', description: 'Unique medication order ID' },
        { name: 'patientid', type: 'string', description: 'Reference to patient' },
        { name: 'name', type: 'string', description: 'Medication name' },
        { name: 'bcmaCompliance', type: 'number', description: 'BCMA scan compliance (0-100)' },
        { name: 'reconciliationStatus', type: 'string', description: 'Reconciliation status (PENDING/DONE)' }
      ],
      sample: {
        medid: 'MED3000',
        patientid: 'PT1000',
        name: 'Lisinopril 10mg',
        bcmaCompliance: 100,
        reconciliationStatus: 'DONE'
      }
    },
    {
      name: 'DischargePlan',
      description: 'Patient discharge readiness and planning',
      fields: [
        { name: 'id', type: 'string', description: 'Unique discharge plan ID' },
        { name: 'patientid', type: 'string', description: 'Reference to patient' },
        { name: 'readinessScore', type: 'number', description: 'Discharge readiness score (0-100)' },
        { name: 'followUps', type: 'array', description: 'Scheduled follow-up appointments' },
        { name: 'educationStatus', type: 'string', description: 'Patient education completion status' }
      ],
      sample: {
        id: 'DP4000',
        patientid: 'PT1000',
        readinessScore: 92,
        followUps: [{ type: 'Primary Care', date: '2024-10-22' }],
        educationStatus: 'COMPLETE'
      }
    },
    {
      name: 'ComplianceAudit',
      description: 'Compliance verification and audit trail',
      fields: [
        { name: 'auditid', type: 'string', description: 'Unique audit record ID' },
        { name: 'evidenceTrail', type: 'array', description: 'Immutable evidence chain' },
        { name: 'isbarHandoff', type: 'boolean', description: 'ISBAR handoff completed flag' },
        { name: 'standard', type: 'string', description: 'Applicable compliance standard' }
      ],
      sample: {
        auditid: 'AUD5000',
        evidenceTrail: [
          { ts: '2024-10-15T10:00:00Z', agentId: 'vitalguard', action: 'Vital Check', hash: 'SHA256-abc123' }
        ],
        isbarHandoff: true,
        standard: 'COP 1'
      }
    }
  ];

  const selected = schemas.find(s => s.name === selectedObject) || schemas[0];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Business Objects Schema</h1>
        <p className="text-gray-600">Explore the data models powering the Mobius AI ecosystem</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Objects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {schemas.map((schema) => (
                  <button
                    key={schema.name}
                    onClick={() => setSelectedObject(schema.name)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      selectedObject === schema.name
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {schema.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Database size={24} className="text-teal-600" />
                <CardTitle>{selected.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{selected.description}</p>

              <h4 className="font-semibold text-gray-900 mb-3">Fields</h4>
              <div className="space-y-2 mb-6">
                {selected.fields.map((field) => (
                  <div key={field.name} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <code className="text-sm font-medium text-gray-900">{field.name}</code>
                      <Badge variant="info">{field.type}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">{field.description}</p>
                  </div>
                ))}
              </div>

              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <FileJson size={18} className="mr-2" />
                Sample Data
              </h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                <pre className="text-sm">
                  {JSON.stringify(selected.sample, null, 2)}
                </pre>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Lineage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <Badge variant="info">Source</Badge>
                  <span className="text-sm text-gray-700">EMR / HL7 Feed</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="warning">Processing</Badge>
                  <span className="text-sm text-gray-700">AI Agent Validation & Enrichment</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="success">Storage</Badge>
                  <span className="text-sm text-gray-700">FHIR-compliant Data Lake</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
