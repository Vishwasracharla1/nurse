import React from 'react';
import { DepartmentPage } from './DepartmentPage';

export function InPatient() {
  const quickActions = [
    { label: 'Admission Checklist', action: () => alert('Admission checklist initiated') },
    { label: 'Generate Discharge Summary', action: () => alert('DocuNurse generating summary') },
    { label: 'ISBAR Handoff', action: () => alert('Bridge handoff initiated') },
    { label: 'Medication Reconciliation', action: () => alert('MediCheck reconciliation started') },
  ];

  return (
    <DepartmentPage
      dept="IP"
      title="In-Patient Department (IP)"
      description="Ward management with vitals monitoring, medication verification, and discharge planning"
      quickActions={quickActions}
    />
  );
}
