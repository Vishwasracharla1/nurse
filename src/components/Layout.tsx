import React, { ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RoleSwitcher } from './RoleSwitcher';
import { useRole } from '../contexts/RoleContext';
import {
  Home, Users, Building2, BarChart3, Target, Shield,
  FileText, Database, Code, TrendingUp, BookOpen, HelpCircle,
  Settings, Search, Menu, X, Activity, Stethoscope, Ambulance, ScissorsLineDashed
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const { role } = useRole();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Home', href: '/', icon: Home, roles: ['Nurse', 'Charge Nurse', 'Admin'] },
    {
      name: 'Agents',
      icon: Users,
      roles: ['Nurse', 'Charge Nurse', 'Admin'],
      children: [
        { name: 'AI Agents', href: '/agents', icon: Users, roles: ['Nurse', 'Charge Nurse', 'Admin'] },
        { name: 'Audit Logs', href: '/audit', icon: FileText, roles: ['Charge Nurse', 'Admin'] },
      ]
    },
    {
      name: 'Departments',
      icon: Building2,
      roles: ['Nurse', 'Charge Nurse', 'Admin'],
      children: [
        { name: 'In-Patient (IP)', href: '/departments/ip', icon: Activity },
        { name: 'Out-Patient (OP)', href: '/departments/op', icon: Stethoscope },
        { name: 'Emergency Dept (ED)', href: '/departments/ed', icon: Ambulance },
        { name: 'Operating Room (OR)', href: '/departments/or', icon: ScissorsLineDashed },
      ]
    },
    {
      name: 'Case Studies',
      icon: BookOpen,
      roles: ['Nurse', 'Charge Nurse', 'Admin'],
      children: [
        { name: 'Case Study', href: '/case-studies', icon: BookOpen, roles: ['Nurse', 'Charge Nurse', 'Admin'] },
        { name: 'OKRs', href: '/okrs', icon: Target, roles: ['Charge Nurse', 'Admin'] },
        { name: 'KPIs', href: '/kpis', icon: BarChart3, roles: ['Charge Nurse', 'Admin'] },
      ]
    },
    { name: 'Compliance', href: '/compliance', icon: Shield, roles: ['Charge Nurse', 'Admin'] },
    { name: 'BO Schema', href: '/bo-schema', icon: Database, roles: ['Admin'] },
    { name: 'API Docs', href: '/api-docs', icon: Code, roles: ['Admin'] },
    { name: 'ROI', href: '/roi', icon: TrendingUp, roles: ['Admin'] },
    { name: 'Help', href: '/help', icon: HelpCircle, roles: ['Nurse', 'Charge Nurse', 'Admin'] },
    { name: 'Admin', href: '/admin', icon: Settings, roles: ['Admin'] },
  ];

  const visibleNav = navigation.filter(item => item.roles.includes(role));

  const isActive = (href?: string) => {
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-gray-500 hover:text-gray-700"
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Link to="/" className="flex items-center space-x-2">
                <Activity className="text-teal-600" size={32} />
                <span className="text-xl font-bold text-gray-900">Mobius AI</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4 flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search agents, patients, tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <RoleSwitcher />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-16">
        <aside
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0'
          } overflow-hidden`}
        >
          <nav className="px-3 py-4 space-y-1 overflow-y-auto h-full">
            {visibleNav.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <div className="flex items-center px-3 py-2 text-sm font-medium text-gray-700">
                      <item.icon size={20} className="mr-3" />
                      {item.name}
                    </div>
                    <div className="ml-6 space-y-1">
                      {item.children
                        .filter((child: any) => !child.roles || child.roles.includes(role))
                        .map((child) => (
                          <Link
                            key={child.href}
                            to={child.href}
                            className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                              isActive(child.href)
                                ? 'bg-teal-50 text-teal-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <child.icon size={18} className="mr-3" />
                            {child.name}
                          </Link>
                        ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href!}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href)
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </aside>

        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
