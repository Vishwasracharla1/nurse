import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, Stethoscope, Ambulance, ScissorsLineDashed, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { Agent } from '../types';

export function Home() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    api.agents.getAll().then(setAgents);
  }, []);

  const departments = [
    {
      name: 'In-Patient (IP)',
      href: '/departments/ip',
      icon: Activity,
      color: 'bg-blue-500',
      description: 'Ward management, vitals monitoring, medication verification, and discharge planning',
    },
    {
      name: 'Out-Patient (OP)',
      href: '/departments/op',
      icon: Stethoscope,
      color: 'bg-green-500',
      description: 'Clinic flow, appointment management, and patient education tracking',
    },
    {
      name: 'Emergency Dept (ED)',
      href: '/departments/ed',
      icon: Ambulance,
      color: 'bg-red-500',
      description: 'Triage automation, LWBS prediction, and throughput optimization',
    },
    {
      name: 'Operating Room (OR)',
      href: '/departments/or',
      icon: ScissorsLineDashed,
      color: 'bg-orange-500',
      description: 'WHO checklist, instrument verification, and post-op handoffs',
    },
  ];

  const activeAgents = agents.filter(a => a.status === 'Active');
  const avgCompliance = agents.length > 0
    ? Math.round(agents.reduce((sum, a) => sum + a.compliance, 0) / agents.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Mobius AI Agent Ecosystem
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          Augmenting nursing and clinical workflows by coordinating Digital Humans with Operational Humans
          for safer, more compliant care delivery.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">{activeAgents.length}</div>
            <div className="text-sm text-gray-600">Active Agents</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">{avgCompliance}%</div>
            <div className="text-sm text-gray-600">Avg Compliance</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">24/7</div>
            <div className="text-sm text-gray-600">Monitoring</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Departments</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {departments.map((dept) => (
            <Link key={dept.name} to={dept.href}>
              <Card className="h-full hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className={`${dept.color} p-3 rounded-lg text-white`}>
                      <dept.icon size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
                        {dept.name}
                        <ArrowRight size={20} className="ml-2 text-gray-400" />
                      </h3>
                      <p className="text-sm text-gray-600">{dept.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Live Agent Status</h2>
          <Link to="/agents" className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
            View All <ArrowRight size={18} className="ml-1" />
          </Link>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.slice(0, 6).map((agent) => (
                <div key={agent.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                  <div className="flex-shrink-0 mt-1">
                    {agent.status === 'Active' ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : agent.status === 'Error' ? (
                      <AlertCircle size={20} className="text-red-500" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-semibold text-gray-900">{agent.name}</h4>
                      <Badge variant="info">{agent.dept}</Badge>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{agent.lastAction}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Compliance</span>
                      <span className="text-xs font-semibold text-teal-600">{agent.compliance}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-teal-600 h-1.5 rounded-full"
                        style={{ width: `${agent.compliance}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
