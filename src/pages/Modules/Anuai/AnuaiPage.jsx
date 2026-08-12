import React, { useEffect, useMemo, useState, useCallback } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import DataTable from '../../../components/common/DataTable/DataTable';
import Modal from '../../../components/common/Modal/Modal';
import { useAuth } from '../../../context/AuthContext';
import {
  withApiNotification,
  getMyRequests,
  getRequest,
  createRequest,
  addFollowUp,
  cancelRequest,
} from '../../../services/anuaiApi';
import './AnuaiPage.css';

const CATEGORIES = [
  'Workplace Health and Safety',
  'Gender Equality',
  'Environmental Conservation',
  'Sports and Culture',
  'Youth Support',
  'Women Support',
  'Older Persons Support',
  'People with Disabilities Support',
  'Other',
];

const CONTACT_METHODS = ['Phone', 'Email', 'Portal Response'];

const STATUS_STYLES = {
  Submitted: { background: '#EAF4FF', color: '#2F80ED' },
  'Under Review': { background: '#FFFBEB', color: '#D97706' },
  'In Progress': { background: '#E0F2FE', color: '#0284C7' },
  Resolved: { background: '#ECFDF5', color: '#059669' },
  Closed: { background: '#F3F4F6', color: '#6B7280' },
  Cancelled: { background: '#FEF2F2', color: '#DC2626' },
};

const DEMO_EMPLOYEE_ID = 'EMP-2026-00125';

// ── Icons ──
const IconUsers = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
);

const IconHeart = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
);

const IconShield = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
);

const IconBook = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
);

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
);

const IconScale = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2"/></svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
);

const IconRun = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M13 4v6h6"/><path d="M4 20h5.5l5-9.5L17 15h5"/><path d="M4 14l3 3"/></svg>
);

const IconStar = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

const IconListCheck = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
);

const IconFile = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
);

const IconEye = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const IconSend = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
);

const IconAlert = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
);

const IconDownload = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const IconCancel = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
);

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

async function downloadAttachment(a) {
  try {
    let blobUrl = a.url;
    if (a.file) {
      blobUrl = URL.createObjectURL(a.file);
    } else if (a.url && !a.url.startsWith('blob:')) {
      const res = await fetch(a.url);
      const blob = await res.blob();
      blobUrl = URL.createObjectURL(blob);
    }
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = a.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (blobUrl !== a.url) setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  } catch {
    if (a.url) window.open(a.url, '_blank');
  }
}

