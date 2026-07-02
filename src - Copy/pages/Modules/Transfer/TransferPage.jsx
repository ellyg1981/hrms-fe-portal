import React, { useState, useRef } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import Modal from '../../../components/common/Modal/Modal';
import './TransferPage.css';

const TRANSFER_HISTORY = [
  { id: 'TR-2026-001', type: 'Regional Transfer', fromStation: 'Dar es Salaam HQ', toStation: 'Dodoma Regional Office', effectiveDate: '2026-08-01', status: 'Approved', appliedOn: '2026-05-15', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-06-10', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Reassignment to new regional headquarters', contactAddress: 'Plot 42, Nyerere Road, Dodoma', contactPhone: '+255 765 432 101' },
  { id: 'TR-2026-002', type: 'Departmental Transfer', fromStation: 'HR Division', toStation: 'Finance Division', effectiveDate: '2026-07-01', status: 'Approved', appliedOn: '2026-04-20', approvedBy: 'Mr. Joseph Mwangi', approverRole: 'Director General', decisionDate: '2026-05-15', region: 'Dar es Salaam', district: 'Ilala', reason: 'Skill utilization in financial operations', contactAddress: 'House 12, Upanga, Dar es Salaam', contactPhone: '+255 789 123 456' },
  { id: 'TR-2026-003', type: 'Regional Transfer', fromStation: 'Arusha Regional Office', toStation: 'Mwanza Regional Office', effectiveDate: '2026-09-01', status: 'Pending', appliedOn: '2026-06-01', approvedBy: null, approverRole: null, decisionDate: null, region: 'Mwanza', district: 'Ilemela', reason: 'Family relocation request', contactAddress: 'P.O. Box 450, Arusha', contactPhone: '+255 754 321 987' },
  { id: 'TR-2026-004', type: 'Promotion Transfer', fromStation: 'Mbeya District Office', toStation: 'Head Office - Dodoma', effectiveDate: '2026-10-01', status: 'Approved', appliedOn: '2026-05-01', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-06-20', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Promotion to Senior Officer grade', contactAddress: 'Plot 8, Sokoine Road, Mbeya', contactPhone: '+255 767 890 234' },
];

const CONFIRMATION_LETTERS = [
  { id: 'TC-2026-001', type: 'Regional Transfer', period: 'Dar es Salaam HQ to Dodoma Regional Office', effectiveDate: '01 Aug 2026', status: 'Issued' },
  { id: 'TC-2026-002', type: 'Departmental Transfer', period: 'HR Division to Finance Division', effectiveDate: '01 Jul 2026', status: 'Issued' },
  { id: 'TC-2026-003', type: 'Promotion Transfer', period: 'Mbeya to Head Office - Dodoma', effectiveDate: '01 Oct 2026', status: 'Issued' },
];

const STATUS_STYLE = {
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Approved': { background: '#ECFDF5', color: '#059669' },
  'Rejected': { background: '#FFF1F2', color: '#BE123C' },
  'Returned for Correction': { background: '#FEF3C7', color: '#92400E' },
  'Issued': { background: '#ECFDF5', color: '#059669' },
};

const TAB_ICONS = {
  overview: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  request: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  history: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  confirmation: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'request', label: 'Request Transfer' },
  { key: 'history', label: 'Transfer History' },
  { key: 'confirmation', label: 'Confirmation Letter' },
];

function TransferPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [historySearch, setHistorySearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [historyPerPage, setHistoryPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [historyFilters, setHistoryFilters] = useState({ transferType: '', status: '', dateFrom: '', dateTo: '' });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Transfer Management"
          subtitle="Manage your transfer requests, view history, and download official documents"
          color="#0B2E59"
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
            <div className="leave-overview-summary">
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">2</span><span className="overview-stat-label">Active Requests</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">3</span><span className="overview-stat-label">Active Applications</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">3</span><span className="overview-stat-label">Available Documents</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">1</span><span className="overview-stat-label">Pending Approval</span></div>
              </Card>
            </div>
            <div className="leave-overview-recent">
              <div className="leave-section-header"><h3 className="leave-section-title">Recent Transfer Requests</h3></div>
              <div className="leave-recent-list">
                {TRANSFER_HISTORY.filter(r => r.status === 'Pending').slice(0, 3).map(row => (
                  <div key={row.id} className="leave-recent-item">
                    <div className="leave-recent-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"/></svg></div>
                    <div className="leave-recent-body"><span className="leave-recent-title">{row.type} &middot; {row.fromStation} to {row.toStation}</span><span className="leave-recent-meta">Effective: {row.effectiveDate} &middot; {row.region}</span></div>
                    <div className="leave-recent-status"><span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'request' && (
          <Card hover={false} className="leave-apply-card">
            <form className="leave-form" onSubmit={e => e.preventDefault()}>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Basic Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Employee Name</label><input type="text" className="form-input" value="John Michael Doe" disabled /></div>
                  <div className="form-group"><label className="form-label">Employee ID</label><input type="text" className="form-input" value="EMP-2024-00542" disabled /></div>
                  <div className="form-group"><label className="form-label">Current Department</label><input type="text" className="form-input" value="Human Resources" disabled /></div>
                  <div className="form-group"><label className="form-label">Current Designation</label><input type="text" className="form-input" value="Senior HR Officer" disabled /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Transfer Details</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Transfer Type</label><select className="form-input form-select"><option>Regional Transfer</option><option>Departmental Transfer</option><option>Promotion Transfer</option><option>Temporary Transfer</option><option>Inter-Agency Transfer</option></select></div>
                  <div className="form-group"><label className="form-label">From Station / Office</label><input type="text" className="form-input" placeholder="Current station or office" /></div>
                  <div className="form-group"><label className="form-label">To Station / Office</label><input type="text" className="form-input" placeholder="Requested station or office" /></div>
                  <div className="form-group"><label className="form-label">Effective Date</label><input type="date" className="form-input" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Location Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">New Region</label><select className="form-input form-select"><option>Dar es Salaam</option><option>Dodoma</option><option>Arusha</option><option>Mwanza</option><option>Mbeya</option><option>Morogoro</option><option>Kilimanjaro</option><option>Zanzibar</option></select></div>
                  <div className="form-group"><label className="form-label">New District</label><select className="form-input form-select"><option>Ilala</option><option>Kinondoni</option><option>Temeke</option><option>Kigamboni</option><option>Ubungo</option></select></div>
                  <div className="form-group"><label className="form-label">Contact Address</label><input type="text" className="form-input" placeholder="Enter your contact address" /></div>
                  <div className="form-group"><label className="form-label">Contact Phone Number</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Additional Information</h4>
                <div className="leave-form-row leave-form-row--two">
                  <div className="form-group"><label className="form-label">Reason for Transfer</label><textarea className="form-input" rows="4" placeholder="Provide a clear reason for your transfer request..."></textarea></div>
                  <div className="form-group"><label className="form-label">Supporting Documents</label><div className="file-upload-area" onClick={() => fileInputRef.current?.click()} onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag-over'); }} onDragLeave={e => e.currentTarget.classList.remove('drag-over')} onDrop={e => { e.preventDefault(); e.currentTarget.classList.remove('drag-over'); const files = Array.from(e.dataTransfer.files); setUploadedFiles(prev => [...prev, ...files]); }}><input ref={fileInputRef} type="file" className="file-upload-input" multiple onChange={e => { const files = Array.from(e.target.files); setUploadedFiles(prev => [...prev, ...files]); }} /><div className="file-upload-content"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p className="file-upload-title">Click or drag files to upload</p><p className="file-upload-hint">PDF, DOC, DOCX, JPG, PNG up to 10MB each</p></div></div>{uploadedFiles.length > 0 && (<div className="file-upload-list">{uploadedFiles.map((file, idx) => (<div key={idx} className="file-upload-item"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg><span className="file-upload-name">{file.name}</span><span className="file-upload-size">{(file.size / 1024).toFixed(1)} KB</span><button type="button" className="file-upload-remove" onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))} title="Remove file"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button></div>))}</div>)}</div>
                </div>
              </div>
              <div className="leave-form-actions">
                <button type="reset" className="btn btn-secondary">Clear Form</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </Card>
        )}

        {activeTab === 'history' && (
          <>
            <Card hover={false} padding="none">
              <div className="leave-table-toolbar">
                <div className="leave-toolbar-left">
                  <div className="leave-toolbar-title-wrap">
                    <h3 className="leave-toolbar-title">Transfer History</h3>
                    <span className="leave-toolbar-badge">{TRANSFER_HISTORY.length}</span>
                  </div>
                  <div className="leave-toolbar-actions">
                    <button className={`toolbar-btn ${showFilters ? 'active' : ''}`} onClick={() => setShowFilters(v => !v)} title="Filters">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
                      <span>Filters</span>
                    </button>
                    <button className="toolbar-btn" onClick={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }} title="Refresh">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                    </button>
                    <button className="toolbar-btn" onClick={() => alert('Exporting transfer history...')} title="Export">
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    </button>
                  </div>
                </div>
                <div className="leave-toolbar-right">
                  <div className="leave-table-search">
                    <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" className="search-input" placeholder="Search by ID, type, region or station..." value={historySearch} onChange={(e) => { setHistorySearch(e.target.value); setHistoryPage(1); }} />
                    {historySearch && (
                      <button className="search-clear" onClick={() => { setHistorySearch(''); setHistoryPage(1); }}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {showFilters && (
                <div className="leave-filter-panel">
                  <div className="leave-filter-row">
                    <div className="leave-filter-group">
                      <label className="leave-filter-label">Transfer Type</label>
                      <select className="leave-filter-select" value={historyFilters.transferType} onChange={(e) => { setHistoryFilters(f => ({ ...f, transferType: e.target.value })); setHistoryPage(1); }}>
                        <option value="">All Types</option>
                        <option>Regional Transfer</option>
                        <option>Departmental Transfer</option>
                        <option>Promotion Transfer</option>
                        <option>Temporary Transfer</option>
                        <option>Inter-Agency Transfer</option>
                      </select>
                    </div>
                    <div className="leave-filter-group">
                      <label className="leave-filter-label">Status</label>
                      <select className="leave-filter-select" value={historyFilters.status} onChange={(e) => { setHistoryFilters(f => ({ ...f, status: e.target.value })); setHistoryPage(1); }}>
                        <option value="">All Statuses</option>
                        <option>Approved</option>
                        <option>Pending</option>
                        <option>Rejected</option>
                      </select>
                    </div>
                    <div className="leave-filter-group">
                      <label className="leave-filter-label">Date From</label>
                      <input type="date" className="leave-filter-input" value={historyFilters.dateFrom} onChange={(e) => { setHistoryFilters(f => ({ ...f, dateFrom: e.target.value })); setHistoryPage(1); }} />
                    </div>
                    <div className="leave-filter-group">
                      <label className="leave-filter-label">Date To</label>
                      <input type="date" className="leave-filter-input" value={historyFilters.dateTo} onChange={(e) => { setHistoryFilters(f => ({ ...f, dateTo: e.target.value })); setHistoryPage(1); }} />
                    </div>
                    <div className="leave-filter-group leave-filter-actions">
                      <button className="btn btn-sm btn-secondary" onClick={() => { setHistoryFilters({ transferType: '', status: '', dateFrom: '', dateTo: '' }); setHistoryPage(1); }}>Clear</button>
                    </div>
                  </div>
                </div>
              )}

              <div className="leave-table-wrap">
                {(() => {
                  const filtered = TRANSFER_HISTORY.filter(row => {
                    const matchesSearch = !historySearch ||
                      row.id.toLowerCase().includes(historySearch.toLowerCase()) ||
                      row.type.toLowerCase().includes(historySearch.toLowerCase()) ||
                      row.fromStation.toLowerCase().includes(historySearch.toLowerCase()) ||
                      row.toStation.toLowerCase().includes(historySearch.toLowerCase()) ||
                      row.region.toLowerCase().includes(historySearch.toLowerCase()) ||
                      row.status.toLowerCase().includes(historySearch.toLowerCase());
                    const matchesType = !historyFilters.transferType || row.type === historyFilters.transferType;
                    const matchesStatus = !historyFilters.status || row.status === historyFilters.status;
                    const matchesDateFrom = !historyFilters.dateFrom || row.effectiveDate >= historyFilters.dateFrom;
                    const matchesDateTo = !historyFilters.dateTo || row.effectiveDate <= historyFilters.dateTo;
                    return matchesSearch && matchesType && matchesStatus && matchesDateFrom && matchesDateTo;
                  });
                  const totalPages = Math.max(1, Math.ceil(filtered.length / historyPerPage));
                  const currentPage = Math.min(historyPage, totalPages);
                  const paginated = filtered.slice((currentPage - 1) * historyPerPage, currentPage * historyPerPage);
                  const startEntry = filtered.length > 0 ? (currentPage - 1) * historyPerPage + 1 : 0;
                  const endEntry = Math.min(currentPage * historyPerPage, filtered.length);
                  return (
                    <>
                      {isLoading ? (
                        <div className="leave-table-skeleton">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="skeleton-row">
                              <div className="skeleton-cell" style={{ width: '10%' }} /><div className="skeleton-cell" style={{ width: '14%' }} /><div className="skeleton-cell" style={{ width: '16%' }} /><div className="skeleton-cell" style={{ width: '16%' }} /><div className="skeleton-cell" style={{ width: '12%' }} /><div className="skeleton-cell" style={{ width: '10%' }} /><div className="skeleton-cell" style={{ width: '10%' }} /><div className="skeleton-cell" style={{ width: '8%' }} />
                            </div>
                          ))}
                        </div>
                      ) : filtered.length === 0 ? (
                        <div className="leave-table-empty">
                          <div className="empty-icon"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                          <h4 className="empty-title">No transfer records found</h4>
                          <p className="empty-desc">No records match your search or filter criteria.</p>
                        </div>
                      ) : (
                        <table className="leave-table leave-table-history">
                          <thead>
                            <tr>
                              <th>Reference ID</th>
                              <th>Transfer Type</th>
                              <th>From Station</th>
                              <th>To Station</th>
                              <th>Effective Date</th>
                              <th>Region</th>
                              <th>District</th>
                              <th>Status</th>
                              <th className="th-action">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {paginated.map((row, idx) => (
                              <tr key={row.id} className={idx % 2 === 1 ? 'alt-row' : ''}>
                                <td><span className="leave-id">{row.id}</span></td>
                                <td><span className="leave-type">{row.type}</span></td>
                                <td>{row.fromStation}</td>
                                <td>{row.toStation}</td>
                                <td>{row.effectiveDate}</td>
                                <td>{row.region}</td>
                                <td>{row.district}</td>
                                <td><span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span></td>
                                <td>
                                  <div className="leave-actions">
                                    <button className="action-btn action-btn--view" onClick={() => setSelectedTransfer(row)} title="View Details">
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                    </button>
                                    <button className="action-btn action-btn--download" onClick={() => alert('Downloading ' + row.id)} title="Download">
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                    </button>
                                    <button className="action-btn action-btn--print" onClick={() => alert('Printing ' + row.id)} title="Print">
                                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                      <div className="leave-table-pagination">
                        <div className="pagination-left">
                          <span className="pagination-info">Showing <b>{startEntry}</b> to <b>{endEntry}</b> of <b>{filtered.length}</b> entries</span>
                          <div className="pagination-per-page">
                            <span>Rows per page:</span>
                            <select value={historyPerPage} onChange={(e) => { setHistoryPerPage(Number(e.target.value)); setHistoryPage(1); }}>
                              <option>5</option>
                              <option>10</option>
                              <option>25</option>
                              <option>50</option>
                            </select>
                          </div>
                        </div>
                        <div className="pagination-right">
                          <button className="pagination-btn pagination-btn--icon" disabled={currentPage === 1} onClick={() => setHistoryPage(1)} title="First">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
                          </button>
                          <button className="pagination-btn pagination-btn--icon" disabled={currentPage === 1} onClick={() => setHistoryPage(p => p - 1)} title="Previous">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                          </button>
                          <div className="pagination-pages">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                              <button key={p} className={`pagination-page-num ${p === currentPage ? 'active' : ''}`} onClick={() => setHistoryPage(p)}>{p}</button>
                            ))}
                          </div>
                          <button className="pagination-btn pagination-btn--icon" disabled={currentPage === totalPages} onClick={() => setHistoryPage(p => p + 1)} title="Next">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                          </button>
                          <button className="pagination-btn pagination-btn--icon" disabled={currentPage === totalPages} onClick={() => setHistoryPage(totalPages)} title="Last">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
                          </button>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Card>

            {selectedTransfer && (
              <Modal isOpen={!!selectedTransfer} onClose={() => setSelectedTransfer(null)} title={`Transfer Details - ${selectedTransfer.id}`}>
                <div className="leave-detail-modal">
                  <div className="leave-detail-status-bar">
                    <span className="leave-detail-status-label">Status</span>
                    <span className="status-pill" style={{ background: STATUS_STYLE[selectedTransfer.status]?.background, color: STATUS_STYLE[selectedTransfer.status]?.color }}>{selectedTransfer.status}</span>
                  </div>
                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Transfer Information</h5>
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Reference ID</span><span className="leave-detail-value">{selectedTransfer.id}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Transfer Type</span><span className="leave-detail-value">{selectedTransfer.type}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">From Station</span><span className="leave-detail-value">{selectedTransfer.fromStation}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">To Station</span><span className="leave-detail-value">{selectedTransfer.toStation}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Effective Date</span><span className="leave-detail-value">{selectedTransfer.effectiveDate}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Applied On</span><span className="leave-detail-value">{selectedTransfer.appliedOn}</span></div>
                    </div>
                  </div>
                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Location Information</h5>
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Region</span><span className="leave-detail-value">{selectedTransfer.region}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">District</span><span className="leave-detail-value">{selectedTransfer.district}</span></div>
                      <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Contact Address</span><span className="leave-detail-value">{selectedTransfer.contactAddress}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Contact Phone</span><span className="leave-detail-value">{selectedTransfer.contactPhone}</span></div>
                    </div>
                  </div>
                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Additional Details</h5>
                    <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Reason for Transfer</span><span className="leave-detail-value">{selectedTransfer.reason}</span></div>
                  </div>
                  {selectedTransfer.status === 'Approved' && (
                    <div className="leave-detail-section leave-detail-decision">
                      <h5 className="leave-detail-section-title">Decision / Approval</h5>
                      <div className="leave-detail-grid">
                        <div className="leave-detail-item"><span className="leave-detail-label">Approved By</span><span className="leave-detail-value">{selectedTransfer.approvedBy}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Approver Role</span><span className="leave-detail-value">{selectedTransfer.approverRole}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Decision Date</span><span className="leave-detail-value">{selectedTransfer.decisionDate}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </>
        )}

        {activeTab === 'confirmation' && (
          <>
            <div className="leave-section-header">
              <div><h3 className="leave-section-title">Confirmation Letters</h3><p className="leave-section-desc">Official confirmation letters for approved transfers</p></div>
            </div>
            <div className="leave-doc-grid leave-doc-grid--3">
              {CONFIRMATION_LETTERS.map(row => (
                <div key={row.id} className="leave-doc-card">
                  <div className="leave-doc-header">
                    <div className="leave-doc-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                    <div className="leave-doc-info">
                      <h4 className="leave-doc-title">{row.type} Confirmation</h4>
                      <span className="leave-doc-meta">{row.period} &middot; Effective: {row.effectiveDate}</span>
                    </div>
                  </div>
                  <div className="leave-doc-tags">
                    <span className="leave-doc-tag">{row.id}</span>
                    <span className="leave-doc-tag">Effective: {row.effectiveDate}</span>
                    <span className="leave-doc-tag" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span>
                  </div>
                  <div className="leave-doc-actions">
                    <button className="btn btn-sm btn-secondary">Preview</button>
                    <button className="btn btn-sm btn-primary" onClick={() => alert('Downloading ' + row.id)}>Download PDF</button>
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

export default TransferPage;
