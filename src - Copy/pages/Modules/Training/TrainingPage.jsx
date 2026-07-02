import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import Modal from '../../../components/common/Modal/Modal';
import './TrainingPage.css';

const PROGRAMS = [
  { id: 'TP-2026-001', title: 'Cybersecurity Awareness', provider: 'ICT Department', startDate: '2026-07-15', endDate: '2026-07-17', status: 'Upcoming', type: 'Mandatory', venue: 'Online', duration: '3 days', fee: 'Free' },
  { id: 'TP-2026-002', title: 'Leadership Development Program', provider: 'Training Dept', startDate: '2026-08-01', endDate: '2026-08-05', status: 'Open for Application', type: 'Optional', venue: 'Dodoma HQ', duration: '5 days', fee: 'Free' },
  { id: 'TP-2026-003', title: 'Customer Service Excellence', provider: 'HR Department', startDate: '2026-06-10', endDate: '2026-06-12', status: 'Completed', type: 'Mandatory', venue: 'Dar es Salaam', duration: '3 days', fee: 'Free' },
  { id: 'TP-2026-004', title: 'Financial Management Basics', provider: 'Finance Dept', startDate: '2026-09-01', endDate: '2026-09-03', status: 'Open for Application', type: 'Optional', venue: 'Online', duration: '3 days', fee: 'Free' },
  { id: 'TP-2026-005', title: 'Data Analytics & Reporting', provider: 'ICT Department', startDate: '2026-10-10', endDate: '2026-10-14', status: 'Open for Application', type: 'Optional', venue: 'Arusha Campus', duration: '5 days', fee: 'Free' },
];