function StatusPill({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Submitted;
  return (
    <span className="status-pill" style={{ background: style.background, color: style.color }}>
      {status}
    </span>
  );
}

function SummaryCard({ label, value, color, icon }) {
  return (
    <div className="anuai-summary-card" style={{ borderLeftColor: color }}>
      <div className="anuai-summary-icon" style={{ background: `${color}15`, color }}>{icon}</div>
      <div className="anuai-summary-info">
        <span className="anuai-summary-value">{value}</span>
        <span className="anuai-summary-label">{label}</span>
      </div>
    </div>
  );
}

function RequestModal({ isOpen, onClose, type, onSubmit }) {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [contactMethod, setContactMethod] = useState(CONTACT_METHODS[0]);
  const [isConfidential, setIsConfidential] = useState(false);
  const [location, setLocation] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [additionalRemarks, setAdditionalRemarks] = useState('');
  const [attachment, setAttachment] = useState(null);
  const [errors, setErrors] = useState({});

  const reset = useCallback(() => {
    setCategory(CATEGORIES[0]);
    setSubject('');
    setDescription('');
    setContactMethod(CONTACT_METHODS[0]);
    setIsConfidential(false);
    setLocation('');
    setIncidentDate('');
    setAdditionalRemarks('');
    setAttachment(null);
    setErrors({});
  }, []);

  useEffect(() => {
    if (isOpen) reset();
  }, [isOpen, reset]);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setAttachment(f);
  };

  const validate = () => {
    const next = {};
    if (!subject.trim()) next.subject = 'Subject is required';
    if (!description.trim()) next.description = 'Description is required';
    if (type === 'concern' && !incidentDate) next.incidentDate = 'Date of incident is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const attachments = attachment ? [{ name: attachment.name, url: URL.createObjectURL(attachment), file: attachment }] : [];
    const payload = {
      type,
      category,
      subject,
      description,
      contactMethod,
      isConfidential,
      attachments,
      location,
      incidentDate,
      additionalRemarks,
    };
    onSubmit(payload);
  };

  const title = type === 'concern' ? 'Report a Concern' : 'Request Anuai za Jamii Support';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <form className="anuai-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Issue Category</label>
          <select className="form-input form-select" value={category} onChange={e => setCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className={`form-group${errors.subject ? ' form-group--error' : ''}`}>
          <label className="form-label">Subject</label>
          <input className="form-input" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter a brief subject" />
          {errors.subject && <span className="reg-form-error">{errors.subject}</span>}
        </div>
        <div className={`form-group${errors.description ? ' form-group--error' : ''}`}>
          <label className="form-label">Description</label>
          <textarea className="form-input" rows={4} value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your concern or request" />
          {errors.description && <span className="reg-form-error">{errors.description}</span>}
        </div>
        {type === 'concern' && (
          <>
            <div className="leave-form-row anuai-form-row">
              <div className="form-group">
                <label className="form-label">Location / Workplace</label>
                <input className="form-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="Where did the incident occur?" />
              </div>
              <div className={`form-group${errors.incidentDate ? ' form-group--error' : ''}`}>
                <label className="form-label">Date of Incident</label>
                <input type="date" className="form-input" value={incidentDate} onChange={e => setIncidentDate(e.target.value)} />
                {errors.incidentDate && <span className="reg-form-error">{errors.incidentDate}</span>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Additional Remarks</label>
              <textarea className="form-input" rows={2} value={additionalRemarks} onChange={e => setAdditionalRemarks(e.target.value)} placeholder="Any other relevant information" />
            </div>
          </>
        )}
        <div className="leave-form-row anuai-form-row">
          <div className="form-group">
            <label className="form-label">Preferred Contact Method</label>
            <select className="form-input form-select" value={contactMethod} onChange={e => setContactMethod(e.target.value)}>
              {CONTACT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Supporting Document <span className="anuai-optional">(Optional)</span></label>
            <div className="anuai-file-input">
              <input type="file" onChange={handleFileChange} />
              <span className="anuai-file-name">{attachment ? attachment.name : 'No file selected'}</span>
            </div>
          </div>
        </div>
        <div className="form-group anuai-checkbox-group">
          <label className="anuai-checkbox">
            <input type="checkbox" checked={isConfidential} onChange={e => setIsConfidential(e.target.checked)} />
            <span>Confidential Request</span>
          </label>
          <p className="anuai-confidential-note">Confidentiality does not mean anonymity where identification is required for case handling.</p>
        </div>
        <div className="anuai-form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">{type === 'concern' ? 'Submit Concern' : 'Submit Request'}</button>
        </div>
      </form>
    </Modal>
  );
}

function DetailsModal({ request, onClose, onAddFollowUp }) {
  const [followUp, setFollowUp] = useState('');
  const [followUpFile, setFollowUpFile] = useState(null);
  const [showFollowUp, setShowFollowUp] = useState(false);

  if (!request) return null;

  return (
    <Modal isOpen={!!request} onClose={onClose} title={`Request Details - ${request.referenceNo}`} size="xl">
      <div className="anuai-detail">
        <div className="anuai-detail-grid">
          <div className="anuai-detail-item"><span className="anuai-detail-label">Reference Number</span><span className="anuai-detail-value id-badge">{request.referenceNo}</span></div>
          <div className="anuai-detail-item"><span className="anuai-detail-label">Category</span><span className="anuai-detail-value">{request.category}</span></div>
          <div className="anuai-detail-item"><span className="anuai-detail-label">Subject</span><span className="anuai-detail-value">{request.subject}</span></div>
          <div className="anuai-detail-item"><span className="anuai-detail-label">Submitted Date</span><span className="anuai-detail-value">{formatDate(request.submittedDate)}</span></div>
          <div className="anuai-detail-item"><span className="anuai-detail-label">Current Status</span><span className="anuai-detail-value"><StatusPill status={request.status} /></span></div>
          {request.contactMethod && (
            <div className="anuai-detail-item"><span className="anuai-detail-label">Preferred Contact</span><span className="anuai-detail-value">{request.contactMethod}</span></div>
          )}
        </div>

        <div className="anuai-detail-section">
          <h4 className="anuai-detail-section-title">Request Description</h4>
          <p className="anuai-detail-description">{request.description}</p>
        </div>

        {request.location && (
          <div className="anuai-detail-section">
            <h4 className="anuai-detail-section-title">Location / Workplace</h4>
            <p className="anuai-detail-description">{request.location}</p>
          </div>
        )}

        {request.incidentDate && (
          <div className="anuai-detail-section">
            <h4 className="anuai-detail-section-title">Date of Incident</h4>
            <p className="anuai-detail-description">{formatDate(request.incidentDate)}</p>
          </div>
        )}

        {request.additionalRemarks && (
          <div className="anuai-detail-section">
            <h4 className="anuai-detail-section-title">Additional Remarks</h4>
            <p className="anuai-detail-description">{request.additionalRemarks}</p>
          </div>
        )}

        {request.attachments && request.attachments.length > 0 && (
          <div className="anuai-detail-section">
            <h4 className="anuai-detail-section-title">Attachments</h4>
            <div className="anuai-attachments">
              {request.attachments.map((a, i) => (
                <div key={i} className="anuai-attachment">
                  <IconFile />
                  <span className="anuai-attachment-name">{a.name}</span>
                  <div className="anuai-attachment-actions">
                    <button type="button" className="anuai-attachment-view" onClick={() => a.url && window.open(a.url, '_blank')} title="View"><IconEye /></button>
                    <button type="button" className="anuai-attachment-view" onClick={() => downloadAttachment(a)} title="Download"><IconDownload /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {request.managementResponse && (
          <div className="anuai-detail-section">
            <h4 className="anuai-detail-section-title">Management Response</h4>
            <div className="anuai-management-response">{request.managementResponse}</div>
          </div>
        )}

        <div className="anuai-detail-section">
          <h4 className="anuai-detail-section-title">Communication / Follow-up</h4>
          <div className="anuai-timeline">
            {request.timeline && request.timeline.map((t, i) => (
              <div key={i} className="anuai-timeline-item">
                <div className="anuai-timeline-dot" />
                <div className="anuai-timeline-content">
                  <span className="anuai-timeline-stage">{t.stage}</span>
                  <span className="anuai-timeline-meta">{t.date} &middot; {t.time} &middot; {t.actor}</span>
                  {t.comment && <p className="anuai-timeline-comment">{t.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!showFollowUp ? (
          <button className="btn btn-secondary" onClick={() => setShowFollowUp(true)}><IconSend /> Add Follow-up</button>
        ) : (
          <div className="anuai-follow-up">
            <div className="form-group">
              <label className="form-label">Enter your message or additional information</label>
              <textarea className="form-input" rows={3} value={followUp} onChange={e => setFollowUp(e.target.value)} placeholder="Type your follow-up message..." />
            </div>
            <div className="form-group">
              <label className="form-label">Optional Attachment</label>
              <div className="anuai-file-input">
                <input type="file" onChange={e => setFollowUpFile(e.target.files[0])} />
                <span className="anuai-file-name">{followUpFile ? followUpFile.name : 'No file selected'}</span>
              </div>
            </div>
            <div className="anuai-form-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowFollowUp(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={() => onAddFollowUp({ message: followUp, file: followUpFile })}>Send Follow-up</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function ReadMoreModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Social Diversity in Public Service and Institutions in Tanzania" size="lg">
      <div className="anuai-modal-content">
        <section className="anuai-modal-section">
          <h4 className="anuai-modal-section-title"><IconBook /> Concept and Meaning</h4>
          <ul className="anuai-modal-list">
            <li>Cross-cutting issues that promote the welfare of employees and society.</li>
            <li>Addressing the needs and interests of diverse groups within society and the workplace.</li>
            <li>Implementing these issues in accordance with relevant government policies and guidelines.</li>
          </ul>
        </section>

        <section className="anuai-modal-section">
          <h4 className="anuai-modal-section-title"><IconStar /> Key Areas</h4>
          <ul className="anuai-modal-list">
            <li>Workplace Health and Safety</li>
            <li>Gender Desk and Gender Equality</li>
            <li>Environmental Conservation</li>
            <li>Sports and Culture</li>
            <li>Services and Support for Special Groups, including youth, women, older persons, and people with disabilities.</li>
          </ul>
        </section>

        <section className="anuai-modal-section">
          <h4 className="anuai-modal-section-title"><IconListCheck /> Objectives</h4>
          <ul className="anuai-modal-list">
            <li>Improve workplace efficiency and productivity.</li>
            <li>Promote equality, fairness, and inclusion.</li>
            <li>Strengthen social cooperation and cohesion.</li>
            <li>Ensure that the needs of different groups are considered in public institutions.</li>
            <li>Promote a safe, inclusive, and supportive working environment.</li>
          </ul>
        </section>

        <div className="anuai-form-actions anuai-modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </Modal>
  );
}

function AnuaiPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [showRequest, setShowRequest] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);

  const employeeId = user?.employeeId || user?.employeeNumber || DEMO_EMPLOYEE_ID;

  const loadRequests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await withApiNotification(
        getMyRequests(employeeId),
        { loading: 'Loading your requests...', success: 'Requests loaded.', error: 'Unable to load requests.' }
      );
      setRequests(data || []);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const handleCreate = async (payload) => {
    try {
      const created = await withApiNotification(
        createRequest({ ...payload, employeeId }),
        { loading: 'Submitting your request...', success: 'Anuai za Jamii request submitted successfully.', error: 'Unable to submit your request. Please try again.' }
      );
      setRequests(prev => [created, ...prev]);
      setShowRequest(false);
      setShowReport(false);
    } catch {
      // handled by notification
    }
  };

  const handleAddFollowUp = async ({ message, file }) => {
    if (!selected || !message.trim()) return;
    try {
      const attachments = file ? [{ name: file.name, url: URL.createObjectURL(file), file }] : [];
      await withApiNotification(
        addFollowUp(selected.id, { message, attachments }),
        { loading: 'Sending follow-up...', success: 'A response has been added to your Anuai za Jamii request.', error: 'Unable to add follow-up. Please try again.' }
      );
      const updated = await getRequest(selected.id);
      setSelected(updated);
      setRequests(prev => prev.map(r => (r.id === updated.id ? updated : r)));
    } catch {
      // handled by notification
    }
  };

  const isCancellable = (row) => !['Resolved', 'Closed', 'Cancelled'].includes(row.status);

  const buildRequestSummary = (row) => {
    return [
      'ANUAI ZA JAMII REQUEST SUMMARY',
      '================================',
      `Reference No : ${row.referenceNo}`,
      `Category     : ${row.category}`,
      `Type         : ${row.type === 'concern' ? 'Concern' : 'Support Request'}`,
      `Subject      : ${row.subject}`,
      `Status       : ${row.status}`,
      `Submitted    : ${formatDate(row.submittedDate)}`,
      `Contact      : ${row.contactMethod || 'N/A'}`,
      '',
      'DESCRIPTION',
      '-----------',
      row.description,
      '',
      row.location ? `Location / Workplace : ${row.location}` : '',
      row.incidentDate ? `Date of Incident     : ${formatDate(row.incidentDate)}` : '',
      row.additionalRemarks ? `Additional Remarks   : ${row.additionalRemarks}` : '',
      '',
      row.managementResponse ? `MANAGEMENT RESPONSE\n-------------------\n${row.managementResponse}\n` : '',
      'COMMUNICATION TIMELINE',
      '----------------------',
      ...(row.timeline || []).map(t => `${t.date} ${t.time} - ${t.stage} (${t.actor}): ${t.comment || ''}`),
    ].join('\n');
  };

  const handleDownload = (e, row) => {
    e.stopPropagation();
    const text = buildRequestSummary(row);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${row.referenceNo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCancel = async (e, row) => {
    e.stopPropagation();
    if (!isCancellable(row)) return;
    if (!window.confirm(`Are you sure you want to cancel request ${row.referenceNo}?`)) return;
    try {
      const updated = await withApiNotification(
        cancelRequest(row.id),
        { loading: 'Cancelling request...', success: 'Request cancelled successfully.', error: 'Unable to cancel request.' }
      );
      setRequests(prev => prev.map(r => (r.id === updated.id ? updated : r)));
      if (selected && selected.id === updated.id) setSelected(updated);
    } catch {
      // handled by notification
    }
  };

  const summary = useMemo(() => {
    return {
      total: requests.length,
      underReview: requests.filter(r => r.status === 'Under Review').length,
      inProgress: requests.filter(r => r.status === 'In Progress').length,
      resolved: requests.filter(r => r.status === 'Resolved' || r.status === 'Closed').length,
    };
  }, [requests]);

  const columns = [
    { key: 'referenceNo', header: 'Reference No.', render: row => <span className="id-badge">{row.referenceNo}</span> },
    { key: 'category', header: 'Category' },
    { key: 'subject', header: 'Subject' },
    { key: 'submittedDate', header: 'Submitted Date', render: row => formatDate(row.submittedDate) },
    { key: 'status', header: 'Status', render: row => <StatusPill status={row.status} /> },
  ];

  return (
    <div className="module-content">
      <main className="module-main anuai-page">
        <ModuleTitleBar
          title="Anuai za Jamii"
          subtitle="Social Diversity in Public Service and Institutions in Tanzania"
          color="#0B2E59"
        />

        <div className="anuai-summary-grid">
          <SummaryCard label="My Requests" value={summary.total} color="#0B2E59" icon={<IconListCheck />} />
          <SummaryCard label="Under Review" value={summary.underReview} color="#D97706" icon={<IconEye />} />
          <SummaryCard label="In Progress" value={summary.inProgress} color="#0284C7" icon={<IconBriefcase />} />
          <SummaryCard label="Resolved" value={summary.resolved} color="#059669" icon={<IconHeart />} />
        </div>

        <section className="anuai-section">
          <div className="anuai-overview-card">
            <div className="anuai-overview-icon"><IconUsers /></div>
            <div className="anuai-overview-body">
              <h3 className="anuai-overview-title">Social Diversity in Public Service and Institutions in Tanzania</h3>
              <p className="anuai-overview-text">
                Social diversity in public service and institutions in Tanzania refers to the principles and cross-cutting issues that concern the well-being of employees and society. These include workplace health, gender equality, environmental protection, sports, and the inclusion and welfare of special groups such as youth, women, older persons, and people with disabilities.{" "}
                <button className="anuai-read-more-link" onClick={() => setShowReadMore(true)}>Read more</button>
              </p>
            </div>
          </div>
        </section>

        <section className="anuai-section anuai-support-section">
          <div className="anuai-support-box">
            <h3 className="anuai-support-title">Need Support?</h3>
            <p className="anuai-support-text">
              If you have a concern related to Anuai za Jamii, you can communicate with management and request assistance or guidance.
            </p>
            <div className="anuai-support-actions">
              <button className="btn btn-primary" onClick={() => setShowRequest(true)}><IconHeart /> Request Support</button>
              <button className="btn btn-secondary" onClick={() => setShowReport(true)}><IconAlert /> Report a Concern</button>
            </div>
          </div>
        </section>

        <section className="anuai-section">
          <DataTable
            columns={columns}
            data={requests}
            title="My Requests"
            searchPlaceholder="Search by reference, category, subject or status..."
            loading={loading}
            emptyState={{ title: 'No requests found', description: 'You have not submitted any Anuai za Jamii requests yet.' }}
            actionColumn={row => (
              <div className="dt-actions">
                <button className="action-btn action-btn--view" onClick={() => setSelected(row)} title="View Details"><IconEye /></button>
                <button className="action-btn action-btn--download" onClick={e => handleDownload(e, row)} title="Download Summary"><IconDownload /></button>
                {isCancellable(row) && (
                  <button className="action-btn action-btn--delete" onClick={e => handleCancel(e, row)} title="Cancel Request"><IconCancel /></button>
                )}
              </div>
            )}
          />
        </section>

        <RequestModal isOpen={showRequest} onClose={() => setShowRequest(false)} type="support" onSubmit={handleCreate} />
        <RequestModal isOpen={showReport} onClose={() => setShowReport(false)} type="concern" onSubmit={handleCreate} />
        <DetailsModal request={selected} onClose={() => setSelected(null)} onAddFollowUp={handleAddFollowUp} />
        <ReadMoreModal isOpen={showReadMore} onClose={() => setShowReadMore(false)} />
      </main>
    </div>
  );
}

export default AnuaiPage;
