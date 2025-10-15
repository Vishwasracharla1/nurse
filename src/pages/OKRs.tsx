import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { api } from '../services/api';
import { Objective, KPI } from '../types';
import { Target, ChevronRight, ChevronDown } from 'lucide-react';

export function OKRs() {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.okrs.getAll().then(setObjectives);
    api.kpis.getAll().then(setKpis);
  }, []);

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON_TRACK': return 'success';
      case 'AT_RISK': return 'warning';
      case 'OFF_TRACK': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'ON_TRACK': return 'On Track';
      case 'AT_RISK': return 'At Risk';
      case 'OFF_TRACK': return 'Off Track';
      default: return status;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Company': return 'bg-purple-100 text-purple-800';
      case 'Department': return 'bg-blue-100 text-blue-800';
      case 'Unit': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderObjective = (obj: Objective, depth: number = 0) => {
    const isExpanded = expandedIds.has(obj.id);
    const hasChildren = obj.children && obj.children.length > 0;

    const overallStatus = obj.keyResults.length > 0
      ? obj.keyResults.filter(kr => kr.status === 'ON_TRACK').length / obj.keyResults.length >= 0.7
        ? 'ON_TRACK'
        : obj.keyResults.filter(kr => kr.status === 'OFF_TRACK').length > 0
        ? 'OFF_TRACK'
        : 'AT_RISK'
      : 'ON_TRACK';

    return (
      <div key={obj.id} className={depth > 0 ? 'ml-8 mt-4' : 'mt-4'}>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                {hasChildren && (
                  <button
                    onClick={() => toggleExpand(obj.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>
                )}
                {!hasChildren && <div className="w-5" />}
                <Target size={20} className="text-teal-600" />
                <div className="flex-1">
                  <CardTitle className="text-lg">{obj.title}</CardTitle>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getLevelColor(obj.level)}`}>
                      {obj.level}
                    </span>
                    <span className="text-sm text-gray-600">Owner: {obj.owner}</span>
                  </div>
                </div>
                <Badge variant={getStatusColor(overallStatus) as any}>
                  {getStatusLabel(overallStatus)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Key Results</h4>
              {obj.keyResults.map((kr) => {
                const linkedKpi = kpis.find(k => k.id === kr.metricId);
                const progress = (kr.current / kr.target) * 100;

                return (
                  <div key={kr.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        {linkedKpi && (
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {linkedKpi.name}
                          </div>
                        )}
                        <div className="text-xs text-gray-600">
                          Current: {kr.current} / Target: {kr.target}
                        </div>
                      </div>
                      <Badge variant={getStatusColor(kr.status) as any}>
                        {getStatusLabel(kr.status)}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          kr.status === 'ON_TRACK' ? 'bg-green-500' :
                          kr.status === 'AT_RISK' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(100, progress)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {hasChildren && isExpanded && obj.children!.map(child => renderObjective(child, depth + 1))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Objectives & Key Results</h1>
            <p className="text-gray-600">Strategic planning and tracking across organizational levels</p>
          </div>
          <Button variant="primary">
            Create New Objective
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-teal-600 mb-2">{objectives.length}</div>
            <div className="text-sm text-gray-600">Total Objectives</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {objectives.reduce((sum, obj) => sum + obj.keyResults.filter(kr => kr.status === 'ON_TRACK').length, 0)}
            </div>
            <div className="text-sm text-gray-600">On Track</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="text-center py-6">
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              {objectives.reduce((sum, obj) => sum + obj.keyResults.filter(kr => kr.status === 'AT_RISK').length, 0)}
            </div>
            <div className="text-sm text-gray-600">At Risk</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {objectives.map(obj => renderObjective(obj))}
      </div>
    </div>
  );
}
