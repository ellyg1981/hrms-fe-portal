import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import DataTable from '../../../components/common/DataTable/DataTable';
import './RequestsPage.css';

const REQUESTS = {
  leave: [
    { id: 'LR-2026-001', type: 'Annual Leave', date: '2026-06-15', status: 'Pending', desc: 'Requesting 14 days leave from July 1' },
    { id: 'LR-2026-002', type: 'Sick Leave', date: '2026-05-10', status: 'Approved', desc: 'Medical leave for 3 days' },
  ],
  training: [
    { id: 'TR-2026-001', type: 'Cybersecurity Training', date: '2026-06-20', status: 'Approved', desc: 'Mandatory security awareness course' },
  ],
  general: [
    { id: 'GR-2026-001', type: 'Workstation Update', date: '2026-06-10', status: 'Pending', desc: 'Request to update current workstation' },
    { id: 'GR-2025-015', type: 'Dependant Update', date: '2025-08-12', status: 'Approved', desc: 'Added new dependant information' },
  ],
};

const STATUS_COLORS = {
  Pending:      { bg: '#FFFBEB', color: '#D97706' },
  Approved:     { bg: '#ECFDF5', color: '#059669' },
  Rejected:     { bg: '#FFF1F2', color: '#BE123C' },
  Completed:    { bg: '#F5F3FF', color: '#7C3AED' },
  'Under Review': { bg: '#EAF4FF', color: '#2F80ED' },
};

const TAB_LABELS = [
  { key: 'leave', label: 'Leave Requests' },
  { key: 'training', label: 'Training Requests' },
  { key: 'general', label: 'General Requests' },
];

function RequestsPage() {
  const [activeTab, setActiveTab] = useState('leave');

  const items = REQUESTS[activeTab] || [];

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar title="Requests & Approvals" subtitle="Track all your submitted requests" color="#0B2E59" />

        <div className="requests-tabs tabs">
          {TAB_LABELS.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <DataTable
          columns={[
            { key: 'id', header: 'ID', render: row => <span className="id-badge">{row.id}</span> },
            { key: 'type', header: 'Type' },
            { key: 'desc', header: 'Description' },
            { key: 'date', header: 'Date' },
            { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_COLORS[row.status]?.bg || '#EAF4FF', color: STATUS_COLORS[row.status]?.color || '#2F80ED' }}>{row.status}</span> },
          ]}
          data={items}
          title={TAB_LABELS.find(t => t.key === activeTab)?.label || 'Requests'}
          searchPlaceholder="Search by ID, type, or status..."
          emptyState={{ title: 'No requests found', description: 'You have not submitted any requests in this category.' }}
        />
      </main>
    </div>
  );
}

export default RequestsPage;
