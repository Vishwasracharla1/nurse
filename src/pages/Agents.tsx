import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { Agent, Department } from '../types';
import { Activity, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filterDept, setFilterDept] = useState<Department | 'ALL'>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'Active' | 'Idle' | 'Error'>('ALL');

  useEffect(() => {
    api.agents.getAll().then(setAgents);
  }, []);

  const filteredAgents = agents.filter(agent => {
    if (filterDept !== 'ALL' && agent.dept !== filterDept) return false;
    if (filterStatus !== 'ALL' && agent.status !== filterStatus) return false;
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle size={20} className="text-green-500" />;
      case 'Error': return <AlertCircle size={20} className="text-red-500" />;
      case 'Idle': return <Clock size={20} className="text-gray-400" />;
      default: return <Activity size={20} className="text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active': return <Badge variant="success">{status}</Badge>;
      case 'Error': return <Badge variant="error">{status}</Badge>;
      case 'Idle': return <Badge variant="default">{status}</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">AI Agents</h1>
        <p className="text-gray-600">Monitor and manage your digital clinical assistants</p>
      </div>

      <div className="flex space-x-4 mb-6">
        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="ALL">All Departments</option>
          <option value="IP">In-Patient</option>
          <option value="OP">Out-Patient</option>
          <option value="ED">Emergency</option>
          <option value="OR">Operating Room</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          <option value="ALL">All Status</option>
          <option value="Active">Active</option>
          <option value="Idle">Idle</option>
          <option value="Error">Error</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map((agent) => (
          <Card key={agent.id} onClick={() => setSelectedAgent(agent)}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                {getStatusIcon(agent.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="info">{agent.dept}</Badge>
                  {getStatusBadge(agent.status)}
                </div>

                <p className="text-sm text-gray-600">{agent.purpose}</p>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Compliance</span>
                    <span className="text-sm font-semibold text-teal-600">{agent.compliance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-teal-600 h-2 rounded-full"
                      style={{ width: `${agent.compliance}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <p className="text-xs text-gray-500">{agent.lastAction}</p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {agent.standards.map(std => (
                    <Badge key={std} variant="default">{std}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAgent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedAgent(null)}
          title={selectedAgent.name}
          size="lg"
        >
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-4 mb-4">
                <Badge variant="info">{selectedAgent.dept}</Badge>
                {getStatusBadge(selectedAgent.status)}
                <span className="text-sm text-gray-500">{selectedAgent.lastAction}</span>
              </div>
              <p className="text-gray-700">{selectedAgent.purpose}</p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Inputs</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.inputs.map(input => (
                  <Badge key={input} variant="info">{input}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Outputs</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.outputs.map(output => (
                  <Badge key={output} variant="success">{output}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Dependencies</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.dependencies.map(dep => (
                  <Badge key={dep} variant="default">{dep}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Mapped Standards</h4>
              <div className="flex flex-wrap gap-2">
                {selectedAgent.standards.map(std => (
                  <Badge key={std} variant="warning">{std}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Recent Actions</h4>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {selectedAgent.recentActions.map((action, idx) => (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{action.action}</p>
                      <p className="text-xs text-gray-500">{new Date(action.ts).toLocaleString()}</p>
                    </div>
                    <Badge variant="success" className="flex-shrink-0">{action.outcome}</Badge>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Performance</h4>
              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-lg">
                <span className="text-sm text-gray-700">Compliance Rate</span>
                <span className="text-2xl font-bold text-teal-600">{selectedAgent.compliance}%</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