const REQUEST_STATUS = [
  { id: 'TRL-2026-001', program: 'Leadership Development Program', requestedDate: '2026-05-20', fromDate: '2026-08-01', toDate: '2026-08-05', days: 5, status: 'Approved', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-05-28', reason: 'Preparing for management role transition' },
  { id: 'TRL-2026-002', program: 'Data Analytics & Reporting', requestedDate: '2026-06-15', fromDate: '2026-10-10', toDate: '2026-10-14', days: 5, status: 'Pending', approvedBy: null, approverRole: null, decisionDate: null, reason: 'Skill enhancement for quarterly reporting tasks' },
];

const STATUS_STYLE = {
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Approved': { background: '#ECFDF5', color: '#059669' },
  'Rejected': { background: '#FFF1F2', color: '#BE123C' },
  'Upcoming': { background: '#EAF4FF', color: '#2F80ED' },
  'Open for Application': { background: '#ECFDF5', color: '#059669' },
  'Completed': { background: '#F5F3FF', color: '#7C3AED' },
};

const TAB_ICONS = {
  available: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  request: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  status: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

const TABS = [
  { key: 'available', label: 'Available Programs' },
  { key: 'request', label: 'Request Training Leave' },
  { key: 'status', label: 'Request Status' },
];

function TrainingPage() {
  const [activeTab, setActiveTab] = useState('available');
  const [selectedRequest, setSelectedRequest] = useState(null);

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Training Management"
          subtitle="Discover, apply, and track your professional development"
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

        {/* Available Programs */}
        {activeTab === 'available' && (
          <>
            <div className="leave-section-header">
              <div><h3 className="leave-section-title">Available Programs</h3><p className="leave-section-desc">Browse and apply for professional development programs</p></div>
            </div>
            <div className="leave-doc-grid leave-doc-grid--3">
              {PROGRAMS.map(p => (
                <div key={p.id} className="leave-doc-card training-program-card">
                  <div className="leave-doc-header">
                    <div className="leave-doc-icon" style={{ background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)', color: '#2563eb' }}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    </div>
                    <div className="leave-doc-info">
                      <h4 className="leave-doc-title">{p.title}</h4>
                      <span className="leave-doc-meta">{p.provider} &middot; {p.duration}</span>
                    </div>
                  </div>
                  <div className="leave-doc-tags">
                    <span className="leave-doc-tag">{p.id}</span>
                    <span className="leave-doc-tag" style={{ background: STATUS_STYLE[p.status]?.background, color: STATUS_STYLE[p.status]?.color }}>{p.status}</span>
                    <span className="leave-doc-tag">{p.type}</span>
                    <span className="leave-doc-tag">{p.venue}</span>
                  </div>
                  <div className="training-program-dates">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    <span>{p.startDate} &mdash; {p.endDate}</span>
                  </div>
                  <div className="leave-doc-actions">
                    <button className="btn btn-sm btn-primary" onClick={() => alert('Applying for ' + p.title)}>Apply Now</button>
                    <button className="btn btn-sm btn-secondary" onClick={() => alert('Viewing details for ' + p.title)}>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Request Training Leave */}
        {activeTab === 'request' && (
          <Card hover={false} className="leave-apply-card">
            <form className="leave-form" onSubmit={e => e.preventDefault()}>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Applicant Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Employee Name</label><input type="text" className="form-input" value="John Michael Doe" disabled /></div>
                  <div className="form-group"><label className="form-label">Employee ID</label><input type="text" className="form-input" value="EMP-2024-00542" disabled /></div>
                  <div className="form-group"><label className="form-label">Department</label><input type="text" className="form-input" value="Human Resources" disabled /></div>
                  <div className="form-group"><label className="form-label">Designation</label><input type="text" className="form-input" value="Senior HR Officer" disabled /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Training Program Selection</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Program Title</label><select className="form-input form-select"><option>Leadership Development Program</option><option>Data Analytics & Reporting</option><option>Financial Management Basics</option><option>Cybersecurity Awareness</option></select></div>
                  <div className="form-group"><label className="form-label">Provider / Organizer</label><input type="text" className="form-input" placeholder="e.g. Training Department" /></div>
                  <div className="form-group"><label className="form-label">Training Venue</label><input type="text" className="form-input" placeholder="e.g. Dodoma HQ or Online" /></div>
                  <div className="form-group"><label className="form-label">Training Type</label><select className="form-input form-select"><option>Internal</option><option>External</option><option>Workshop</option><option>Seminar</option><option>Conference</option></select></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Training Dates</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">From Date</label><input type="date" className="form-input" /></div>
                  <div className="form-group"><label className="form-label">To Date</label><input type="date" className="form-input" /></div>
                  <div className="form-group"><label className="form-label">Duration (Days)</label><input type="number" className="form-input" placeholder="e.g. 5" /></div>
                  <div className="form-group"><label className="form-label">Application Fee</label><select className="form-input form-select"><option>Free</option><option>Paid by Employee</option><option>Paid by Organization</option></select></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Contact Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Contact Address While on Training</label><input type="text" className="form-input" placeholder="Enter your contact address" /></div>
                  <div className="form-group"><label className="form-label">Contact Phone Number</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                  <div className="form-group"><label className="form-label">Emergency Contact Name</label><input type="text" className="form-input" placeholder="Emergency contact name" /></div>
                  <div className="form-group"><label className="form-label">Emergency Contact Phone</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Additional Information</h4>
                <div className="leave-form-row leave-form-row--two">
                  <div className="form-group"><label className="form-label">Reason for Training Leave</label><textarea className="form-input" rows="4" placeholder="Explain how this training aligns with your role and career development..."></textarea></div>
                  <div className="form-group"><label className="form-label">Handover Notes / Acting Arrangements</label><textarea className="form-input" rows="4" placeholder="Describe who will act in your position during the training period..."></textarea></div>
                </div>
              </div>
              <div className="leave-form-actions">
                <button type="reset" className="btn btn-secondary">Clear Form</button>
                <button type="submit" className="btn btn-primary">Submit Application</button>
              </div>
            </form>
          </Card>
        )}

        {/* Request Status */}
        {activeTab === 'status' && (
          <>
            <Card hover={false} padding="none">
              <div className="leave-table-toolbar">
                <div className="leave-toolbar-left">
                  <div className="leave-toolbar-title-wrap">
                    <h3 className="leave-toolbar-title">Training Leave Requests</h3>
                    <span className="leave-toolbar-badge">{REQUEST_STATUS.length}</span>
                  </div>
                </div>
                <div className="leave-toolbar-right">
                  <div className="leave-table-search">
                    <svg className="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                    <input type="text" className="search-input" placeholder="Search by ID, program, or status..." />
                  </div>
                </div>
              </div>
              <div className="leave-table-wrap">
                <table className="leave-table leave-table-history">
                  <thead>
                    <tr>
                      <th>Reference ID</th>
                      <th>Program</th>
                      <th>Requested Date</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Days</th>
                      <th>Status</th>
                      <th className="th-action">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {REQUEST_STATUS.map((row, idx) => (
                      <tr key={row.id} className={idx % 2 === 1 ? 'alt-row' : ''}>
                        <td><span className="leave-id">{row.id}</span></td>
                        <td><span className="leave-type">{row.program}</span></td>
                        <td>{row.requestedDate}</td>
                        <td>{row.fromDate}</td>
                        <td>{row.toDate}</td>
                        <td><span className="leave-days">{row.days}</span></td>
                        <td><span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span></td>
                        <td>
                          <div className="leave-actions">
                            <button className="action-btn action-btn--view" onClick={() => setSelectedRequest(row)} title="View Details">
                              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {selectedRequest && (
              <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title={`Request Details - ${selectedRequest.id}`}>
                <div className="leave-detail-modal">
                  <div className="leave-detail-status-bar">
                    <span className="leave-detail-status-label">Status</span>
                    <span className="status-pill" style={{ background: STATUS_STYLE[selectedRequest.status]?.background, color: STATUS_STYLE[selectedRequest.status]?.color }}>{selectedRequest.status}</span>
                  </div>
                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Training Request Information</h5>
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Reference ID</span><span className="leave-detail-value">{selectedRequest.id}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Program</span><span className="leave-detail-value">{selectedRequest.program}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Requested Date</span><span className="leave-detail-value">{selectedRequest.requestedDate}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">From Date</span><span className="leave-detail-value">{selectedRequest.fromDate}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">To Date</span><span className="leave-detail-value">{selectedRequest.toDate}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Duration</span><span className="leave-detail-value">{selectedRequest.days} days</span></div>
                    </div>
                  </div>
                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Additional Details</h5>
                    <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Reason for Training Leave</span><span className="leave-detail-value">{selectedRequest.reason}</span></div>
                  </div>
                  {selectedRequest.status === 'Approved' && (
                    <div className="leave-detail-section leave-detail-decision">
                      <h5 className="leave-detail-section-title">Decision / Approval</h5>
                      <div className="leave-detail-grid">
                        <div className="leave-detail-item"><span className="leave-detail-label">Approved By</span><span className="leave-detail-value">{selectedRequest.approvedBy}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Approver Role</span><span className="leave-detail-value">{selectedRequest.approverRole}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Decision Date</span><span className="leave-detail-value">{selectedRequest.decisionDate}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default TrainingPage;
