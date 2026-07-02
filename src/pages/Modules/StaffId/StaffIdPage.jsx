import React, { useState, useRef } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Modal from '../../../components/common/Modal/Modal';
import DataTable from '../../../components/common/DataTable/DataTable';
import './StaffIdPage.css';

const ID_CARD = {
  name: 'John Michael Doe', employeeNo: 'EMP-2024-00542', department: 'Human Resources',
  directorate: 'Administration & HR', designation: 'Senior HR Officer',
  workStation: 'Dar es Salaam HQ', officeLocation: '3rd Floor, Block A',
  issued: '2025-01-15', expires: '2030-01-15', status: 'Active', photo: null,
};

const APPLICATIONS = [
  { id: 'SID-2026-001', type: 'New Staff ID', reason: 'New Staff ID', submittedDate: '2026-06-15', status: 'Issued', lastUpdated: '2026-06-20', hrResponse: 'Approved', remarks: 'ID card printed and issued', correctionStatus: 'No Action Required' },
  { id: 'SID-2026-002', type: 'Replacement', reason: 'Lost ID', submittedDate: '2026-05-20', status: 'Ready for Collection', lastUpdated: '2026-06-28', hrResponse: 'Approved', remarks: 'Collect at HR Office, Block B', correctionStatus: 'No Action Required' },
  { id: 'SID-2026-003', type: 'Renewal', reason: 'Renewal', submittedDate: '2026-06-01', status: 'Under Review', lastUpdated: '2026-06-05', hrResponse: 'Pending', remarks: 'Awaiting document verification', correctionStatus: 'No Action Required' },
  { id: 'SID-2026-004', type: 'Replacement', reason: 'Damaged ID', submittedDate: '2026-04-10', status: 'Approved', lastUpdated: '2026-04-25', hrResponse: 'Approved', remarks: 'Application approved for printing', correctionStatus: 'No Action Required' },
  { id: 'SID-2026-005', type: 'New Staff ID', reason: 'New Staff ID', submittedDate: '2026-06-10', status: 'Returned for Correction', lastUpdated: '2026-06-12', hrResponse: 'Returned for Correction', remarks: 'Please upload a clearer passport photograph and update your work station address.', correctionStatus: 'Pending Correction', returnedDate: '2026-06-12', returnedBy: 'Grace Mbelwa' },
];

const TIMELINE = [
  { stage: 'Application Submitted', date: '2026-05-20', time: '09:30 AM', officer: 'John Doe', status: 'Completed', comment: 'Application received' },
  { stage: 'Received by HR', date: '2026-05-20', time: '10:15 AM', officer: 'Grace Mbelwa', status: 'Completed', comment: 'Document verification started' },
  { stage: 'Verification', date: '2026-05-22', time: '02:00 PM', officer: 'Dr. Amina Hassan', status: 'Completed', comment: 'All documents verified' },
  { stage: 'Returned for Correction', date: '2026-06-12', time: '02:30 PM', officer: 'Grace Mbelwa', status: 'Completed', comment: 'Please upload a clearer passport photograph and update your work station address' },
  { stage: 'Correction Submitted', date: '2026-06-15', time: '10:00 AM', officer: 'John Doe', status: 'Current', comment: 'Updated documents and address resubmitted' },
  { stage: 'Re-evaluation by HR', date: '2026-06-15', time: '11:00 AM', officer: 'Grace Mbelwa', status: 'Pending', comment: 'Under re-review after correction' },
  { stage: 'Approved', date: '2026-05-28', time: '11:45 AM', officer: 'Dr. Amina Hassan', status: 'Completed', comment: 'Application approved for printing' },
  { stage: 'Printing', date: '2026-06-05', time: '08:00 AM', officer: 'ICT Print Unit', status: 'Completed', comment: 'Card printed successfully' },
  { stage: 'Quality Verification', date: '2026-06-10', time: '03:30 PM', officer: 'Quality Team', status: 'Completed', comment: 'Quality check passed' },
  { stage: 'Ready for Collection', date: '2026-06-28', time: '09:00 AM', officer: 'HR Office', status: 'Current', comment: 'Collect at HR Office, Block B, Ground Floor' },
];

