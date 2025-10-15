import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { api } from '../services/api';
import { CaseStudy } from '../types';
import { BookOpen, TrendingUp, CheckCircle } from 'lucide-react';

export function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);

  useEffect(() => {
    api.caseStudies.getAll().then(setCaseStudies);
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Case Studies</h1>
        <p className="text-gray-600">Real-world outcomes from Mobius AI implementations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caseStudies.map((study) => (
          <Card key={study.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <BookOpen size={24} className="text-teal-600" />
                  <div>
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                    <Badge variant="info" className="mt-2">{study.dept}</Badge>
                  </div>
                </div>
                <TrendingUp size={24} className="text-green-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Metric</h4>
                  <p className="text-sm text-gray-700">{study.metric}</p>
                </div>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <CheckCircle size={18} className="text-green-600" />
                    <span className="text-sm font-semibold text-green-900">Result</span>
                  </div>
                  <p className="text-2xl font-bold text-green-700">{study.improvement}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Method</h4>
                  <p className="text-sm text-gray-700">{study.method}</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Standards Met</h4>
                  <div className="flex flex-wrap gap-2">
                    {study.standards.map(std => (
                      <Badge key={std} variant="warning">{std}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Implementation Highlights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-teal-600 mb-2">42%</div>
              <div className="text-sm text-gray-600">Avg. Error Reduction</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-teal-600 mb-2">35%</div>
              <div className="text-sm text-gray-600">Time Savings</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-teal-600 mb-2">98%</div>
              <div className="text-sm text-gray-600">Compliance Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
