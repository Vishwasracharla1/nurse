import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { api } from '../services/api';
import { AuditEvent, Department } from '../types';
import { FileText, Download, Filter, Clock, User, Shield } from 'lucide-react';

export function Audit() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<AuditEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [filters, setFilters] = useState({
    agentId: '',
    standard: '',
    dept: '' as Department | '',
    actor: '' as 'DH' | 'OH' | ''
  });

  useEffect(() => {
    api.audit.getAll().then(data => {
      setEvents(data);
      setFilteredEvents(data);
    });
  }, []);

  useEffect(() => {
    let filtered = [...events];
    if (filters.agentId) filtered = filtered.filter(e => e.agentId.includes(filters.agentId));
    if (filters.standard) filtered = filtered.filter(e => e.standard.includes(filters.standard));
    if (filters.dept) filtered = filtered.filter(e => e.dept === filters.dept);
    if (filters.actor) filtered = filtered.filter(e => e.actor === filters.actor);
    setFilteredEvents(filtered);
  }, [filters, events]);

  const exportToJson = () => {
    const dataStr = JSON.stringify(filteredEvents, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `audit-export-${new Date().toISOString()}.json`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Audit Trail</h1>
            <p className="text-gray-600">Immutable logs of all agent actions and clinical events</p>
          </div>
          <Button variant="primary" onClick={exportToJson}>
            <Download size={18} className="mr-2" />
            Export JSON
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-600" />
            <CardTitle>Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Agent ID"
              value={filters.agentId}
              onChange={(e) => setFilters({ ...filters, agentId: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <input
              type="text"
              placeholder="Standard"
              value={filters.standard}
              onChange={(e) => setFilters({ ...filters, standard: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <select
              value={filters.dept}
              onChange={(e) => setFilters({ ...filters, dept: e.target.value as Department | '' })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Departments</option>
              <option value="IP">In-Patient</option>
              <option value="OP">Out-Patient</option>
              <option value="ED">Emergency</option>
              <option value="OR">Operating Room</option>
            </select>
            <select
              value={filters.actor}
              onChange={(e) => setFilters({ ...filters, actor: e.target.value as 'DH' | 'OH' | '' })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">All Actors</option>
              <option value="DH">Digital Human</option>
              <option value="OH">Operational Human</option>
            </select>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Showing {filteredEvents.length} of {events.length} events
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setFilters({ agentId: '', standard: '', dept: '', actor: '' })}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Event Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex-shrink-0 mt-1">
                  <FileText size={20} className="text-teal-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">{event.agentName}</h4>
                    <div className="flex items-center space-x-2">
                      <Badge variant="info">{event.dept}</Badge>
                      <Badge variant={event.actor === 'DH' ? 'default' : 'warning'}>{event.actor}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{event.action}</p>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span className="flex items-center">
                      <Clock size={14} className="mr-1" />
                      {new Date(event.timestamp).toLocaleString()}
                    </span>
                    {event.patientId && (
                      <span className="flex items-center">
                        <User size={14} className="mr-1" />
                        Patient: {event.patientId}
                      </span>
                    )}
                    <span className="flex items-center">
                      <Shield size={14} className="mr-1" />
                      {event.standard}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {selectedEvent && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedEvent(null)}
          title="Audit Event Details"
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Event ID</h4>
                <code className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded">{selectedEvent.id}</code>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Timestamp</h4>
                <p className="text-sm text-gray-700">{new Date(selectedEvent.timestamp).toLocaleString()}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Agent</h4>
                <p className="text-sm text-gray-700">{selectedEvent.agentName} ({selectedEvent.agentId})</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Actor</h4>
                <Badge variant={selectedEvent.actor === 'DH' ? 'default' : 'warning'}>
                  {selectedEvent.actor === 'DH' ? 'Digital Human' : 'Operational Human'}
                </Badge>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Action</h4>
              <p className="text-sm text-gray-700">{selectedEvent.action}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Department</h4>
                <Badge variant="info">{selectedEvent.dept}</Badge>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Standard</h4>
                <Badge variant="warning">{selectedEvent.standard}</Badge>
              </div>
            </div>

            {selectedEvent.patientId && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Patient ID</h4>
                <p className="text-sm text-gray-700">{selectedEvent.patientId}</p>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Digital Signature</h4>
              <code className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded block overflow-x-auto">
                {selectedEvent.signature}
              </code>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Hash</h4>
              <code className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded block overflow-x-auto">
                {selectedEvent.hash}
              </code>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Notes</h4>
              <p className="text-sm text-gray-700">{selectedEvent.notes}</p>
            </div>

            <div className="pt-4 border-t border-gray-200 flex space-x-3">
              <Button variant="primary" className="flex-1">
                <Download size={18} className="mr-2" />
                Export PDF
              </Button>
              <Button variant="secondary" className="flex-1">
                View Full Chain
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
