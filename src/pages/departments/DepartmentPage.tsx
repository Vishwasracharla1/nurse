import React, { useEffect, useState } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { api } from '../../services/api';
import { Department, KPI, Task, Agent, AuditEvent } from '../../types';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Clock, User } from 'lucide-react';
import VitalsComplianceEChart from '../../components/charts/VitalsComplianceEChart';
import MedAccuracyEChart from '../../components/charts/MedAccuracyEChart';
import DischargeBeforeNoonEChart from '../../components/charts/DischargeBeforeNoonEChart';
import ReadmitRateEChart from '../../components/charts/ReadmitRateEChart';

interface DepartmentPageProps {
  dept: Department;
  title: string;
  description: string;
  quickActions: { label: string; action: () => void }[];
}

export function DepartmentPage({ dept, title, description, quickActions }: DepartmentPageProps) {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    api.kpis.getAll(dept).then(setKpis);
    api.departments.getTasks(dept).then(setTasks);
    api.agents.getAll(dept).then(setAgents);
    api.audit.getAll({ dept }).then(data => setEvents(data.slice(0, 10)));
  }, [dept]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Complete': return 'success';
      case 'In Progress': return 'warning';
      case 'Pending': return 'default';
      default: return 'default';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {kpis.map((kpi, index) => {
          const isMetTarget = kpi.unit === '%'
            ? kpi.value >= kpi.target
            : kpi.value <= kpi.target;

          const chartData = kpi.trend.map(point => ({
            date: new Date(point.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            value: point.value,
            target: kpi.target
          }));

          const getChartType = (kpiName: string) => {
            if (kpiName.includes('Compliance') || kpiName.includes('Accuracy')) return 'area';
            if (kpiName.includes('Time') || kpiName.includes('Readmit')) return 'line';
            return 'bar';
          };

          const chartType = getChartType(kpi.name);

          if (kpi.name === 'Vitals Compliance') {
            return (
              <div key={kpi.id}>
                <VitalsComplianceEChart title={kpi.name} target={typeof kpi.target === 'number' ? kpi.target : 95} />
              </div>
            );
          }

          if (kpi.name === 'Med Accuracy (BCMA)') {
            return (
              <div key={kpi.id}>
                <MedAccuracyEChart title={kpi.name} target={typeof kpi.target === 'number' ? kpi.target : 99.5} />
              </div>
            );
          }

          if (kpi.name === 'Discharge Before Noon') {
            return (
              <div key={kpi.id}>
                <DischargeBeforeNoonEChart title={kpi.name} target={typeof kpi.target === 'number' ? kpi.target : 90} />
              </div>
            );
          }

          if (kpi.name === '30-Day Readmit Rate') {
            return (
              <div key={kpi.id}>
                <ReadmitRateEChart title={kpi.name} target={typeof kpi.target === 'number' ? kpi.target : 10} />
              </div>
            );
          }

          return (
            <Card key={kpi.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">{kpi.name}</CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {kpi.value}{kpi.unit === '%' ? '%' : kpi.unit === 'mins' ? 'm' : ''}
                        </span>
                        <Badge variant={isMetTarget ? 'success' : 'warning'}>
                          {isMetTarget ? 'On Track' : 'At Risk'}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-500">Target: {kpi.target}{kpi.unit === '%' ? '%' : kpi.unit === 'mins' ? 'm' : ''}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  {chartType === 'area' ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id={`gradient-${kpi.id}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0d9488" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                      />
                      <Legend />
                      <ReferenceLine
                        y={kpi.target}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        label={{ value: 'Target', position: 'right', fill: '#f59e0b', fontSize: 12 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#0d9488"
                        strokeWidth={2}
                        fill={`url(#gradient-${kpi.id})`}
                        name="Actual"
                      />
                    </AreaChart>
                  ) : chartType === 'line' ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                      />
                      <Legend />
                      <ReferenceLine
                        y={kpi.target}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        label={{ value: 'Target', position: 'right', fill: '#f59e0b', fontSize: 12 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0d9488"
                        strokeWidth={2}
                        dot={{ fill: '#0d9488', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Actual"
                      />
                    </LineChart>
                  ) : (
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <YAxis
                        tick={{ fontSize: 12 }}
                        stroke="#6b7280"
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '0.5rem' }}
                      />
                      <Legend />
                      <ReferenceLine
                        y={kpi.target}
                        stroke="#f59e0b"
                        strokeDasharray="3 3"
                        label={{ value: 'Target', position: 'right', fill: '#f59e0b', fontSize: 12 }}
                      />
                      <Bar
                        dataKey="value"
                        fill="#0d9488"
                        name="Actual"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Task Board</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                        <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                        <Badge variant={getStatusColor(task.status) as any}>{task.status}</Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        Patient: {task.patientName} ({task.patientId})
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User size={14} className="mr-1" /> {task.owner}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" /> Due: {new Date(task.due).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action, idx) => (
                  <Button
                    key={idx}
                    variant="secondary"
                    className="w-full justify-start"
                    onClick={action.action}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Active Agents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {agents.map((agent) => (
                  <div key={agent.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle size={16} className={agent.status === 'Active' ? 'text-green-500' : 'text-gray-400'} />
                      <span className="text-sm font-medium text-gray-900">{agent.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{agent.compliance}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className="flex items-start space-x-3 p-3 border-l-4 border-teal-500 bg-gray-50 rounded-r">
                <AlertCircle size={20} className="text-teal-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{event.agentName}</h4>
                    <span className="text-xs text-gray-500">{new Date(event.timestamp).toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-700">{event.action}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="info">{event.standard}</Badge>
                    <Badge variant="default">{event.actor}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedTask && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedTask(null)}
          title="Task Details"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Title</h4>
              <p className="text-gray-700">{selectedTask.title}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Priority</h4>
                <Badge variant={getPriorityColor(selectedTask.priority) as any}>{selectedTask.priority}</Badge>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Status</h4>
                <Badge variant={getStatusColor(selectedTask.status) as any}>{selectedTask.status}</Badge>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Patient</h4>
              <p className="text-gray-700">{selectedTask.patientName} ({selectedTask.patientId})</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Assigned To</h4>
              <p className="text-gray-700">{selectedTask.owner}</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Due Date</h4>
              <p className="text-gray-700">{new Date(selectedTask.due).toLocaleString()}</p>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <Button variant="primary" className="w-full">Mark as Complete</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
