import React, { useState, useRef } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import Modal from '../../../components/common/Modal/Modal';
import DataTable from '../../../components/common/DataTable/DataTable';
import LocationGroup from '../../../components/common/location/LocationGroup';
import html2pdf from 'html2pdf.js';
import { notificationService } from '../../../components/Notifications/notificationService';
import './TransferPage.css';

const TRANSFER_HISTORY = [
  { id: 'TR-2026-001', type: 'Professional / career reasons', fromStation: 'Dar es Salaam HQ', toStation: 'Dodoma Regional Office', effectiveDate: '2026-08-01', status: 'Approved', appliedOn: '2026-05-15', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-06-10', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Reassignment to new regional headquarters', contactAddress: 'Plot 42, Nyerere Road, Dodoma', contactPhone: '+255 765 432 101' },
  { id: 'TR-2026-002', type: 'Professional / career reasons', fromStation: 'HR Division', toStation: 'Finance Division', effectiveDate: '2026-07-01', status: 'Approved', appliedOn: '2026-04-20', approvedBy: 'Mr. Joseph Mwangi', approverRole: 'Director General', decisionDate: '2026-05-15', region: 'Dar es Salaam', district: 'Ilala', reason: 'Skill utilization in financial operations', contactAddress: 'House 12, Upanga, Dar es Salaam', contactPhone: '+255 789 123 456' },
  { id: 'TR-2026-003', type: 'Family reasons (spouse, mother, or father)', fromStation: 'Arusha Regional Office', toStation: 'Mwanza Regional Office', effectiveDate: '2026-09-01', status: 'Pending', appliedOn: '2026-06-01', approvedBy: null, approverRole: null, decisionDate: null, region: 'Mwanza', district: 'Ilemela', reason: 'Family relocation request', contactAddress: 'P.O. Box 450, Arusha', contactPhone: '+255 754 321 987' },
  { id: 'TR-2026-004', type: 'Professional / career reasons', fromStation: 'Mbeya District Office', toStation: 'Head Office - Dodoma', effectiveDate: '2026-10-01', status: 'Approved', appliedOn: '2026-05-01', approvedBy: 'Dr. Amina Hassan', approverRole: 'Head of Human Resources', decisionDate: '2026-06-20', region: 'Dodoma', district: 'Dodoma Municipal', reason: 'Promotion to Senior Officer grade', contactAddress: 'Plot 8, Sokoine Road, Mbeya', contactPhone: '+255 767 890 234' },
];

const CONFIRMATION_LETTERS = [
  { id: 'TC-2026-001', type: 'Professional / career reasons', period: 'Dar es Salaam HQ to Dodoma Regional Office', effectiveDate: '01 Aug 2026', status: 'Issued' },
  { id: 'TC-2026-002', type: 'Professional / career reasons', period: 'HR Division to Finance Division', effectiveDate: '01 Jul 2026', status: 'Issued' },
  { id: 'TC-2026-003', type: 'Professional / career reasons', period: 'Mbeya to Head Office - Dodoma', effectiveDate: '01 Oct 2026', status: 'Issued' },
];

const STATUS_STYLE = {
  'Pending': { background: '#FFFBEB', color: '#D97706' },
  'Approved': { background: '#ECFDF5', color: '#059669' },
  'Rejected': { background: '#FFF1F2', color: '#BE123C' },
  'Returned for Correction': { background: '#FEF3C7', color: '#92400E' },
  'Issued': { background: '#ECFDF5', color: '#059669' },
};

const TAB_ICONS = {
  overview: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>,
  history: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  confirmation: <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
};

const TABS = [
  { key: 'overview', label: 'Overview' },
  { key: 'history', label: 'Transfer History' },
  { key: 'confirmation', label: 'Confirmation Letter' },
];

function TransferPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [replaceIndex, setReplaceIndex] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedConfirmationLetter, setSelectedConfirmationLetter] = useState(null);
  const [transferLocation, setTransferLocation] = useState({ region: '', district: '', ward: '' });

  const generateConfirmationLetterHTML = (row) => {
    return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${row.id}</title>
<style>
  @page { size: A4; margin: 0; }
  * { box-sizing: border-box; }
  html { background: #fff; overflow: hidden; }
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; font-size: 10pt; line-height: 1.4; overflow: hidden; }
  .page { width: 210mm; height: 297mm; margin: 0 auto; padding: 15mm 18mm; background: #fff; overflow: hidden; }
  .hdr-center { text-align: center; }
  .hdr-center h1 { font-size: 12pt; font-weight: 700; margin: 0 0 2px; text-transform: uppercase; }
  .hdr-center h2 { font-size: 11pt; font-weight: 700; margin: 0 0 2px; text-transform: uppercase; }
  .hdr-center h3 { font-size: 10pt; font-weight: 700; margin: 0; text-transform: uppercase; }
  .doc-title { text-align: center; font-weight: 700; font-size: 12pt; text-transform: uppercase; margin-bottom: 4px; color: #0B2E59; border-bottom: 2px solid #d4a017; padding-bottom: 8px; }
  .doc-subtitle { text-align: center; font-weight: 600; font-size: 10pt; margin-bottom: 16px; color: #6b7280; }
  .section-title { font-weight: 700; font-size: 10pt; margin: 14px 0 6px; text-transform: uppercase; color: #0B2E59; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  .field-row { display: flex; align-items: baseline; margin-bottom: 8px; }
  .field-label { flex-shrink: 0; font-weight: 500; white-space: nowrap; font-size: 10pt; color: #4b5563; }
  .field-value { flex: 1; border-bottom: 1px dotted #000; padding-left: 6px; min-height: 1em; font-weight: 600; font-size: 10pt; }
  .field-row.two-col { display: flex; gap: 14px; }
  .field-group { flex: 1; display: flex; align-items: baseline; }
  .dotted-area { min-height: 40px; border-bottom: 1px dotted #000; margin-bottom: 4px; }
  .signature { text-align: right; font-style: italic; margin-bottom: 8px; font-size: 9pt; }
  .footer { margin-top: 16px; font-size: 9pt; color: #555; text-align: center; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 12px; }
  .info-item { display: flex; align-items: baseline; }
  .info-label { font-weight: 500; color: #4b5563; font-size: 10pt; white-space: nowrap; margin-right: 6px; }
  .info-value { font-weight: 600; font-size: 10pt; border-bottom: 1px dotted #000; flex: 1; min-height: 1em; }
  @media print {
    html { background: #fff; }
    body { background: #fff; padding: 0; }
    .page { margin: 0 auto; box-shadow: none; width: 100%; height: 297mm; padding: 15mm 18mm; overflow: hidden; }
  }
</style></head>
<body>
  <div class="page">
    <div class="hdr-center">
      <h1>Jamhuri ya Muungano wa Tanzania</h1>
      <h2>Wizara ya Mambo ya Ndani ya Nchi</h2>
      <h3>Idara ya Uhamiaji</h3>
    </div>
    <div class="doc-title">Transfer Confirmation Letter</div>
    <div class="doc-subtitle">Reference No: ${row.id} &middot; Status: ${row.status}</div>
    <div class="section-title">Employee Information</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Full Name:</span><span class="info-value">John Michael Doe</span></div>
      <div class="info-item"><span class="info-label">Employee ID:</span><span class="info-value">EMP-2024-00542</span></div>
      <div class="info-item"><span class="info-label">Designation:</span><span class="info-value">Senior HR Officer</span></div>
      <div class="info-item"><span class="info-label">Department:</span><span class="info-value">Human Resources</span></div>
    </div>
    <div class="section-title">Transfer Details</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Transfer Type:</span><span class="info-value">${row.type}</span></div>
      <div class="info-item"><span class="info-label">Reference ID:</span><span class="info-value">${row.id}</span></div>
      <div class="info-item"><span class="info-label">From Station:</span><span class="info-value">${row.period.split(' to ')[0]}</span></div>
      <div class="info-item"><span class="info-label">To Station:</span><span class="info-value">${row.period.split(' to ')[1]}</span></div>
      <div class="info-item"><span class="info-label">Effective Date:</span><span class="info-value">${row.effectiveDate}</span></div>
      <div class="info-item"><span class="info-label">Status:</span><span class="info-value">${row.status}</span></div>
    </div>
    <div class="section-title">Official Approval</div>
    <p style="font-size:10pt;margin:0 0 8px;">This is to confirm that the above-named employee has been officially approved for transfer as per the details stated. The employee is hereby directed to report to the new station on the effective date indicated.</p>
    <div class="dotted-area"></div>
    <div class="signature">Authorized Signature &middot; Date</div>
    <div class="section-title">Acknowledgement</div>
    <p style="font-size:10pt;margin:0 0 8px;">I hereby acknowledge receipt of this transfer confirmation letter and understand the terms stated herein.</p>
    <div class="dotted-area"></div>
    <div class="signature">Employee Signature &middot; Date</div>
    <div class="footer">Ref: ${row.id} &middot; Transfer Confirmation Letter &middot; Generated by HRMS Staff Portal</div>
  </div>
</body></html>
    `;
  };

  const downloadConfirmationLetterPDF = (row) => {
    const html = generateConfirmationLetterHTML(row);
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-9999';
    container.innerHTML = html;
    document.body.appendChild(container);

    const pageEl = container.querySelector('.page');
    const opt = {
      margin: 0,
      filename: `Transfer_Confirmation_${row.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    };

    return html2pdf().set(opt).from(pageEl).outputPdf('blob').then((blob) => {
      document.body.removeChild(container);
      return blob;
    });
  };

  const handleDownloadConfirmation = (row) => {
    downloadConfirmationLetterPDF(row).then((blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Transfer_Confirmation_${row.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const handlePreviewConfirmation = (row) => {
    setSelectedConfirmationLetter(row);
  };

  const generateTransferRecordHTML = (row) => {
    return `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${row.id}</title>
<style>
  @page { size: A4; margin: 15mm; }
  * { box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #000; font-size: 10pt; line-height: 1.4; }
  .page { max-width: 210mm; margin: 0 auto; padding: 10mm; }
  .hdr-center { text-align: center; margin-bottom: 16px; }
  .hdr-center h1 { font-size: 12pt; font-weight: 700; margin: 0 0 2px; text-transform: uppercase; }
  .hdr-center h2 { font-size: 11pt; font-weight: 700; margin: 0 0 2px; text-transform: uppercase; }
  .doc-title { text-align: center; font-weight: 700; font-size: 12pt; text-transform: uppercase; margin-bottom: 4px; color: #0B2E59; border-bottom: 2px solid #d4a017; padding-bottom: 8px; }
  .doc-subtitle { text-align: center; font-weight: 600; font-size: 10pt; margin-bottom: 16px; color: #6b7280; }
  .section-title { font-weight: 700; font-size: 10pt; margin: 14px 0 6px; text-transform: uppercase; color: #0B2E59; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 24px; margin-bottom: 12px; }
  .info-item { display: flex; align-items: baseline; }
  .info-label { font-weight: 500; color: #4b5563; font-size: 10pt; white-space: nowrap; margin-right: 6px; }
  .info-value { font-weight: 600; font-size: 10pt; border-bottom: 1px dotted #000; flex: 1; min-height: 1em; }
  .footer { margin-top: 16px; font-size: 9pt; color: #555; text-align: center; }
  @media print { body { padding: 0; } .page { margin: 0; max-width: 100%; } }
</style></head>
<body>
  <div class="page">
    <div class="hdr-center">
      <h1>Jamhuri ya Muungano wa Tanzania</h1>
      <h2>Wizara ya Mambo ya Ndani ya Nchi</h2>
    </div>
    <div class="doc-title">Transfer Record</div>
    <div class="doc-subtitle">Reference No: ${row.id} &middot; Status: ${row.status}</div>
    <div class="section-title">Transfer Information</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Reference ID:</span><span class="info-value">${row.id}</span></div>
      <div class="info-item"><span class="info-label">Transfer Type:</span><span class="info-value">${row.type}</span></div>
      <div class="info-item"><span class="info-label">From Station:</span><span class="info-value">${row.fromStation}</span></div>
      <div class="info-item"><span class="info-label">To Station:</span><span class="info-value">${row.toStation}</span></div>
      <div class="info-item"><span class="info-label">Effective Date:</span><span class="info-value">${row.effectiveDate}</span></div>
      <div class="info-item"><span class="info-label">Applied On:</span><span class="info-value">${row.appliedOn}</span></div>
      <div class="info-item"><span class="info-label">Region:</span><span class="info-value">${row.region}</span></div>
      <div class="info-item"><span class="info-label">District:</span><span class="info-value">${row.district}</span></div>
    </div>
    <div class="section-title">Location & Contact</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Contact Address:</span><span class="info-value">${row.contactAddress}</span></div>
      <div class="info-item"><span class="info-label">Contact Phone:</span><span class="info-value">${row.contactPhone}</span></div>
    </div>
    <div class="section-title">Reason for Transfer</div>
    <p style="font-size:10pt;margin:0 0 12px;">${row.reason}</p>
    ${row.status === 'Approved' && row.approvedBy ? `
    <div class="section-title">Approval Decision</div>
    <div class="info-grid">
      <div class="info-item"><span class="info-label">Approved By:</span><span class="info-value">${row.approvedBy}</span></div>
      <div class="info-item"><span class="info-label">Approver Role:</span><span class="info-value">${row.approverRole}</span></div>
      <div class="info-item"><span class="info-label">Decision Date:</span><span class="info-value">${row.decisionDate}</span></div>
    </div>
    ` : ''}
    <div class="footer">Ref: ${row.id} &middot; Transfer Record &middot; Generated by HRMS Staff Portal</div>
  </div>
</body></html>
    `;
  };

  const downloadTransferRecord = (row) => {
    const html = generateTransferRecordHTML(row);
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '-9999';
    container.innerHTML = html;
    document.body.appendChild(container);
    const pageEl = container.querySelector('.page');
    const opt = {
      margin: 0,
      filename: `Transfer_Record_${row.id}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    };
    html2pdf().set(opt).from(pageEl).outputPdf('blob').then((blob) => {
      document.body.removeChild(container);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Transfer_Record_${row.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  };

  const printTransferRecord = (row) => {
    const html = generateTransferRecordHTML(row);
    const w = window.open('', '_blank', 'width=800,height=600');
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => { w.print(); }, 300);
  };

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Transfer Management"
          subtitle="Manage your transfer requests, view history, and download official documents"
          color="#0B2E59"
          ctaLabel="Request Transfer"
          onCta={() => setShowRequestModal(true)}
        />

        <div className="reg-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`reg-tab ${activeTab === tab.key ? 'active' : ''}`}
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

        {/* Request Transfer Modal */}
        {showRequestModal && (
          <Modal
            isOpen={showRequestModal}
            onClose={() => setShowRequestModal(false)}
            title="Request Transfer"
            size="lg"
            className="apply-leave-modal"
            footer={
              <div className="leave-form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                <button type="button" className="btn btn-primary" onClick={() => notificationService.promise(new Promise(resolve => setTimeout(() => { setShowRequestModal(false); resolve(); }, 1000)), { loading: 'Submitting transfer request...', success: 'Transfer request submitted successfully.', error: 'Failed to submit transfer request.' })}>Submit Request</button>
              </div>
            }
          >
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
                  <div className="form-group"><label className="form-label">Transfer Type</label><select className="form-input form-select"><option>Medical grounds</option><option>Family reasons (spouse, mother, or father)</option><option>Professional / career reasons</option><option>Others</option></select></div>
                  <div className="form-group"><label className="form-label">From Station / Office</label><input type="text" className="form-input" placeholder="Current station or office" /></div>
                  <div className="form-group"><label className="form-label">To Station / Office</label><input type="text" className="form-input" placeholder="Requested station or office" /></div>
                  <div className="form-group"><label className="form-label">Effective Date</label><input type="date" className="form-input" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Location Information</h4>
                <div className="leave-form-row">
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <LocationGroup
                      region={transferLocation.region}
                      district={transferLocation.district}
                      ward={transferLocation.ward}
                      onChange={setTransferLocation}
                      labels={{ region: 'New Region', district: 'New District', ward: 'Ward / Office Area' }}
                    />
                  </div>
                  <div className="form-group"><label className="form-label">Contact Address</label><input type="text" className="form-input" placeholder="Enter your contact address" /></div>
                  <div className="form-group"><label className="form-label">Contact Phone Number</label><input type="tel" className="form-input" placeholder="+255 7XX XXX XXX" /></div>
                </div>
              </div>
              <div className="leave-form-section">
                <h4 className="leave-form-section-title">Additional Information</h4>
                <div className="leave-form-row leave-form-row--full">
                  <div className="form-group"><label className="form-label">Reason for Transfer</label><textarea className="form-input" rows="4" placeholder="Provide a clear reason for your transfer request..."></textarea></div>
                </div>
                <div className="leave-form-row leave-form-row--full">
                  <div className="form-group">
                    <label className="form-label">Supporting Documents</label>
                    <p className="leave-form-hint">Upload supporting documents if required for your transfer request (e.g., medical certificate, approval letter, or other supporting documents). Allowed formats: PDF, JPG, PNG (max 10MB each).</p>
                    <input type="file" ref={fileInputRef} className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" onChange={e => {
                      const files = Array.from(e.target.files);
                      if (replaceIndex !== null) {
                        setUploadedFiles(prev => prev.map((f, i) => i === replaceIndex ? files[0] : f));
                        setReplaceIndex(null);
                      } else {
                        setUploadedFiles(prev => [...prev, ...files]);
                      }
                      e.target.value = '';
                    }} />
                    <div className="support-upload-actions">
                      <button type="button" className="btn btn-secondary" onClick={() => { setReplaceIndex(null); fileInputRef.current?.click(); }}>Upload Document</button>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="support-attachments-list" style={{ marginTop: 16 }}>
                        {uploadedFiles.map((file, idx) => (
                          <div key={idx} className="attachment-row">
                            <div className="attachment-icon">
                              {file.type === 'application/pdf' ? (
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                              ) : (
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                              )}
                            </div>
                            <div className="attachment-info">
                              <p className="attachment-name">{file.name}</p>
                              <p className="attachment-hint">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <div className="attachment-actions">
                              <button type="button" className="btn btn-sm btn-primary" onClick={() => { const url = URL.createObjectURL(file); window.open(url, '_blank'); }}>Preview</button>
                              <button type="button" className="btn btn-sm btn-secondary" onClick={() => { setReplaceIndex(idx); fileInputRef.current?.click(); }}>Replace</button>
                              <button type="button" className="btn btn-sm btn-secondary" onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== idx))}>Remove</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </Modal>
        )}

        {activeTab === 'history' && (
          <>
            <DataTable
              columns={[
                { key: 'id', header: 'Reference ID', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'type', header: 'Transfer Type', render: row => <span className="leave-type">{row.type}</span> },
                { key: 'fromStation', header: 'From Station' },
                { key: 'toStation', header: 'To Station' },
                { key: 'effectiveDate', header: 'Effective Date' },
                { key: 'region', header: 'Region' },
                { key: 'district', header: 'District' },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
              ]}
              data={TRANSFER_HISTORY}
              title="Transfer History"
              searchPlaceholder="Search by ID, type, region or station..."
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(v => !v)}
              filters={[
                { key: 'type', label: 'Transfer Type', options: ['Medical grounds', 'Family reasons (spouse, mother, or father)', 'Professional / career reasons', 'Others'].map(t => ({ value: t, label: t })) },
                { key: 'status', label: 'Status', options: ['Approved', 'Pending', 'Rejected'].map(s => ({ value: s, label: s })) },
              ]}
              loading={isLoading}
              refreshAction={() => { setIsLoading(true); setTimeout(() => setIsLoading(false), 600); }}
              exportAction={() => notificationService.info('Exporting transfer history...')}
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => setSelectedTransfer(row)} title="View Details">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  </button>
                  <button className="action-btn action-btn--download" onClick={() => downloadTransferRecord(row)} title="Download">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                  </button>
                  <button className="action-btn action-btn--print" onClick={() => printTransferRecord(row)} title="Print">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                  </button>
                </div>
              )}
              emptyState={{ title: 'No transfer records found', description: 'No records match your search or filter criteria.' }}
            />

            {selectedTransfer && (
              <Modal isOpen={!!selectedTransfer} onClose={() => setSelectedTransfer(null)} title={`Transfer Details - ${selectedTransfer.id}`} footer={<button className="btn btn-secondary" onClick={() => setSelectedTransfer(null)}>Close</button>}>
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
                    <button className="btn btn-sm btn-secondary" onClick={() => handlePreviewConfirmation(row)}>Preview</button>
                    <button className="btn btn-sm btn-primary" onClick={() => handleDownloadConfirmation(row)}>Download PDF</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Confirmation Letter View Modal */}
            {selectedConfirmationLetter && (
              <Modal
                isOpen={!!selectedConfirmationLetter}
                onClose={() => setSelectedConfirmationLetter(null)}
                title={(
                  <div className="doc-preview-header">
                    <div className="doc-preview-header-title">Transfer Confirmation Letter</div>
                    <div className="doc-preview-header-subtitle">Reference No: {selectedConfirmationLetter.id} &middot; {selectedConfirmationLetter.status}</div>
                  </div>
                )}
                className="doc-preview-modal"
                footer={(
                  <div className="doc-preview-footer">
                    <button className="btn btn-secondary" onClick={() => setSelectedConfirmationLetter(null)}>Close</button>
                    <button className="btn btn-primary" onClick={() => handleDownloadConfirmation(selectedConfirmationLetter)}>Download</button>
                  </div>
                )}
              >
                <div className="transfer-detail-modal">
                  <div className="transfer-detail-section">
                    <h5 className="transfer-detail-section-title">Employee Information</h5>
                    <div className="transfer-detail-grid">
                      <div className="transfer-detail-item"><span className="transfer-detail-label">Full Name</span><span className="transfer-detail-value">John Michael Doe</span></div>
                      <div className="transfer-detail-item"><span className="transfer-detail-label">Employee ID</span><span className="transfer-detail-value">EMP-2024-00542</span></div>
                      <div className="transfer-detail-item"><span className="transfer-detail-label">Designation</span><span className="transfer-detail-value">Senior HR Officer</span></div>
                      <div className="transfer-detail-item"><span className="transfer-detail-label">Department</span><span className="transfer-detail-value">Human Resources</span></div>
                    </div>
                  </div>
                  <div className="transfer-detail-section">
                    <h5 className="transfer-detail-section-title">Transfer Details</h5>
                    <div className="transfer-detail-grid">
                      <div className="transfer-detail-item"><span className="transfer-detail-label">Transfer Type</span><span className="transfer-detail-value">{selectedConfirmationLetter.type}</span></div>
                      <div className="transfer-detail-item"><span className="transfer-detail-label">Reference ID</span><span className="transfer-detail-value">{selectedConfirmationLetter.id}</span></div>
                      <div className="transfer-detail-item"><span className="transfer-detail-label">From Station</span><span className="transfer-detail-value">{selectedConfirmationLetter.period.split(' to ')[0]}</span></div>
                      <div className="transfer-detail-item"><span className="transfer-detail-label">To Station</span><span className="transfer-detail-value">{selectedConfirmationLetter.period.split(' to ')[1]}</span></div>
                      <div className="transfer-detail-item"><span className="transfer-detail-label">Effective Date</span><span className="transfer-detail-value">{selectedConfirmationLetter.effectiveDate}</span></div>
                      <div className="transfer-detail-item"><span className="transfer-detail-label">Status</span><span className="transfer-detail-value">{selectedConfirmationLetter.status}</span></div>
                    </div>
                  </div>
                  <div className="transfer-detail-section">
                    <h5 className="transfer-detail-section-title">Official Approval</h5>
                    <p className="transfer-detail-text">This is to confirm that the above-named employee has been officially approved for transfer as per the details stated. The employee is hereby directed to report to the new station on the effective date indicated.</p>
                  </div>
                  <div className="transfer-detail-section">
                    <h5 className="transfer-detail-section-title">Acknowledgement</h5>
                    <p className="transfer-detail-text">I hereby acknowledge receipt of this transfer confirmation letter and understand the terms stated herein.</p>
                  </div>
                </div>
              </Modal>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default TransferPage;
