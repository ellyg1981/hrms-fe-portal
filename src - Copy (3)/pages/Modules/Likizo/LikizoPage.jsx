import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import Modal from '../../../components/common/Modal/Modal';
import DataTable from '../../../components/common/DataTable/DataTable';
import './LikizoPage.css';

const LEAVE_HISTORY = [
  { id: 'LV-2026-001', type: 'Annual Leave', from: '2026-07-01', to: '2026-07-14', days: 14, status: 'Approved', appliedOn: '2026-06-15', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-06-18', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Family vacation and annual rest period', handover: 'Tasks delegated to Assistant HR Officer James Kibonde', contactAddress: 'Plot 42, Nyerere Road, Dodoma', contactPhone: '+255 765 432 101' },
  { id: 'LV-2026-002', type: 'Sick Leave', from: '2026-05-10', to: '2026-05-12', days: 3, status: 'Approved', appliedOn: '2026-05-09', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-05-09', region: 'Dar es Salaam', district: 'Ilala', reason: 'Medical treatment at Muhimbili Hospital', handover: 'Duties covered by Senior Officer Peter Lema', contactAddress: 'House 12, Upanga, Dar es Salaam', contactPhone: '+255 789 123 456' },
  { id: 'LV-2026-003', type: 'Annual Leave', from: '2026-12-20', to: '2026-12-31', days: 12, status: 'Pending', appliedOn: '2026-06-30', approvedBy: null, approverRole: null, decisionDate: null, region: 'Arusha', district: 'Arusha City', reason: 'End of year holiday with family', handover: 'Pending assignment to Acting Officer', contactAddress: 'P.O. Box 450, Arusha', contactPhone: '+255 754 321 987' },
  { id: 'LV-2026-004', type: 'Special Leave', from: '2026-08-05', to: '2026-08-07', days: 3, status: 'Approved', appliedOn: '2026-07-20', approvedBy: 'Mr. Joseph Mwangi', approverRole: 'Director General', decisionDate: '2026-07-25', region: 'Mbeya', district: 'Mbeya City', reason: 'Attending national cultural event as representative', handover: 'Responsibilities transferred to Deputy Director Sarah Mkonde', contactAddress: 'Plot 8, Sokoine Road, Mbeya', contactPhone: '+255 767 890 234' },
];

const CONFIRMATION_LETTERS = [
  { id: 'CL-2026-001', type: 'Annual Leave', period: '01 Jul 2026 - 14 Jul 2026', days: 14, issued: '15 Jun 2026', status: 'Issued' },
  { id: 'CL-2026-002', type: 'Sick Leave', period: '10 May 2026 - 12 May 2026', days: 3, issued: '16 May 2026', status: 'Issued' },
  { id: 'CL-2026-003', type: 'Special Leave', period: '05 Aug 2026 - 07 Aug 2026', days: 3, issued: '01 Aug 2026', status: 'Issued' },
];

const STATUS_STYLE = {
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Approved': { background: '#ECFDF5', color: '#059669' },
  'Rejected': { background: '#FFF1F2', color: '#BE123C' },
  'Returned for Correction': { background: '#FEF3C7', color: '#92400E' },
  'Issued': { background: '#ECFDF5', color: '#059669' },
  'Ready': { background: '#EFF6FF', color: '#2563EB' },
};

const TAB_ICONS = {
  overview: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  history: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  confirmation: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  calendar: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'history', label: 'Leave History' },
  { key: 'confirmation', label: 'Confirmation Letter' },
  { key: 'calendar', label: 'Leave Calendar' },
];

function LikizoPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Leave Management"
          subtitle="Manage your leave applications, view history, and download official documents"
          color="#0B2E59"
          ctaLabel="Apply for Leave"
          onCta={() => setShowApplyModal(true)}
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

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <>
            <svg className="balance-gradient-defs"><defs><linearGradient id="balanceGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#0B2E59" /><stop offset="100%" stopColor="#2F80ED" /></linearGradient></defs></svg>
            <div className="leave-overview-summary">
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">22</span><span className="overview-stat-label">Annual Leave Days Left</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value" style={{ fontSize: '17px' }}>10th Sept. 2026</span><span className="overview-stat-label">Date of Leave per Cycle</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">4</span><span className="overview-stat-label">Total Leave Records</span></div>
              </Card>
              <Card className="overview-stat-card" hover>
                <div className="overview-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                <div className="overview-stat-body"><span className="overview-stat-value">2</span><span className="overview-stat-label">Available Documents</span></div>
              </Card>
            </div>
            <div className="leave-overview-recent">
              <div className="leave-section-header"><h3 className="leave-section-title">Recent Applications</h3></div>
              <div className="leave-recent-list">
                {LEAVE_HISTORY.slice(0, 3).map(row => (
                  <div key={row.id} className="leave-recent-item">
                    <div className="leave-recent-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                    <div className="leave-recent-body"><span className="leave-recent-title">{row.type}</span><span className="leave-recent-meta">{row.from} &mdash; {row.to} &middot; {row.days} days</span></div>
                    <div className="leave-recent-status"><span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Apply for Leave Modal ── */}
        {showApplyModal && (
          <Modal
            isOpen={showApplyModal}
            onClose={() => setShowApplyModal(false)}
            title="Apply for Leave"
            size="lg"
            className="apply-leave-modal"
            footer={
              <div className="leave-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => alert('Application submitted')}>Submit Application</button>
              </div>
            }
          >
            <form className="leave-form" onSubmit={e => e.preventDefault()}>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Basic Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Employee Name</label><input type="text" className="form-input" value="John Michael Doe" disabled /></div>
                  <div className="form-group"><label className="form-label">Employee ID</label><input type="text" className="form-input" value="EMP-2024-00542" disabled /></div>
                  <div className="form-group"><label className="form-label">Department</label><input type="text" className="form-input" value="Human Resources" disabled /></div>
                  <div className="form-group"><label className="form-label">Designation</label><input type="text" className="form-input" value="Senior HR Officer" disabled /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Leave Details</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Leave Type</label><select className="form-input form-select"><option>Annual Leave</option><option>Sick Leave</option><option>Maternity Leave</option><option>Paternity Leave</option><option>Special Leave</option><option>Studying Leave</option><option>Retirement Leave</option></select></div>
                  <div className="form-group"><label className="form-label">From Date</label><input type="date" className="form-input" /></div>
                  <div className="form-group"><label className="form-label">To Date</label><input type="date" className="form-input" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Contact Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Contact Address While on Leave</label><input type="text" className="form-input" placeholder="Enter your contact address" /></div>
                  <div className="form-group"><label className="form-label">Contact Phone Number</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                  <div className="form-group"><label className="form-label">Region on Leave</label><select className="form-input form-select"><option>Dar es Salaam</option><option>Dodoma</option><option>Arusha</option><option>Mwanza</option><option>Mbeya</option><option>Morogoro</option><option>Kilimanjaro</option><option>Zanzibar</option></select></div>
                  <div className="form-group"><label className="form-label">District on Leave</label><select className="form-input form-select"><option>Ilala</option><option>Kinondoni</option><option>Temeke</option><option>Kigamboni</option><option>Ubungo</option></select></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Additional Information</h4>
                <div className="leave-form-row leave-form-row--two">
                  <div className="form-group"><label className="form-label">Reason for Leave</label><textarea className="form-input" rows="4" placeholder="Provide a clear reason for your leave request..."></textarea></div>
                  <div className="form-group"><label className="form-label">Handover Notes / Acting Arrangements</label><textarea className="form-input" rows="4" placeholder="Describe who will act in your position and any handover details..."></textarea></div>
                </div>
              </div>
            </form>
          </Modal>
        )}

        {/* ── Leave History ── */}
        {activeTab === 'history' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Reference ID', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'type', header: 'Leave Type', render: row => <span className="leave-type">{row.type}</span> },
                { key: 'from', header: 'From Date' },
                { key: 'to', header: 'To Date' },
                { key: 'days', header: 'Days', align: 'center', render: row => <span className="leave-days">{row.days}</span> },
                { key: 'region', header: 'Region' },
                { key: 'district', header: 'District' },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
              ]}
              data={LEAVE_HISTORY}
              title="Leave History"
              searchPlaceholder="Search by ID, type, region or district..."
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(v => !v)}
              filters={[
                { key: 'type', label: 'Leave Type', options: ['Annual Leave', 'Sick Leave', 'Maternity Leave', 'Paternity Leave', 'Special Leave', 'Studying Leave', 'Retirement Leave'].map(t => ({ value: t, label: t })) },
                { key: 'status', label: 'Status', options: ['Approved', 'Pending', 'Rejected', 'Returned for Correction'].map(s => ({ value: s, label: s })) },
              ]}
              loading={isLoading}
              refreshAction={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }}
              exportAction={() => alert('Exporting leave history...')}
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => setSelectedLeave(row)} title="View Details">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button className="action-btn action-btn--download" onClick={() => alert('Downloading ' + row.id)} title="Download">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                  <button className="action-btn action-btn--print" onClick={() => alert('Printing ' + row.id)} title="Print">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  </button>
                </div>
              )}
              emptyState={{ title: 'No leave history found', description: 'No records match your search or filter criteria.' }}
            />

            {selectedLeave && (
              <Modal isOpen={!!selectedLeave} onClose={() => setSelectedLeave(null)} title={`Leave Details - ${selectedLeave.id}`}>
                <div className="leave-detail-modal">
                  <div className="leave-detail-status-bar">
                    <span className="leave-detail-status-label">Status</span>
                    <span className="status-pill" style={{ background: STATUS_STYLE[selectedLeave.status]?.background, color: STATUS_STYLE[selectedLeave.status]?.color }}>{selectedLeave.status}</span>
                  </div>

                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Leave Information</h5>
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Reference ID</span><span className="leave-detail-value">{selectedLeave.id}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Leave Type</span><span className="leave-detail-value">{selectedLeave.type}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">From Date</span><span className="leave-detail-value">{selectedLeave.from}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">To Date</span><span className="leave-detail-value">{selectedLeave.to}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Total Days</span><span className="leave-detail-value">{selectedLeave.days}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Applied On</span><span className="leave-detail-value">{selectedLeave.appliedOn}</span></div>
                    </div>
                  </div>

                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Contact Information</h5>
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Region</span><span className="leave-detail-value">{selectedLeave.region}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">District</span><span className="leave-detail-value">{selectedLeave.district}</span></div>
                      <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Contact Address</span><span className="leave-detail-value">{selectedLeave.contactAddress}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Contact Phone</span><span className="leave-detail-value">{selectedLeave.contactPhone}</span></div>
                    </div>
                  </div>

                  <div className="leave-detail-section">
                    <h5 className="leave-detail-section-title">Additional Details</h5>
                    <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Reason for Leave</span><span className="leave-detail-value">{selectedLeave.reason}</span></div>
                    <div className="leave-detail-item leave-detail-item--full"><span className="leave-detail-label">Handover / Acting Arrangements</span><span className="leave-detail-value">{selectedLeave.handover}</span></div>
                  </div>

                  {selectedLeave.status === 'Approved' && (
                    <div className="leave-detail-section leave-detail-decision">
                      <h5 className="leave-detail-section-title">Decision / Approval</h5>
                      <div className="leave-detail-grid">
                        <div className="leave-detail-item"><span className="leave-detail-label">Approved By</span><span className="leave-detail-value">{selectedLeave.approvedBy}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Approver Role</span><span className="leave-detail-value">{selectedLeave.approverRole}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Decision Date</span><span className="leave-detail-value">{selectedLeave.decisionDate}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </>
        )}

        {/* ── Confirmation Letter ── */}
        {activeTab === 'confirmation' && (
          <>
            <div className="leave-section-header">
              <div><h3 className="leave-section-title">Confirmation Letters</h3><p className="leave-section-desc">Official confirmation letters for approved leave periods</p></div>
            </div>
            <div className="leave-doc-grid leave-doc-grid--3">
              {CONFIRMATION_LETTERS.map(row => (
                <div key={row.id} className="leave-doc-card">
                  <div className="leave-doc-header">
                    <div className="leave-doc-icon"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg></div>
                    <div className="leave-doc-info">
                      <h4 className="leave-doc-title">{row.type} Confirmation</h4>
                      <span className="leave-doc-meta">{row.period} &middot; {row.days} days</span>
                    </div>
                  </div>
                  <div className="leave-doc-tags">
                    <span className="leave-doc-tag">{row.id}</span>
                    <span className="leave-doc-tag">Issued: {row.issued}</span>
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

        {/* ── Leave Calendar ── */}
        {activeTab === 'calendar' && (
          <Card hover={false} className="leave-calendar-card">
            <h3 className="leave-section-title">Leave Calendar 2026</h3>
            <div className="leave-calendar-grid">
              {['January','February','March','April','May','June','July','August','September','October','November','December'].map((month, i) => (
                <div key={month} className="leave-calendar-month">
                  <div className="leave-calendar-month-header"><span className="leave-calendar-month-name">{month}</span></div>
                  <div className="leave-calendar-weekdays">
                    {['S','M','T','W','T','F','S'].map((d, idx) => <span key={idx} className="leave-calendar-weekday">{d}</span>)}
                  </div>
                  <div className="leave-calendar-days">
                    {Array.from({ length: 31 }, (_, d) => {
                      const day = d + 1;
                      const isLeave = (month === 'July' && day >= 1 && day <= 14) || (month === 'August' && day >= 5 && day <= 7) || (month === 'December' && day >= 20 && day <= 31);
                      const isHoliday = (month === 'July' && day === 7) || (month === 'December' && day === 9) || (month === 'December' && day === 25);
                      const isToday = (month === 'July' && day === 1);
                      let cls = 'leave-calendar-day';
                      if (isLeave) cls += ' leave-day';
                      if (isHoliday) cls += ' holiday-day';
                      if (isToday) cls += ' today-day';
                      if (day > new Date(2026, i + 1, 0).getDate()) cls += ' empty-day';
                      return <span key={d} className={cls}>{day <= new Date(2026, i + 1, 0).getDate() ? day : ''}</span>;
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div className="leave-calendar-legend-bar">
              <span className="leave-calendar-legend"><span className="legend-dot leave"></span> Approved Leave</span>
              <span className="leave-calendar-legend"><span className="legend-dot holiday"></span> Public Holiday</span>
              <span className="leave-calendar-legend"><span className="legend-dot today"></span> Today</span>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}

export default LikizoPage;
