import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import DataTable from '../../../components/common/DataTable/DataTable';
import Modal from '../../../components/common/Modal/Modal';
import './LoanPage.css';

const LOAN_HISTORY = [
  { id: 'LN-2026-001', type: 'Car Loan', amount: 45000000, balance: 32000000, interestRate: 9.5, term: 60, monthlyPayment: 850000, startDate: '2026-01-15', nextPayment: '2026-07-15', status: 'Active', approvedBy: 'Finance Committee', approvedDate: '2025-12-20' },
  { id: 'LN-2025-002', type: 'Housing Loan', amount: 120000000, balance: 95000000, interestRate: 8.0, term: 120, monthlyPayment: 1450000, startDate: '2025-06-01', nextPayment: '2026-07-01', status: 'Active', approvedBy: 'Board of Directors', approvedDate: '2025-05-15' },
  { id: 'LN-2024-003', type: 'Personal Loan', amount: 5000000, balance: 0, interestRate: 12.0, term: 12, monthlyPayment: 450000, startDate: '2024-03-01', nextPayment: null, status: 'Paid Off', approvedBy: 'HR Director', approvedDate: '2024-02-10' },
  { id: 'LN-2026-004', type: 'Education Loan', amount: 15000000, balance: 15000000, interestRate: 6.5, term: 36, monthlyPayment: 480000, startDate: '2026-04-01', nextPayment: '2026-07-01', status: 'Pending Disbursement', approvedBy: null, approvedDate: null },
];

const REPAYMENTS = [
  { id: 'RP-2026-007', loanId: 'LN-2026-001', period: 'Jul 2026', amount: 850000, principal: 520000, interest: 330000, balanceAfter: 31480000, status: 'Scheduled' },
  { id: 'RP-2026-006', loanId: 'LN-2026-001', period: 'Jun 2026', amount: 850000, principal: 515000, interest: 335000, balanceAfter: 32000000, status: 'Paid' },
  { id: 'RP-2026-005', loanId: 'LN-2026-001', period: 'May 2026', amount: 850000, principal: 510000, interest: 340000, balanceAfter: 32515000, status: 'Paid' },
  { id: 'RP-2026-004', loanId: 'LN-2025-002', period: 'Jul 2026', amount: 1450000, principal: 820000, interest: 630000, balanceAfter: 94180000, status: 'Scheduled' },
  { id: 'RP-2026-003', loanId: 'LN-2025-002', period: 'Jun 2026', amount: 1450000, principal: 815000, interest: 635000, balanceAfter: 95000000, status: 'Paid' },
  { id: 'RP-2026-002', loanId: 'LN-2025-002', period: 'May 2026', amount: 1450000, principal: 810000, interest: 640000, balanceAfter: 95815000, status: 'Paid' },
];

const STATUS_STYLE = {
  'Active': { background: '#ECFDF5', color: '#059669' },
  'Paid Off': { background: '#EFF6FF', color: '#2563EB' },
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Pending Disbursement': { background: '#FEF3C7', color: '#92400E' },
  'Rejected': { background: '#FFF1F2', color: '#BE123C' },
  'Paid': { background: '#ECFDF5', color: '#059669' },
  'Scheduled': { background: '#F0F9FF', color: '#0284C7' },
};

const TAB_ICONS = {
  overview: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  history: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  repayment: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'history', label: 'Loan History' },
  { key: 'repayment', label: 'Repayment Schedule' },
];

function formatCurrency(value) {
  return new Intl.NumberFormat('en-TZ', { style: 'currency', currency: 'TZS', maximumFractionDigits: 0 }).format(value);
}

function LoanPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);

  const activeLoans = LOAN_HISTORY.filter(l => l.status === 'Active');
  const totalOutstanding = activeLoans.reduce((sum, l) => sum + l.balance, 0);
  const totalMonthlyPayment = activeLoans.reduce((sum, l) => sum + l.monthlyPayment, 0);

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Loan Management"
          subtitle="Manage your loan applications, view balances, and track repayments"
          color="#2563EB"
          ctaLabel="Apply for Loan"
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

        {activeTab === 'overview' && (
          <>
            <div className="loan-overview-grid">
              <Card className="loan-stat-card" hover={false}>
                <div className="loan-stat-icon loan-stat-icon--primary">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                </div>
                <div className="loan-stat-body">
                  <span className="loan-stat-value">{formatCurrency(totalOutstanding)}</span>
                  <span className="loan-stat-label">Total Outstanding</span>
                </div>
              </Card>
              <Card className="loan-stat-card" hover>
                <div className="loan-stat-icon" style={{ background: '#FEF2F2', color: '#DC2626' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <div className="loan-stat-body">
                  <span className="loan-stat-value">{formatCurrency(totalMonthlyPayment)}</span>
                  <span className="loan-stat-label">Monthly Payment</span>
                </div>
              </Card>
              <Card className="loan-stat-card" hover>
                <div className="loan-stat-icon" style={{ background: '#FFFBEB', color: '#D97706' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <div className="loan-stat-body">
                  <span className="loan-stat-value">{activeLoans.length}</span>
                  <span className="loan-stat-label">Active Loans</span>
                </div>
              </Card>
              <Card className="loan-stat-card" hover>
                <div className="loan-stat-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                </div>
                <div className="loan-stat-body">
                  <span className="loan-stat-value">{formatCurrency(85000000)}</span>
                  <span className="loan-stat-label">Available Limit</span>
                </div>
              </Card>
            </div>

            <Card hover={false}>
              <div className="leave-section-header">
                <h3 className="leave-section-title">Active Loans</h3>
              </div>
              <div className="loan-active-list">
                {activeLoans.map(row => (
                  <div key={row.id} className="loan-active-item">
                    <div className="loan-active-icon" style={{ background: '#EFF6FF', color: '#2563EB' }}>
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div className="loan-active-body">
                      <span className="loan-active-title">{row.type} &middot; {row.id}</span>
                      <span className="loan-active-meta">Balance: {formatCurrency(row.balance)} &middot; {row.interestRate}% APR &middot; Next: {row.nextPayment}</span>
                    </div>
                    <div className="loan-active-payment">
                      <span className="loan-active-payment-label">Monthly</span>
                      <span className="loan-active-payment-value">{formatCurrency(row.monthlyPayment)}</span>
                    </div>
                    <div className="loan-active-status">
                      <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )}

        {activeTab === 'history' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Reference ID', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'type', header: 'Loan Type' },
                { key: 'amount', header: 'Original Amount', render: row => <span>{formatCurrency(row.amount)}</span> },
                { key: 'balance', header: 'Current Balance', render: row => <span className="loan-balance">{formatCurrency(row.balance)}</span> },
                { key: 'interestRate', header: 'Rate', render: row => <span>{row.interestRate}%</span> },
                { key: 'monthlyPayment', header: 'Monthly', render: row => <span>{formatCurrency(row.monthlyPayment)}</span> },
                { key: 'nextPayment', header: 'Next Payment', render: row => <span>{row.nextPayment || '—'}</span> },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
              ]}
              data={LOAN_HISTORY}
              title="Loan History"
              searchPlaceholder="Search by ID, type, or status..."
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(v => !v)}
              filters={[
                { key: 'type', label: 'Loan Type', options: ['Car Loan', 'Housing Loan', 'Personal Loan', 'Education Loan'].map(t => ({ value: t, label: t })) },
                { key: 'status', label: 'Status', options: ['Active', 'Paid Off', 'Pending Disbursement'].map(s => ({ value: s, label: s })) },
              ]}
              loading={isLoading}
              refreshAction={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }}
              exportAction={() => alert('Exporting loan history...')}
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => setSelectedLoan(row)} title="View Details">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button className="action-btn action-btn--download" onClick={() => alert('Downloading ' + row.id)} title="Download Statement">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                </div>
              )}
              emptyState={{ title: 'No loan records found', description: 'No records match your search or filter criteria.' }}
            />

            {selectedLoan && (
              <Modal isOpen={!!selectedLoan} onClose={() => setSelectedLoan(null)} title={`Loan Details - ${selectedLoan.id}`} size="md">
                <div className="leave-detail-modal">
                  <div className="leave-detail-section">
                    <div className="leave-detail-grid">
                      <div className="leave-detail-item"><span className="leave-detail-label">Reference ID</span><span className="leave-detail-value">{selectedLoan.id}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Loan Type</span><span className="leave-detail-value">{selectedLoan.type}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Original Amount</span><span className="leave-detail-value">{formatCurrency(selectedLoan.amount)}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Current Balance</span><span className="leave-detail-value loan-balance">{formatCurrency(selectedLoan.balance)}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Interest Rate</span><span className="leave-detail-value">{selectedLoan.interestRate}% APR</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Term</span><span className="leave-detail-value">{selectedLoan.term} months</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Monthly Payment</span><span className="leave-detail-value">{formatCurrency(selectedLoan.monthlyPayment)}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Start Date</span><span className="leave-detail-value">{selectedLoan.startDate}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Next Payment</span><span className="leave-detail-value">{selectedLoan.nextPayment || 'Completed'}</span></div>
                      <div className="leave-detail-item"><span className="leave-detail-label">Status</span><span className="leave-detail-value"><span className="status-pill" style={{ background: STATUS_STYLE[selectedLoan.status]?.background, color: STATUS_STYLE[selectedLoan.status]?.color }}>{selectedLoan.status}</span></span></div>
                    </div>
                  </div>
                  {selectedLoan.approvedBy && (
                    <div className="leave-detail-section leave-detail-decision">
                      <h5 className="leave-detail-section-title">Approval Information</h5>
                      <div className="leave-detail-grid">
                        <div className="leave-detail-item"><span className="leave-detail-label">Approved By</span><span className="leave-detail-value">{selectedLoan.approvedBy}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Approval Date</span><span className="leave-detail-value">{selectedLoan.approvedDate}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              </Modal>
            )}
          </>
        )}

        {activeTab === 'repayment' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Reference ID', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'loanId', header: 'Loan ID' },
                { key: 'period', header: 'Period' },
                { key: 'amount', header: 'Payment', render: row => <span>{formatCurrency(row.amount)}</span> },
                { key: 'principal', header: 'Principal', render: row => <span>{formatCurrency(row.principal)}</span> },
                { key: 'interest', header: 'Interest', render: row => <span>{formatCurrency(row.interest)}</span> },
                { key: 'balanceAfter', header: 'Balance After', render: row => <span className="loan-balance">{formatCurrency(row.balanceAfter)}</span> },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
              ]}
              data={REPAYMENTS}
              title="Repayment Schedule"
              searchPlaceholder="Search by period or reference ID..."
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(v => !v)}
              filters={[
                { key: 'status', label: 'Status', options: ['Paid', 'Scheduled'].map(s => ({ value: s, label: s })) },
              ]}
              loading={isLoading}
              refreshAction={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }}
              exportAction={() => alert('Exporting repayment schedule...')}
              emptyState={{ title: 'No repayment records found', description: 'No records match your search or filter criteria.' }}
            />
          </>
        )}

        {showApplyModal && (
          <Modal
            isOpen={showApplyModal}
            onClose={() => setShowApplyModal(false)}
            title="Apply for Loan"
            size="lg"
            className="apply-leave-modal"
            footer={
              <div className="leave-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowApplyModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => alert('Loan application submitted')}>Submit Application</button>
              </div>
            }
          >
            <form className="leave-form" onSubmit={e => e.preventDefault()}>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Loan Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Loan Type</label><select className="form-input form-select"><option>Car Loan</option><option>Housing Loan</option><option>Personal Loan</option><option>Education Loan</option><option>Emergency Loan</option></select></div>
                  <div className="form-group"><label className="form-label">Requested Amount (TZS)</label><input type="number" className="form-input" placeholder="e.g. 5000000" /></div>
                  <div className="form-group"><label className="form-label">Loan Term (Months)</label><select className="form-input form-select"><option>12</option><option>24</option><option>36</option><option>48</option><option>60</option><option>84</option><option>120</option></select></div>
                  <div className="form-group"><label className="form-label">Purpose</label><input type="text" className="form-input" placeholder="Brief purpose of the loan" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Financial Information</h4>
                <div className="leave-form-row">
                  <div className="form-group"><label className="form-label">Monthly Net Salary</label><input type="text" className="form-input" value="TZS 2,500,000" disabled /></div>
                  <div className="form-group"><label className="form-label">Existing Monthly Deductions</label><input type="text" className="form-input" value="TZS 2,300,000" disabled /></div>
                  <div className="form-group"><label className="form-label">Disposable Income</label><input type="text" className="form-input" value="TZS 200,000" disabled /></div>
                  <div className="form-group"><label className="form-label">Available Loan Limit</label><input type="text" className="form-input" value="TZS 85,000,000" disabled /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Supporting Documents</h4>
                <div className="leave-form-row leave-form-row--two">
                  <div className="form-group"><label className="form-label">Additional Notes</label><textarea className="form-input" rows="4" placeholder="Any additional information to support your application..."></textarea></div>
                  <div className="form-group"><label className="form-label">Upload Documents</label><div className="file-upload-area"><div className="file-upload-content"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg><p className="file-upload-title">Click or drag files to upload</p><p className="file-upload-hint">PDF, DOC, JPG, PNG up to 10MB each</p></div></div></div>
                </div>
              </div>
            </form>
          </Modal>
        )}
      </main>
    </div>
  );
}

export default LoanPage;
