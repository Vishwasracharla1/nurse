import React from 'react';
import { DepartmentPage } from './DepartmentPage';

export function Emergency() {
  const quickActions = [
    { label: 'Triage Assessment', action: () => alert('TriageMate acuity scoring started') },
    { label: 'LWBS Watch', action: () => alert('Watchtower monitoring active') },
    { label: 'ED Throughput', action: () => alert('FlowRunner optimization displayed') },
    { label: 'Fast Track Patient', action: () => alert('Fast track initiated') },
  ];

  return (
    <DepartmentPage
      dept="ED"
      title="Emergency Department (ED)"
      description="Triage automation, LWBS prediction, and throughput optimization for critical care"
      quickActions={quickActions}
    />
  );
}
