import React from 'react';
import { DepartmentPage } from './DepartmentPage';

export function OutPatient() {
  const quickActions = [
    { label: 'Check-In Patient', action: () => alert('RegAssist check-in started') },
    { label: 'Clinic Flow Status', action: () => alert('ClinicFlow status displayed') },
    { label: 'Patient Education', action: () => alert('EduCoach tracker opened') },
    { label: 'Appointment Scheduling', action: () => alert('Scheduling interface opened') },
  ];

  return (
    <DepartmentPage
      dept="OP"
      title="Out-Patient Department (OP)"
      description="Clinic flow optimization, appointment management, and patient education tracking"
      quickActions={quickActions}
    />
  );
}
