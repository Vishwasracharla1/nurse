import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Settings, Users, Database, Shield, ToggleLeft } from 'lucide-react';

export function Admin() {
  const [settings, setSettings] = useState({
    autoAlerts: true,
    complianceNotifications: true,
    dataSync: true,
    auditLogging: true,
  });

  const roles = [
    { name: 'Nurse', permissions: ['View Tasks', 'View Alerts', 'Document Care'] },
    { name: 'Charge Nurse', permissions: ['View Tasks', 'View Alerts', 'Document Care', 'View KPIs', 'Approve Plans', 'Team Management'] },
    { name: 'Admin', permissions: ['All Permissions', 'Configure Settings', 'Manage Users', 'View ROI'] },
  ];

  const dataSources = [
    { name: 'EMR System', type: 'HL7 v2.5', status: 'Connected', lastSync: '2 mins ago' },
    { name: 'Pharmacy', type: 'REST API', status: 'Connected', lastSync: '5 mins ago' },
    { name: 'Lab System', type: 'FHIR R4', status: 'Connected', lastSync: '1 min ago' },
    { name: 'Analytics DB', type: 'PostgreSQL', status: 'Connected', lastSync: '30 secs ago' },
  ];

  const thresholds = [
    { metric: 'Vitals Compliance', current: 95, recommended: 98 },
    { metric: 'Med Accuracy', current: 99.5, recommended: 99.8 },
    { metric: 'Door-to-Triage', current: 10, recommended: 8 },
    { metric: 'LWBS Rate', current: 2, recommended: 1.5 },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Administration</h1>
        <p className="text-gray-600">System configuration and organizational settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Users size={24} className="text-teal-600" />
              <CardTitle>Roles & Permissions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.name} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">{role.name}</h4>
                    <Button variant="ghost" size="sm">Edit</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((perm) => (
                      <Badge key={perm} variant="info">{perm}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Database size={24} className="text-teal-600" />
              <CardTitle>Data Sources</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dataSources.map((source) => (
                <div key={source.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-semibold text-gray-900 mb-1">{source.name}</div>
                    <div className="text-xs text-gray-600">{source.type}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant="success">{source.status}</Badge>
                    <div className="text-xs text-gray-500 mt-1">{source.lastSync}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield size={24} className="text-teal-600" />
              <CardTitle>Threshold Configuration</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {thresholds.map((threshold) => (
                <div key={threshold.metric} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">{threshold.metric}</span>
                    <Button variant="ghost" size="sm">Adjust</Button>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">Current: {threshold.current}</span>
                    <span className="text-teal-600 font-semibold">Target: {threshold.recommended}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Settings size={24} className="text-teal-600" />
              <CardTitle>Feature Flags</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(settings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <ToggleLeft size={20} className={value ? 'text-teal-600' : 'text-gray-400'} />
                    <span className="text-sm font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, [key]: !value })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? 'bg-teal-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        value ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name
              </label>
              <input
                type="text"
                defaultValue="Healthcare System"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Zone
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500">
                <option>UTC-5 (Eastern)</option>
                <option>UTC-6 (Central)</option>
                <option>UTC-7 (Mountain)</option>
                <option>UTC-8 (Pacific)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Contact
              </label>
              <input
                type="email"
                defaultValue="admin@healthcare.org"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Key
              </label>
              <input
                type="text"
                defaultValue="MOBIUS-XXXX-XXXX-XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                disabled
              />
            </div>
          </div>
          <div className="mt-6">
            <Button variant="primary">Save Changes</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
