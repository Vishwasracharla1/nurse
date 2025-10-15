import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TrendingUp, DollarSign, Clock, Users, AlertCircle } from 'lucide-react';

export function ROI() {
  const [inputs, setInputs] = useState({
    nurseRatio: 6,
    avgTasksPerDay: 40,
    timePerTaskMins: 5,
    hourlyWage: 35,
    complianceBaseline: 85,
    errorRateBaseline: 3,
  });

  const calculate = () => {
    const hoursPerDay = (inputs.avgTasksPerDay * inputs.timePerTaskMins) / 60;
    const timeSavedPercent = 0.35;
    const hoursSaved = hoursPerDay * timeSavedPercent;
    const costSavedPerDay = hoursSaved * inputs.hourlyWage;
    const costSavedPerYear = costSavedPerDay * 250;

    const complianceUplift = 98 - inputs.complianceBaseline;
    const errorReduction = ((inputs.errorRateBaseline - 0.8) / inputs.errorRateBaseline) * 100;

    return {
      hoursSavedPerDay: hoursSaved.toFixed(1),
      costSavedPerDay: costSavedPerDay.toFixed(2),
      costSavedPerYear: costSavedPerYear.toFixed(2),
      complianceUplift: complianceUplift.toFixed(1),
      errorReduction: errorReduction.toFixed(1),
      riskReduction: (errorReduction * 0.6).toFixed(1),
    };
  };

  const results = calculate();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ROI Calculator</h1>
        <p className="text-gray-600">Calculate the financial and operational impact of Mobius AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Parameters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nurse:Patient Ratio
                </label>
                <input
                  type="number"
                  value={inputs.nurseRatio}
                  onChange={(e) => setInputs({ ...inputs, nurseRatio: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Average Tasks Per Day
                </label>
                <input
                  type="number"
                  value={inputs.avgTasksPerDay}
                  onChange={(e) => setInputs({ ...inputs, avgTasksPerDay: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Per Task (minutes)
                </label>
                <input
                  type="number"
                  value={inputs.timePerTaskMins}
                  onChange={(e) => setInputs({ ...inputs, timePerTaskMins: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hourly Wage ($)
                </label>
                <input
                  type="number"
                  value={inputs.hourlyWage}
                  onChange={(e) => setInputs({ ...inputs, hourlyWage: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Compliance Baseline (%)
                </label>
                <input
                  type="number"
                  value={inputs.complianceBaseline}
                  onChange={(e) => setInputs({ ...inputs, complianceBaseline: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Error Rate (%)
                </label>
                <input
                  type="number"
                  value={inputs.errorRateBaseline}
                  onChange={(e) => setInputs({ ...inputs, errorRateBaseline: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <Button variant="primary" className="w-full">
                Save Scenario
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Clock size={24} className="text-teal-600" />
                <CardTitle>Time Savings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-teal-600 mb-1">
                    {results.hoursSavedPerDay} hrs
                  </div>
                  <div className="text-sm text-gray-600">Saved Per Day Per Nurse</div>
                </div>
                <div className="p-4 bg-teal-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    35% reduction in manual documentation and task coordination time
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <DollarSign size={24} className="text-green-600" />
                <CardTitle>Cost Savings</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-1">
                    ${results.costSavedPerYear}
                  </div>
                  <div className="text-sm text-gray-600">Per Year Per Nurse</div>
                </div>
                <div className="text-sm text-gray-600">
                  Daily Savings: <span className="font-semibold">${results.costSavedPerDay}</span>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Labor cost reduction through automation of routine tasks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <TrendingUp size={24} className="text-blue-600" />
                <CardTitle>Compliance Improvement</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-1">
                    +{results.complianceUplift}%
                  </div>
                  <div className="text-sm text-gray-600">Compliance Uplift</div>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Projected increase to 98% compliance across all standards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <AlertCircle size={24} className="text-orange-600" />
                <CardTitle>Risk Reduction</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-orange-600 mb-1">
                    -{results.errorReduction}%
                  </div>
                  <div className="text-sm text-gray-600">Error Rate Reduction</div>
                </div>
                <div className="text-sm text-gray-600 mb-2">
                  Clinical Risk: <span className="font-semibold">-{results.riskReduction}%</span>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-700">
                    Reduction in medication errors, documentation gaps, and missed protocols
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Assumptions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span>AI agents reduce documentation time by 35% through auto-generation and BCMA automation</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span>Compliance reaches 98% through continuous monitoring and real-time alerts</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span>Error rates drop by 73% through validation, cross-checks, and protocol enforcement</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span>Calculations based on 250 working days per year</span>
            </li>
            <li className="flex items-start">
              <span className="text-teal-600 mr-2">•</span>
              <span>Risk reduction calculated as 60% of error reduction, accounting for clinical severity weighting</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
