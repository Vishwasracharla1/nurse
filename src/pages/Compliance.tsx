import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { DataTable } from '../components/ui/DataTable';
import { api } from '../services/api';
import { ComplianceStandard } from '../types';
import { Shield, CheckCircle, AlertTriangle } from 'lucide-react';

export function Compliance() {
  const [standards, setStandards] = useState<ComplianceStandard[]>([]);
  const [activeTab, setActiveTab] = useState<'JCI' | 'NABH' | 'DHA' | 'MOHAP'>('JCI');

  useEffect(() => {
    api.compliance.getStandards().then(setStandards);
  }, []);

  const filteredStandards = standards.filter(s => s.standard === activeTab);
  const gapCount = filteredStandards.filter(s => s.gaps).length;
  const compliantCount = filteredStandards.filter(s => !s.gaps).length;

  const tabs = ['JCI', 'NABH', 'DHA', 'MOHAP'] as const;

  const complianceMapping = {
    'Medication Management': { requirement: 'MMU', standards: ['MMU', 'PSG 3'], description: 'BCMA verification and reconciliation' },
    'Documentation': { requirement: 'MOM 1', standards: ['MOM 1', 'COP 8'], description: 'Complete and accurate clinical documentation' },
    'OR Safety': { requirement: 'IPSG 4', standards: ['IPSG 4'], description: 'WHO checklist and surgical safety protocols' },
    'Interoperability': { requirement: 'HL7/FHIR', standards: ['HL7', 'FHIR'], description: 'Standards-based data exchange' },
  };

  const columns = [
    { header: 'Code', accessor: 'code' as const, sortable: true },
    { header: 'Requirement', accessor: 'requirement' as const, sortable: true },
    {
      header: 'Status',
      accessor: (row: ComplianceStandard) => (
        <Badge variant={row.gaps ? 'error' : 'success'}>
          {row.gaps ? 'Gap Identified' : 'Compliant'}
        </Badge>
      )
    },
    {
      header: 'Evidence Count',
      accessor: (row: ComplianceStandard) => row.evidence.length
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Compliance Standards</h1>
        <p className="text-gray-600">Track adherence to international healthcare standards and regulations</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">{compliantCount}</div>
            <div className="text-sm text-gray-600">Compliant</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-red-600 mb-2">{gapCount}</div>
            <div className="text-sm text-gray-600">Gaps Identified</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">
              {Math.round((compliantCount / (compliantCount + gapCount)) * 100)}%
            </div>
            <div className="text-sm text-gray-600">Overall Compliance</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <div className="flex space-x-2 border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium text-sm -mb-px ${
                  activeTab === tab
                    ? 'border-b-2 border-teal-600 text-teal-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredStandards}
            columns={columns}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {filteredStandards.map((standard) => (
          <Card key={`${standard.standard}-${standard.code}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Shield size={20} className="text-teal-600" />
                  <CardTitle className="text-lg">{standard.code}</CardTitle>
                </div>
                <Badge variant={standard.gaps ? 'error' : 'success'}>
                  {standard.gaps ? (
                    <span className="flex items-center">
                      <AlertTriangle size={14} className="mr-1" />
                      Gap
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <CheckCircle size={14} className="mr-1" />
                      Compliant
                    </span>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <h4 className="font-semibold text-gray-900 mb-3">{standard.requirement}</h4>

              {standard.evidence.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Evidence Trail:</p>
                  {standard.evidence.map((evidence, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-gray-900">{evidence.agentName}</span>
                        <span className="text-xs text-gray-500">
                          {new Date(evidence.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{evidence.notes}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">No evidence recorded. Action required to close this gap.</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Standards Mapping Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(complianceMapping).map(([key, value]) => (
              <div key={key} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">{key}</h4>
                <p className="text-sm text-gray-600 mb-2">{value.description}</p>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-500">Mapped to:</span>
                  {value.standards.map(std => (
                    <Badge key={std} variant="info">{std}</Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
