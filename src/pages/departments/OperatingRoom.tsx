import React from 'react';
import { DepartmentPage } from './DepartmentPage';

export function OperatingRoom() {
  const quickActions = [
    { label: 'WHO Checklist', action: () => alert('ORGuard checklist initiated') },
    { label: 'Surgical Timeout', action: () => alert('TimeOutX verification started') },
    { label: 'Instrument Count', action: () => alert('InstrumentIQ counting active') },
    { label: 'PACU Handoff', action: () => alert('PACUGuard readiness check') },
  ];

  return (
    <DepartmentPage
      dept="OR"
      title="Operating Room (OR)"
      description="Surgical safety with WHO checklist automation, instrument verification, and post-op handoffs"
      quickActions={quickActions}
    />
  );
}