const REASON_ATTACHMENTS = {
  'New Staff ID': [{ name: 'Passport-size Photograph', required: true }],
  'Lost ID': [{ name: 'Police Loss Report', required: true }, { name: 'Introduction Letter', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Damaged ID': [{ name: 'Scanned Damaged Staff ID', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Renewal': [{ name: 'Existing Staff ID', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Change of Name': [{ name: 'Name Change Document', required: true }, { name: 'National ID', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Promotion': [{ name: 'Promotion Letter', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Change of Department': [{ name: 'Transfer Letter', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Change of Designation': [{ name: 'Re-designation Letter', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Replacement': [{ name: 'Supporting Document', required: true }, { name: 'Passport-size Photograph', required: true }],
  'Other': [{ name: 'Relevant Supporting Document', required: true }],
};

const STATUS_STYLE = {
  Active: { background: '#ECFDF5', color: '#065F46' },
  Expired: { background: '#FEF2F2', color: '#991B1B' },
  Pending: { background: '#FFFBEB', color: '#92400E' },
  Approved: { background: '#EAF4FF', color: '#0B2E59' },
  Rejected: { background: '#FFF1F2', color: '#BE123C' },
  'Under Review': { background: '#EAF4FF', color: '#2F80ED' },
  'Ready for Collection': { background: '#ECFDF5', color: '#059669' },
  Issued: { background: '#F5F3FF', color: '#7C3AED' },
  Draft: { background: '#F3F4F6', color: '#6B7280' },
  Completed: { background: '#ECFDF5', color: '#059669' },
  Printing: { background: '#FFFBEB', color: '#D97706' },
  'Returned for Correction': { background: '#FEF3C7', color: '#92400E' },
  Resubmitted: { background: '#EEF2FF', color: '#4F46E5' },
  Submitted: { background: '#EAF4FF', color: '#2F80ED' },
};

const TAB_ICONS = {
  my: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  status: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
};

const TABS = [
  { key: 'my', label: 'My Applications' },
  { key: 'status', label: 'Request Status' },
];

const STEPS = ['Application Details', 'Attachments', 'ID Preview', 'Declaration', 'Submit'];

function StaffIdPage() {
  const [activeTab, setActiveTab] = useState('my');
  const [step, setStep] = useState(1);
  const [selectedApp, setSelectedApp] = useState(null);
  const [modalTab, setModalTab] = useState('info');
  const [declared, setDeclared] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appReason, setAppReason] = useState('New Staff ID');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const fileInputRefs = useRef({});
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [trackingApp, setTrackingApp] = useState(APPLICATIONS[4]);

  const openApp = (app) => { setSelectedApp(app); setModalTab('info'); };

  const openCorrection = (app) => {
    setEditingApp(app);
    setAppReason(app.reason);
    setShowRequestModal(true);
    setStep(1);
    setSubmitted(false);
    setDeclared(false);
  };

  const handleFile = (field, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFiles(prev => ({ ...prev, [field]: file }));
  };

  const renderIdCard = () => (
    <div className="id-card-visual">
      <div className="id-card-header">
        <div className="id-card-logo">TZ</div>
        <div><div className="id-card-org-name">United Republic of Tanzania</div><div className="id-card-org-sub">Immigration Services Department</div></div>
      </div>
      <div className="id-card-body">
        <div className="id-card-photo">{ID_CARD.photo ? <img src={ID_CARD.photo} alt="Staff" /> : <span className="id-card-photo-placeholder">JD</span>}</div>
        <div>
          <div className="id-card-name">{ID_CARD.name}</div>
          <div className="id-card-designation">{ID_CARD.designation}</div>
          <div className="id-card-meta"><span>Emp: {ID_CARD.employeeNo}</span><span>Dept: {ID_CARD.department}</span></div>
        </div>
      </div>
      <div className="id-card-footer">
        <span>Issued: {ID_CARD.issued}</span>
        <span>Expires: {ID_CARD.expires}</span>
        <span className="id-card-status" style={{ ...STATUS_STYLE[ID_CARD.status], border: '1px solid rgba(255,255,255,0.3)' }}>{ID_CARD.status}</span>
      </div>
      <div style={{ position: 'absolute', bottom: 12, right: 16, zIndex: 1 }}>
        <div className="id-card-qr"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg></div>
      </div>
    </div>
  );

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="Staff ID Management"
          subtitle="Manage your official identification and applications"
          color="#0B2E59"
          ctaLabel="Request Staff ID"
          onCta={() => setShowRequestModal(true)}
        />

        <div className="tabs leave-tabs">
          {TABS.map(tab => (
            <button key={tab.key} className={`tab ${activeTab === tab.key ? 'active' : ''}`} onClick={() => { setActiveTab(tab.key); setStep(1); setSubmitted(false); }}>
              {TAB_ICONS[tab.key]}{tab.label}
            </button>
          ))}
        </div>

        {/* Request Staff ID Modal */}
        {showRequestModal && (
          <Modal
            isOpen={showRequestModal}
            onClose={() => { setShowRequestModal(false); setStep(1); setSubmitted(false); setEditingApp(null); }}
            title={editingApp ? `Edit Staff ID Application (Correction Mode) - ${editingApp.id}` : 'Request Staff ID'}
            size="lg"
            className="apply-leave-modal"
            footer={
              !submitted ? (
                step === 1 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => { setShowRequestModal(false); setStep(1); setEditingApp(null); }}>Cancel</button>
                    <button className="btn btn-primary" onClick={() => setStep(2)}>Next: Attachments</button>
                  </div>
                ) : step === 2 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => setStep(1)}>Previous</button>
                    <button className="btn btn-primary" onClick={() => setStep(3)}>Next: Preview</button>
                  </div>
                ) : step === 3 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => setStep(2)}>Previous</button>
                    <button className="btn btn-primary" onClick={() => setStep(4)}>Next: Declaration</button>
                  </div>
                ) : step === 4 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => setStep(3)}>Previous</button>
                    <button className="btn btn-primary" disabled={!declared} onClick={() => setStep(5)}>Next: Review</button>
                  </div>
                ) : step === 5 ? (
                  <div className="leave-form-actions">
                    <button className="btn btn-secondary" onClick={() => setStep(4)}>Previous</button>
                    <button className="btn btn-secondary" onClick={() => alert('Draft saved')}>Save Draft</button>
                    <button className="btn btn-primary" onClick={() => setSubmitted(true)}>Submit Application</button>
                  </div>
                ) : null
              ) : (
                <div className="leave-form-actions">
                  <button className="btn btn-secondary" onClick={() => { setShowRequestModal(false); setSubmitted(false); setStep(1); setEditingApp(null); }}>Close</button>
                  <button className="btn btn-primary" onClick={() => { setShowRequestModal(false); setSubmitted(false); setActiveTab('my'); setEditingApp(null); }}>View My Applications</button>
                </div>
              )
            }
          >
            {!submitted ? (
              <>
                <div className="staffid-stepper">
                  {STEPS.map((s, i) => (
                    <React.Fragment key={s}>
                      <div className={`staffid-step ${step === i + 1 ? 'active' : step > i + 1 ? 'completed' : ''}`}>
                        <div className="staffid-step-number">{step > i + 1 ? <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> : i + 1}</div>
                        <span className="staffid-step-label">{s}</span>
                      </div>
                      {i < STEPS.length - 1 && <div className={`staffid-step-separator ${step > i + 1 ? 'completed' : ''}`} />}
                    </React.Fragment>
                  ))}
                </div>

                {step === 1 && (
                  <>
                    {editingApp && editingApp.remarks && (
                      <div className="staffid-correction-banner">
                        <h5>HR Correction Remarks</h5>
                        <p>{editingApp.remarks}</p>
                        <span>Returned by {editingApp.returnedBy} on {editingApp.returnedDate}</span>
                      </div>
                    )}
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Applicant Information</h4>
                      <div className="leave-form-row">
                        <div className="form-group"><label className="form-label">Employee Number</label><input type="text" className="form-input" value={ID_CARD.employeeNo} disabled /></div>
                        <div className="form-group"><label className="form-label">Full Name</label><input type="text" className="form-input" value={ID_CARD.name} disabled /></div>
                        <div className="form-group"><label className="form-label">Department</label><input type="text" className="form-input" value={ID_CARD.department} disabled /></div>
                        <div className="form-group"><label className="form-label">Directorate / Unit</label><input type="text" className="form-input" value={ID_CARD.directorate} disabled /></div>
                        <div className="form-group"><label className="form-label">Designation</label><input type="text" className="form-input" value={ID_CARD.designation} disabled /></div>
                        <div className="form-group"><label className="form-label">Work Station</label><input type="text" className="form-input" value={ID_CARD.workStation} disabled /></div>
                        <div className="form-group"><label className="form-label">Office Location</label><input type="text" className="form-input" value={ID_CARD.officeLocation} disabled /></div>
                      </div>
                    </div>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Application Details</h4>
                      <div className="leave-form-row">
                        <div className="form-group"><label className="form-label">Application Type</label><select className="form-input form-select"><option>New Staff ID</option><option>Replacement</option><option>Renewal</option></select></div>
                        <div className="form-group"><label className="form-label">Reason for Application</label><select className="form-input form-select" value={appReason} onChange={e => setAppReason(e.target.value)}>{Object.keys(REASON_ATTACHMENTS).map(r => <option key={r}>{r}</option>)}</select></div>
                      </div>
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Required Supporting Documents</h4>
                      <p className="leave-section-desc" style={{ marginTop: -12, marginBottom: 16 }}>Based on reason: <strong>{appReason}</strong>. Allowed formats: PDF, JPG, PNG (max 10MB each).</p>
                      {(REASON_ATTACHMENTS[appReason] || []).map(att => (
                        <div key={att.name} className="attachment-row">
                          <div className="attachment-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                          <div className="attachment-info">
                            <p className="attachment-name">{att.name}</p>
                            <p className="attachment-hint">{uploadedFiles[att.name] ? uploadedFiles[att.name].name : 'No file selected'}</p>
                          </div>
                          <div className="attachment-status"><span className={`attachment-badge ${att.required ? 'required' : 'optional'}`}>{att.required ? 'Required' : 'Optional'}</span></div>
                          <div className="attachment-actions">
                            <input type="file" ref={el => { fileInputRefs.current[att.name] = el; }} className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" onChange={e => handleFile(att.name, e)} />
                            <button className="btn btn-sm btn-primary" onClick={() => fileInputRefs.current[att.name]?.click()}>{uploadedFiles[att.name] ? 'Replace' : 'Upload'}</button>
                            {uploadedFiles[att.name] && <button className="btn btn-sm btn-secondary" onClick={() => setUploadedFiles(prev => { const n = { ...prev }; delete n[att.name]; return n; })}>Remove</button>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {step === 3 && (
                  <>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Staff ID Preview</h4>
                      <div className="id-card-preview-wrap">{renderIdCard()}</div>
                    </div>
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Declaration</h4>
                      <div className="staffid-declaration">
                        <p className="staffid-declaration-text">I, <strong>{ID_CARD.name}</strong>, hereby declare that all the information provided in this Staff ID application is true, accurate, and complete to the best of my knowledge. I understand that any false or misleading information may result in the rejection of this application and may subject me to disciplinary action in accordance with the organization's policies and regulations.</p>
                        <div className="staffid-declaration-check">
                          <input type="checkbox" id="declare" checked={declared} onChange={e => setDeclared(e.target.checked)} />
                          <label htmlFor="declare">I accept the declaration and confirm the information is accurate.</label>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {step === 5 && (
                  <>
                    <div className="leave-form-section">
                      <h4 className="leave-form-section-title">Application Summary</h4>
                      <div className="leave-detail-grid" style={{ marginBottom: 24 }}>
                        <div className="leave-detail-item"><span className="leave-detail-label">Applicant</span><span className="leave-detail-value">{ID_CARD.name}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Employee No</span><span className="leave-detail-value">{ID_CARD.employeeNo}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Department</span><span className="leave-detail-value">{ID_CARD.department}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Designation</span><span className="leave-detail-value">{ID_CARD.designation}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Reason</span><span className="leave-detail-value">{appReason}</span></div>
                        <div className="leave-detail-item"><span className="leave-detail-label">Documents</span><span className="leave-detail-value">{Object.keys(uploadedFiles).length} uploaded</span></div>
                      </div>
                      <h5 style={{ fontSize: 13, fontWeight: 700, margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: 0.8 }}>Uploaded Attachments</h5>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {Object.entries(uploadedFiles).map(([name, file]) => (
                          <div key={name} className="attachment-row" style={{ padding: '10px 16px' }}>
                            <div className="attachment-icon" style={{ width: 32, height: 32 }}><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/></svg></div>
                            <div className="attachment-info"><p className="attachment-name" style={{ fontSize: 13 }}>{name}</p><p className="attachment-hint">{file.name} &middot; {(file.size / 1024).toFixed(1)} KB</p></div>
                          </div>
                        ))}
                        {Object.keys(uploadedFiles).length === 0 && <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>No documents uploaded</p>}
                      </div>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="staffid-success">
                <div className="staffid-success-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
                <h3 className="staffid-success-title">{editingApp ? 'Correction Submitted Successfully' : 'Application Submitted Successfully'}</h3>
                <p className="staffid-success-desc">{editingApp ? 'Your corrected Staff ID application has been resubmitted to the Human Resource Office for re-evaluation.' : 'Your Staff ID application has been successfully submitted to the Human Resource Office for processing.'}</p>
                <div className="staffid-success-details">
                  <div className="staffid-success-row"><span className="staffid-success-label">Application Number</span><span className="staffid-success-value">{editingApp ? editingApp.id : 'SID-2026-005'}</span></div>
                  <div className="staffid-success-row"><span className="staffid-success-label">Submission Date</span><span className="staffid-success-value">{new Date().toISOString().split('T')[0]}</span></div>
                  <div className="staffid-success-row"><span className="staffid-success-label">Current Status</span><span className="staffid-success-value"><span className="status-pill" style={editingApp ? STATUS_STYLE.Resubmitted : STATUS_STYLE.Submitted}>{editingApp ? 'Resubmitted' : 'Submitted'}</span></span></div>
                </div>
              </div>
            )}
          </Modal>
        )}

        {activeTab === 'my' && (
          <>
            <div className="leave-section-header"><div><h3 className="leave-section-title">My Applications</h3><p className="leave-section-desc">Track and manage all your Staff ID applications</p></div></div>
            <DataTable
              columns={[
                { key: 'id', header: 'Application No', render: row => <span className="id-badge">{row.id}</span> },
                { key: 'type', header: 'Type', render: row => <span className="leave-type">{row.type}</span> },
                { key: 'reason', header: 'Reason' },
                { key: 'submittedDate', header: 'Submitted Date' },
                { key: 'status', header: 'Status', render: row => <span className="status-pill" style={{ background: STATUS_STYLE[row.status]?.background, color: STATUS_STYLE[row.status]?.color }}>{row.status}</span> },
                { key: 'hrResponse', header: 'HR Response' },
                { key: 'lastUpdated', header: 'Last Updated' },
              ]}
              data={APPLICATIONS}
              title="Applications"
              searchPlaceholder="Search by ID, reason, or status..."
              actionColumn={row => (
                <div className="dt-actions">
                  <button className="action-btn action-btn--view" onClick={() => openApp(row)} title="View Details"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></button>
                  {(row.status === 'Returned for Correction' || row.status === 'Draft') && (
                    <button className="action-btn action-btn--edit" onClick={() => openCorrection(row)} title="Edit / Correct Application"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  )}
                </div>
              )}
              emptyState={{ title: 'No applications found', description: 'You have not submitted any Staff ID applications yet.' }}
            />
          </>
        )}

        {activeTab === 'status' && (
          <>
            <div className="leave-section-header"><div><h3 className="leave-section-title">Request Status</h3><p className="leave-section-desc">Track application progress, HR responses, and processing stages</p></div></div>

            <div className="staffid-tracker-selector">
              <label className="form-label">Select Application</label>
              <select className="form-input form-select" value={trackingApp?.id || ''} onChange={e => setTrackingApp(APPLICATIONS.find(a => a.id === e.target.value) || null)}>
                {APPLICATIONS.map(app => (
                  <option key={app.id} value={app.id}>{app.id} — {app.type} ({app.status})</option>
                ))}
              </select>
            </div>

            {trackingApp && (
              <>
                <div className="staffid-status-card">
                  <div className="staffid-status-card-main">
                    <div>
                      <span className="staffid-status-card-label">Current Status</span>
                      <span className="status-pill" style={{ background: STATUS_STYLE[trackingApp.status]?.background, color: STATUS_STYLE[trackingApp.status]?.color }}>{trackingApp.status}</span>
                    </div>
                    <div>
                      <span className="staffid-status-card-label">Application Type</span>
                      <span className="staffid-status-card-value">{trackingApp.type}</span>
                    </div>
                    <div>
                      <span className="staffid-status-card-label">Submitted</span>
                      <span className="staffid-status-card-value">{trackingApp.submittedDate}</span>
                    </div>
                    <div>
                      <span className="staffid-status-card-label">Last Updated</span>
                      <span className="staffid-status-card-value">{trackingApp.lastUpdated}</span>
                    </div>
                  </div>
                  {trackingApp.status === 'Returned for Correction' && (
                    <div className="staffid-status-card-alert">
                      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                      <span>Action Required: This application has been returned for correction.</span>
                    </div>
                  )}
                </div>

                <div className="staffid-tracker-grid">
                  <div className="staffid-tracker-panel">
                    <h4 className="staffid-tracker-panel-title">Processing Progress</h4>
                    <div className="staffid-progress-tracker">
                      {['Submitted', 'Received by HR', 'Verification', 'Approved', 'Printing', 'Quality Verification', 'Ready for Collection', 'Issued'].map((stage, i) => {
                        const currentIdx = ['Submitted', 'Received by HR', 'Verification', 'Returned for Correction', 'Resubmitted', 'Approved', 'Printing', 'Quality Verification', 'Ready for Collection', 'Issued'].indexOf(trackingApp.status);
                        const isActive = i <= currentIdx;
                        const isCurrent = trackingApp.status === stage;
                        return (
                          <div key={stage} className={`staffid-progress-step ${isActive ? 'active' : ''} ${isCurrent ? 'current' : ''}`}>
                            <div className="staffid-progress-dot" />
                            <span className="staffid-progress-label">{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="staffid-tracker-panel">
                    <h4 className="staffid-tracker-panel-title">HR Response</h4>
                    <div className="staffid-hr-response">
                      <div className="staffid-hr-response-item">
                        <p className="staffid-hr-response-text">{trackingApp.remarks || 'No remarks available.'}</p>
                        <div className="staffid-hr-response-meta">
                          <span>Officer: {trackingApp.hrResponse === 'Pending' ? '—' : trackingApp.returnedBy || 'HR Office'}</span>
                          <span>Date: {trackingApp.lastUpdated}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {trackingApp.status === 'Returned for Correction' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
                    <button className="btn btn-primary" onClick={() => openCorrection(trackingApp)}>
                      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: 8, verticalAlign: 'middle' }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      Edit / Correct Application
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {selectedApp && (
          <Modal isOpen={!!selectedApp} onClose={() => setSelectedApp(null)} title={`Application Details - ${selectedApp.id}`}>
            <div className="staffid-modal-tabs">
              {[{ key: 'info', label: 'Application Info' }, { key: 'attachments', label: 'Attachments' }, { key: 'preview', label: 'ID Preview' }, { key: 'timeline', label: 'Timeline' }].map(t => (
                <button key={t.key} className={`staffid-modal-tab ${modalTab === t.key ? 'active' : ''}`} onClick={() => setModalTab(t.key)}>{t.label}</button>
              ))}
            </div>

            {modalTab === 'info' && (
              <>
                <div className="leave-detail-status-bar">
                  <span className="leave-detail-status-label">Status</span>
                  <span className="status-pill" style={{ background: STATUS_STYLE[selectedApp.status]?.background, color: STATUS_STYLE[selectedApp.status]?.color }}>{selectedApp.status}</span>
                </div>
                <div className="leave-detail-section">
                  <h5 className="leave-detail-section-title">Application Information</h5>
                  <div className="leave-detail-grid">
                    <div className="leave-detail-item"><span className="leave-detail-label">Application No</span><span className="leave-detail-value">{selectedApp.id}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Application Type</span><span className="leave-detail-value">{selectedApp.type}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Reason</span><span className="leave-detail-value">{selectedApp.reason}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Submitted Date</span><span className="leave-detail-value">{selectedApp.submittedDate}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Last Updated</span><span className="leave-detail-value">{selectedApp.lastUpdated}</span></div>
                    <div className="leave-detail-item"><span className="leave-detail-label">Applicant</span><span className="leave-detail-value">{ID_CARD.name}</span></div>
                  </div>
                </div>
              </>
            )}

            {modalTab === 'attachments' && (
              <div className="leave-detail-section">
                <h5 className="leave-detail-section-title">Uploaded Attachments</h5>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {Object.entries(REASON_ATTACHMENTS[selectedApp.reason] || []).map(([idx, att]) => (
                    <div key={idx} className="attachment-row">
                      <div className="attachment-icon"><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div>
                      <div className="attachment-info"><p className="attachment-name">{att.name}</p><p className="attachment-hint">{att.required ? 'Required document' : 'Optional document'}</p></div>
                      <div className="attachment-actions"><button className="btn btn-sm btn-primary">View</button></div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalTab === 'preview' && <div className="id-card-preview-wrap" style={{ padding: 0 }}>{renderIdCard()}</div>}

            {modalTab === 'timeline' && (
              <div className="staffid-timeline" style={{ marginTop: 0 }}>
                {TIMELINE.map(t => (
                  <div key={t.stage} className="staffid-timeline-item">
                    <div className={`staffid-timeline-dot ${t.status === 'Completed' ? 'completed' : t.status === 'Current' ? 'current' : ''}`} />
                    <div className="staffid-timeline-content">
                      <p className="staffid-timeline-title">{t.stage}</p>
                      <p className="staffid-timeline-meta">{t.date} &middot; {t.time} &middot; {t.officer}{t.comment ? ` &middot; ${t.comment}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Modal>
        )}
      </main>
    </div>
  );
}

export default StaffIdPage;
