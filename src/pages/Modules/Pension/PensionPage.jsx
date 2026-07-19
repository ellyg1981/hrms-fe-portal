import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import DataTable from '../../../components/common/DataTable/DataTable';
import Modal from '../../../components/common/Modal/Modal';
import { notificationService } from '../../../components/Notifications/notificationService';
import './PensionPage.css';

const CONTRIBUTIONS = [
  { id: 'PC-2026-006', period: 'Jun 2026', employee: 250000, employer: 500000, total: 750000, status: 'Posted', date: '2026-06-30' },
  { id: 'PC-2026-005', period: 'May 2026', employee: 250000, employer: 500000, total: 750000, status: 'Posted', date: '2026-05-31' },
  { id: 'PC-2026-004', period: 'Apr 2026', employee: 250000, employer: 500000, total: 750000, status: 'Posted', date: '2026-04-30' },
  { id: 'PC-2026-003', period: 'Mar 2026', employee: 250000, employer: 500000, total: 750000, status: 'Posted', date: '2026-03-31' },
  { id: 'PC-2026-002', period: 'Feb 2026', employee: 250000, employer: 500000, total: 750000, status: 'Posted', date: '2026-02-28' },
  { id: 'PC-2026-001', period: 'Jan 2026', employee: 250000, employer: 500000, total: 750000, status: 'Posted', date: '2026-01-31' },
  { id: 'PC-2025-012', period: 'Dec 2025', employee: 240000, employer: 480000, total: 720000, status: 'Posted', date: '2025-12-31' },
  { id: 'PC-2025-011', period: 'Nov 2025', employee: 240000, employer: 480000, total: 720000, status: 'Posted', date: '2025-11-30' },
];

const STATEMENTS = [
  { id: 'PS-2026-H1', title: 'Pension Statement - H1 2026', period: 'Jan 2026 - Jun 2026', date: '2026-07-01', pages: 4, status: 'Available' },
  { id: 'PS-2025-FY', title: 'Pension Statement - FY 2025', period: 'Jul 2025 - Dec 2025', date: '2026-01-15', pages: 6, status: 'Available' },
  { id: 'PS-2025-H1', title: 'Pension Statement - H1 2025', period: 'Jan 2025 - Jun 2025', date: '2025-07-05', pages: 4, status: 'Available' },
];

const STATUS_STYLE = {
  'Posted': { background: '#ECFDF5', color: '#059669' },
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Available': { background: '#ECFDF5', color: '#059669' },
};

const TAB_ICONS = {
  overview: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  contributions: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  statements: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'contributions', label: 'Contribution History' },
  { key: 'statements', label: 'Statements' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(value);
}

function PensionPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const totalContributions = CONTRIBUTIONS.reduce((sum, c) => sum + c.total, 0);
  const totalEmployee = CONTRIBUTIONS.reduce((sum, c) => sum + c.employee, 0);
  const totalEmployer = CONTRIBUTIONS.reduce((sum, c) => sum + c.employer, 0);

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Pension Management"
          subtitle="View your pension contributions, statements, and projection"
          color="#DC2626"
        />

        <div className="tabs leave-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {TAB_ICONS[tab.key]}
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <>
            <div className="pension-overview-grid">
              <Card className="pension-stat-card" hover={false}>
                <div className="pension-stat-icon pension-stat-icon--primary">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div className="pension-stat-body">
                  <span className="pension-stat-value">{formatCurrency(totalContributions)}</span>
                  <span className="pension-stat-label">Total Contributions</span>
                </div>
              </Card>
              <Card className="pension-stat-card" hover>
                <div className="pension-stat-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
                <div className="pension-stat-body">
                  <span className="pension-stat-value">{formatCurrency(totalEmployee)}</span>
                  <span className="pension-stat-label">Employee Contributions</span>
                </div>
              </Card>
              <Card className="pension-stat-card" hover>
                <div className="pension-stat-icon" style={{ background: '#F0FDFA', color: '#0D9488' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                </div>
                <div className="pension-stat-body">
                  <span className="pension-stat-value">{formatCurrency(totalEmployer)}</span>
                  <span className="pension-stat-label">Employer Contributions</span>
                </div>
              </Card>
              <Card className="pension-stat-card" hover>
                <div className="pension-stat-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div className="pension-stat-body">
                  <span className="pension-stat-value">18 Years</span>
                  <span className="pension-stat-label">Years of Service</span>
                </div>
              </Card>
            </div>

            <div className="pension-bottom-row">
              <Card className="pension-bottom-card" hover={false}>
                <div className="leave-section-header">
                  <h3 className="leave-section-title">Recent Contributions</h3>
                </div>
                <div className="pension-recent-list">
                  {CONTRIBUTIONS.slice(0, 5).map(row => (
                    <div key={row.id} className="pension-recent-item">
                      <div className="pension-recent-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                      </div>
                      <div className="pension-recent-body">
                        <span className="pension-recent-title">{row.period} Contribution</span>
                        <span className="pension-recent-meta">Posted: {row.date} &middot; {formatCurrency(row.total)}</span>
                      </div>
                      <div className="pension-recent-amount">{formatCurrency(row.total)}</div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="pension-bottom-card" hover={false}>
                <div className="leave-section-header">
                  <h3 className="leave-section-title">Projected Monthly Pension</h3>
                  <p className="leave-section-desc">Based on current contribution rate and 25 years of service</p>
                </div>
                <div className="pension-projection">
                  <div className="pension-projection-main">
                    <div className="pension-projection-icon">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div className="pension-projection-body">
                      <span className="pension-projection-value">{formatCurrency(1850000)}</span>
                      <span className="pension-projection-label">Estimated monthly pension at retirement</span>
                    </div>
                  </div>
                  <div className="pension-projection-details">
                    <div className="pension-projection-detail">
                      <span className="pension-projection-detail-label">Target Income</span>
                      <span className="pension-projection-detail-value">{formatCurrency(2560000)}</span>
                    </div>
                    <div className="pension-projection-detail">
                      <span className="pension-projection-detail-label">Gap</span>
                      <span className="pension-projection-detail-value">{formatCurrency(710000)}</span>
                    </div>
                    <div className="pension-projection-detail">
                      <span className="pension-projection-detail-label">Retirement Age</span>
                      <span className="pension-projection-detail-value">60 Years</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        )}

        {activeTab === 'contributions' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Reference ID', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'period', header: 'Period' },
                { key: 'date', header: 'Posting Date' },
                { key: 'employee', header: 'Employee Share', render: row => <span>{formatCurrency(row.employee)}</span> },
                { key: 'employer', header: 'Employer Share', render: row => <span>{formatCurrency(row.employer)}</span> },
                { key: 'total', header: 'Total', render: row => <span className="pension-total">{formatCurrency(row.total)}</span> },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
              ]}
              data={CONTRIBUTIONS}
              title="Contribution History"
              searchPlaceholder="Search by period or reference ID..."
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(v => !v)}
              filters={[
                { key: 'status', label: 'Status', options: ['Posted', 'Pending'].map(s => ({ value: s, label: s })) },
              ]}
              loading={isLoading}
              refreshAction={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }}
              exportAction={() => notificationService.info('Exporting contribution history...')}
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => setSelectedRecord(row)} title="View Details">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button className="action-btn action-btn--download" onClick={() => notificationService.info('Downloading ' + row.id)} title="Download">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              )}
              emptyState={{ title: 'No contribution records found', description: 'No records match your search or filter criteria.' }}
            />

            {selectedRecord && (
              <Modal isOpen={!!selectedRecord} onClose={() => setSelectedRecord(null)} title={`Contribution Details - ${selectedRecord.id}`} size="md" footer={<button className="btn btn-secondary" onClick={() => setSelectedRecord(null)}>Close</button>}>
                <div className="leave-detail-modal">
                  <div className="leave-detail-section">
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Reference ID</span><span className="leave-detail-value">{selectedRecord.id}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Period</span><span className="leave-detail-value">{selectedRecord.period}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Posting Date</span><span className="leave-detail-value">{selectedRecord.date}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Status</span><span className="leave-detail-value"><span className="status-pill" style={{ background: STATUS_STYLE[selectedRecord.status]?.background, color: STATUS_STYLE[selectedRecord.status]?.color }}>{selectedRecord.status}</span></span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Employee Share</span><span className="leave-detail-value">{formatCurrency(selectedRecord.employee)}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Employer Share</span><span className="leave-detail-value">{formatCurrency(selectedRecord.employer)}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Total Contribution</span><span className="leave-detail-value pension-total">{formatCurrency(selectedRecord.total)}</span></div>
                    </div>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}

        {activeTab === 'statements' && (
          <>
            <div className="leave-section-header">
              <div><h3 className="leave-section-title">Pension Statements</h3><p className="leave-section-desc">Official pension statements and annual reports</p></div>
            </div>
            <div className="leave-doc-grid leave-doc-grid--3">
              {STATEMENTS.map(row => (
                <div key={row.id} className="leave-doc-card">
                  <div className="leave-doc-header">
                    <div className="leave-doc-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                    <div className="leave-doc-info">
                      <h4 className="leave-doc-title">{row.title}</h4>
                      <span className="leave-doc-meta">{row.period} &middot; {row.pages} pages</span>
                    </div>
                  </div>
                  <div className="leave-doc-tags">
                    <span className="leave-doc-tag">{row.id}</span>
                    <span className="leave-doc-tag">Issued: {row.date}</span>
                    <span className="leave-doc-tag" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span>
                  </div>
                  <div className="leave-doc-actions">
                    <button className="btn btn-sm btn-secondary">Preview</button>
                    <button className="btn btn-sm btn-primary" onClick={() => notificationService.info('Downloading ' + row.id)}>Download PDF</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

export default PensionPage;
