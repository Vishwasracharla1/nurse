import React from 'react';
import { useRole } from '../contexts/RoleContext';
import { Role } from '../types';
import { UserCircle } from 'lucide-react';

export function RoleSwitcher() {
  const { role, setRole } = useRole();
  const roles: Role[] = ['Nurse', 'Charge Nurse', 'Admin'];

  return (
    <div className="relative inline-block">
      <div className="flex items-center space-x-2">
        <UserCircle size={20} className="text-gray-600" />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="bg-white border border-gray-300 rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
