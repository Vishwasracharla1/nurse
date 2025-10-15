import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { KPI, Department } from '../types';
import { TrendingUp, TrendingDown, Database } from 'lucide-react';

export function KPIs() {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedKpi, setSelectedKpi] = useState<KPI | null>(null);
  const [filterDept, setFilterDept] = useState<Department | 'ALL'>('ALL');

  useEffect(() => {
    api.kpis.getAll().then(setKpis);
  }, []);

  const filteredKpis = kpis.filter(kpi => filterDept === 'ALL' || kpi.dept === filterDept || kpi.dept === 'ALL');

  const deptComparison = ['IP', 'OP', 'ED', 'OR'].map(dept => {
    const deptKpis = kpis.filter(k => k.dept === dept);
    const avgValue = deptKpis.length > 0
      ? deptKpis.reduce((sum, k) => sum + k.value, 0) / deptKpis.length
      : 0;
    return { dept, avgValue: Math.round(avgValue * 10) / 10 };
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Key Performance Indicators</h1>
        <p className="text-gray-600">Monitor and analyze clinical performance metrics across all departments</p>
      </div>

      <div className="mb-6">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {filteredKpis.map((kpi) => {
          const isMetTarget = kpi.unit === '%'
            ? kpi.value >= kpi.target
            : kpi.value <= kpi.target;
          const trend = kpi.trend.length > 1
            ? kpi.trend[kpi.trend.length - 1].value - kpi.trend[kpi.trend.length - 2].value
            : 0;

          return (
            <Card key={kpi.id} onClick={() => setSelectedKpi(kpi)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base mb-1">{kpi.name}</CardTitle>
                    <Badge variant="info">{kpi.dept}</Badge>
                  </div>
                  {trend !== 0 && (
                    <div className={trend > 0 ? 'text-green-500' : 'text-red-500'}>
                      {trend > 0 ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {kpi.value}{kpi.unit === '%' ? '%' : kpi.unit === 'mins' ? 'm' : ''}
                  </div>
                  <div className="text-sm text-gray-600">
                    Target: {kpi.target}{kpi.unit === '%' ? '%' : kpi.unit === 'mins' ? 'm' : ''}
                  </div>
                </div>

                <div className="mb-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${isMetTarget ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${Math.min(100, (kpi.value / kpi.target) * 100)}%` }}
                    />
                  </div>
                </div>

                <Badge variant={isMetTarget ? 'success' : 'warning'}>
                  {isMetTarget ? 'On Track' : 'At Risk'}
                </Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedKpi && (
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{selectedKpi.name}</CardTitle>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="info">{selectedKpi.dept}</Badge>
                  <span className="text-sm text-gray-600">Source: {selectedKpi.source}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedKpi(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                Close
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Trend Over Time</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={selectedKpi.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#0d9488" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2 mb-2">
                <Database size={20} className="text-gray-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">SQL Query</h4>
                  <code className="text-sm text-gray-700 bg-white p-2 rounded block overflow-x-auto">
                    {selectedKpi.sql}
                  </code>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Department Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={deptComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dept" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgValue" fill="#0d9488" name="Average KPI Value" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
