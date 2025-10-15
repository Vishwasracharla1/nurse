import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Code, Play, Copy } from 'lucide-react';

interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response: any;
}

export function APIDocs() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/agents');
  const [testResponse, setTestResponse] = useState<any>(null);

  const endpoints: Endpoint[] = [
    {
      method: 'GET',
      path: '/api/agents',
      description: 'Retrieve all AI agents with optional department filter',
      params: [{ name: 'dept', type: 'string', required: false, description: 'Filter by department (IP/OP/ED/OR)' }],
      response: [{ id: 'vitalguard', name: 'VitalGuard', dept: 'IP', status: 'Active', compliance: 96 }]
    },
    {
      method: 'GET',
      path: '/api/kpis',
      description: 'Retrieve KPIs with optional department filter',
      params: [{ name: 'dept', type: 'string', required: false, description: 'Filter by department' }],
      response: [{ id: 'vitals-compliance', name: 'Vitals Compliance', target: 95, value: 96.5, unit: '%' }]
    },
    {
      method: 'GET',
      path: '/api/okrs',
      description: 'Retrieve all objectives and key results',
      response: [{ id: 'obj-1', title: 'Achieve 98% Clinical Compliance', owner: 'CNO', keyResults: [] }]
    },
    {
      method: 'POST',
      path: '/api/okrs',
      description: 'Create a new objective',
      params: [
        { name: 'title', type: 'string', required: true, description: 'Objective title' },
        { name: 'owner', type: 'string', required: true, description: 'Objective owner' },
        { name: 'level', type: 'string', required: true, description: 'Company/Department/Unit' }
      ],
      response: { id: 'obj-new', title: 'New Objective', owner: 'Director', level: 'Department' }
    },
    {
      method: 'GET',
      path: '/api/audit',
      description: 'Retrieve audit events with filters',
      params: [
        { name: 'agentId', type: 'string', required: false, description: 'Filter by agent' },
        { name: 'standard', type: 'string', required: false, description: 'Filter by standard' },
        { name: 'dept', type: 'string', required: false, description: 'Filter by department' }
      ],
      response: [{ id: 'AUD5000', timestamp: '2024-10-15T10:00:00Z', agentName: 'VitalGuard', action: 'Vital Check' }]
    },
    {
      method: 'GET',
      path: '/api/departments/:dept/tasks',
      description: 'Retrieve tasks for a specific department',
      response: [{ id: 'TASK6000', title: 'Admit Assessment', priority: 'High', status: 'Pending' }]
    },
    {
      method: 'POST',
      path: '/api/departments/:dept/actions',
      description: 'Execute a department-specific action',
      params: [
        { name: 'action', type: 'string', required: true, description: 'Action to perform' },
        { name: 'data', type: 'object', required: true, description: 'Action payload' }
      ],
      response: { success: true, message: 'Action completed successfully' }
    }
  ];

  const selected = endpoints.find(e => e.path === selectedEndpoint) || endpoints[0];

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'success';
      case 'POST': return 'info';
      case 'PUT': return 'warning';
      case 'DELETE': return 'error';
      default: return 'default';
    }
  };

  const getCurlExample = (endpoint: Endpoint) => {
    const baseUrl = 'https://api.mobius-ai.health';
    let curl = `curl -X ${endpoint.method} "${baseUrl}${endpoint.path}"`;

    if (endpoint.method !== 'GET') {
      curl += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify({ example: 'data' }, null, 2)}'`;
    }

    return curl;
  };

  const getFetchExample = (endpoint: Endpoint) => {
    const baseUrl = 'https://api.mobius-ai.health';
    let code = `const response = await fetch('${baseUrl}${endpoint.path}'`;

    if (endpoint.method !== 'GET') {
      code += `, {\n  method: '${endpoint.method}',\n  headers: {\n    'Content-Type': 'application/json'\n  },\n  body: JSON.stringify({ example: 'data' })\n}`;
    }

    code += `);\nconst data = await response.json();`;
    return code;
  };

  const handleTryIt = () => {
    setTestResponse(selected.response);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">API Documentation</h1>
        <p className="text-gray-600">Interactive API reference with HL7/FHIR-compatible endpoints</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {endpoints.map((endpoint) => (
                  <button
                    key={endpoint.path}
                    onClick={() => {
                      setSelectedEndpoint(endpoint.path);
                      setTestResponse(null);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      selectedEndpoint === endpoint.path
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant={getMethodColor(endpoint.method) as any} className="text-xs">
                        {endpoint.method}
                      </Badge>
                    </div>
                    <div className="text-xs font-mono">{endpoint.path}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Code size={24} className="text-teal-600" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getMethodColor(selected.method) as any}>
                        {selected.method}
                      </Badge>
                      <code className="text-base font-mono">{selected.path}</code>
                    </div>
                  </div>
                </div>
                <Button variant="primary" size="sm" onClick={handleTryIt}>
                  <Play size={16} className="mr-2" />
                  Try It
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">{selected.description}</p>

              {selected.params && selected.params.length > 0 && (
                <>
                  <h4 className="font-semibold text-gray-900 mb-3">Parameters</h4>
                  <div className="space-y-2 mb-6">
                    {selected.params.map((param) => (
                      <div key={param.name} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-1">
                          <code className="text-sm font-medium text-gray-900">{param.name}</code>
                          <div className="flex items-center space-x-2">
                            <Badge variant="info">{param.type}</Badge>
                            {param.required && <Badge variant="error">Required</Badge>}
                          </div>
                        </div>
                        <p className="text-xs text-gray-600">{param.description}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <h4 className="font-semibold text-gray-900 mb-3">Response Schema</h4>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-6">
                <pre className="text-sm">
                  {JSON.stringify(selected.response, null, 2)}
                </pre>
              </div>

              {testResponse && (
                <>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Play size={18} className="mr-2 text-teal-600" />
                    Test Response
                  </h4>
                  <div className="bg-teal-50 border border-teal-200 text-teal-900 p-4 rounded-lg overflow-x-auto mb-6">
                    <pre className="text-sm">
                      {JSON.stringify(testResponse, null, 2)}
                    </pre>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Code Examples</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">cURL</h4>
                    <Button variant="ghost" size="sm">
                      <Copy size={16} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{getCurlExample(selected)}</pre>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">JavaScript (fetch)</h4>
                    <Button variant="ghost" size="sm">
                      <Copy size={16} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                    <pre className="text-sm">{getFetchExample(selected)}</pre>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Standards Compliance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Badge variant="success">HL7 FHIR R4</Badge>
                <Badge variant="success">HL7 v2.5</Badge>
                <Badge variant="info">REST</Badge>
                <Badge variant="info">JSON</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
