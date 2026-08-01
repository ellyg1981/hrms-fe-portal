import React, { useState } from 'react';
import Modal from '../../../components/common/Modal/Modal';
import html2pdf from 'html2pdf.js';
import { openDocument } from '../../../utils/preview';
import './AnnouncementsPage.css';

const CATEGORY_STYLES = {
  'HR Announcement': { color: '#0B2E59', bg: '#EAF4FF', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
  'Training': { color: '#2563EB', bg: '#EFF6FF', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg> },
  'Personal': { color: '#059669', bg: '#ECFDF5', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  'General': { color: '#7C3AED', bg: '#F5F3FF', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> },
  'Other': { color: '#6B7280', bg: '#F3F4F6', icon: <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> },
};

const PRIORITY_STYLES = {
  'High': { color: '#DC2626', bg: '#FEF2F2', dot: '#DC2626' },
  'Medium': { color: '#D97706', bg: '#FFFBEB', dot: '#D97706' },
  'Low': { color: '#059669', bg: '#ECFDF5', dot: '#059669' },
};

const NOTIFICATIONS = [
  {
    id: 1,
    title: 'New Leave Policy Effective July 2026',
    category: 'HR Announcement',
    priority: 'High',
    targetAudience: 'All Employees',
    publishDate: '17 Jul 2026',
    expiryDate: '31 Jul 2026',
    content: 'The Human Resources Department has updated the leave policy effective 1 July 2026. All staff are required to review the new guidelines and acknowledge receipt through the staff portal. Key changes include increased annual leave days for officers with over 10 years of service and a streamlined application process. Please ensure you read the full policy document and submit your acknowledgment by 31 July 2026.',
    attachments: [
      { name: 'Leave_Policy_2026.pdf', size: '1.2 MB', type: 'pdf' },
      { name: 'Leave_Policy_Summary.pdf', size: '340 KB', type: 'pdf' },
    ],
  },
  {
    id: 2,
    title: 'End of Year Staff Party Invitation',
    category: 'HR Announcement',
    priority: 'Medium',
    targetAudience: 'All Employees',
    publishDate: '14 Jul 2026',
    expiryDate: '30 Nov 2026',
    content: 'The annual end-of-year staff party has been scheduled for 15 December 2026 at the Golden Tulip Hotel, Dodoma. All staff and their spouses are invited. RSVP through your department head by 30 November 2026. Transport arrangements will be communicated in due course. Dress code: Smart casual.',
    attachments: [
      { name: 'Staff_Party_Invitation_2026.pdf', size: '450 KB', type: 'pdf' },
    ],
  },
  {
    id: 3,
    title: 'Cybersecurity Training Scheduled for 15 Jul 2026',
    category: 'Training',
    priority: 'High',
    targetAudience: 'All Employees',
    publishDate: '17 Jul 2026',
    expiryDate: '15 Jul 2026',
    content: 'Mandatory cybersecurity awareness training is scheduled for 15 July 2026 at the ICT Training Room, Headquarters. All staff must attend. The session will cover phishing detection, password security, and data protection protocols. Certificates will be issued upon completion. Please arrive by 08:30 for registration.',
    attachments: [
      { name: 'Training_Registration_Form.pdf', size: '120 KB', type: 'pdf' },
      { name: 'Cybersecurity_Training_Agenda.pdf', size: '280 KB', type: 'pdf' },
    ],
  },
  {
    id: 4,
    title: 'Leadership Workshop Registration Deadline Extended',
    category: 'Training',
    priority: 'Medium',
    targetAudience: 'Department',
    publishDate: '15 Jul 2026',
    expiryDate: '10 Jul 2026',
    content: 'The registration deadline for the Senior Leadership Development Workshop has been extended to 10 July 2026. This workshop is open to Senior Officers and above. It will take place at the Arusha International Conference Centre from 22-26 July 2026. Accommodation and meals will be provided. Submit your application through your Head of Department.',
    attachments: [
      { name: 'Leadership_Workshop_Letter.pdf', size: '560 KB', type: 'pdf' },
    ],
  },
  {
    id: 5,
    title: 'Your Annual Leave Request is Pending Approval',
    category: 'Personal',
    priority: 'Medium',
    targetAudience: 'Specific Employees',
    publishDate: '16 Jul 2026',
    expiryDate: '26 Jul 2026',
    content: 'Your annual leave application for 15-26 July 2026 is currently under review by your Head of Unit. You will be notified once a decision is made. Please ensure your handover notes are prepared in advance to avoid delays. Contact the HR office if you have any questions regarding your application status.',
    attachments: [
      { name: 'Leave_Application_Form.pdf', size: '85 KB', type: 'pdf' },
    ],
  },
  {
    id: 6,
    title: 'Salary Slip for June 2026 is Available',
    category: 'Personal',
    priority: 'Low',
    targetAudience: 'Specific Employees',
    publishDate: '15 Jul 2026',
    expiryDate: '15 Aug 2026',
    content: 'Your salary slip for June 2026 is now available for download. Please log in to the Salary module to view and download your payslip. If you notice any discrepancies, contact the Finance Department within 7 working days. Ensure you download and save a copy for your records.',
    attachments: [
      { name: 'Salary_Slip_June_2026.pdf', size: '210 KB', type: 'pdf' },
    ],
  },
  {
    id: 7,
    title: 'System Maintenance Notification',
    category: 'General',
    priority: 'Low',
    targetAudience: 'All Employees',
    publishDate: '12 Jul 2026',
    expiryDate: '14 Jul 2026',
    content: 'The HRMS Staff Portal will undergo scheduled maintenance on 14 July 2026 from 22:00 to 02:00. During this period, the system may be temporarily unavailable. Please save any ongoing work and log out before the maintenance window begins. If you experience any issues after the maintenance, please contact the ICT support desk.',
    attachments: [],
  },
  {
    id: 8,
    title: 'Staff Welfare Committee Meeting',
    category: 'Other',
    priority: 'Low',
    targetAudience: 'Region',
    publishDate: '10 Jul 2026',
    expiryDate: '25 Jul 2026',
    content: 'The Staff Welfare Committee will hold its quarterly meeting on 25 July 2026 at the Conference Hall, Headquarters. All regional representatives are required to attend. Agenda items include welfare fund updates, staff health insurance review, and proposed recreational activities for the second half of 2026.',
    attachments: [
      { name: 'Welfare_Committee_Agenda.pdf', size: '180 KB', type: 'pdf' },
    ],
  },
  {
    id: 9,
    title: 'Annual Leave Application Submitted',
    category: 'Personal',
    priority: 'Medium',
    targetAudience: 'Specific Employees',
    publishDate: '15 Jun 2026',
    expiryDate: '26 Jul 2026',
    content: 'You submitted an Annual Leave application on 15 June 2026 for 15-26 July 2026. The application is currently pending approval from your Head of Unit and the Human Resources Department. You will receive a notification once the application has been reviewed. Please ensure your handover notes are submitted before your leave begins.',
    attachments: [
      { name: 'Leave_Application_Copy.pdf', size: '85 KB', type: 'pdf' },
    ],
  },
];

const CATEGORIES = ['HR Announcement', 'Training', 'Personal', 'General', 'Other'];

function AnnouncementsPage() {
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 3;

  const filteredNotifs = activeCategory === 'all'
    ? NOTIFICATIONS
    : NOTIFICATIONS.filter(n => n.category === activeCategory);

  const totalPages = Math.max(1, Math.ceil(filteredNotifs.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const startEntry = filteredNotifs.length === 0 ? 0 : (safePage - 1) * perPage + 1;
  const endEntry = Math.min(safePage * perPage, filteredNotifs.length);
  const paginatedNotifs = filteredNotifs.slice((safePage - 1) * perPage, safePage * perPage);

  const pageNumbers = [];
  const maxVisible = 5;
  let pageStart = Math.max(1, safePage - Math.floor(maxVisible / 2));
  let pageEnd = Math.min(totalPages, pageStart + maxVisible - 1);
  if (pageEnd - pageStart + 1 < maxVisible) pageStart = Math.max(1, pageEnd - maxVisible + 1);
  for (let i = pageStart; i <= pageEnd; i++) pageNumbers.push(i);

  const handleCategoryChange = (cat) => {
    setActiveCategory(activeCategory === cat ? 'all' : cat);
    setCurrentPage(1);
  };

  const categoryCounts = CATEGORIES.reduce((acc, cat) => {
    acc[cat] = NOTIFICATIONS.filter(n => n.category === cat).length;
    return acc;
  }, {});

  const openNotifModal = (notif) => {
    setSelectedNotif(notif);
  };

  const closeNotifModal = () => {
    setSelectedNotif(null);
  };

  const renderAttachmentIcon = (type) => {
    if (type === 'pdf') {
      return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    }
    return <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
  };

  const catStyle = (cat) => CATEGORY_STYLES[cat] || CATEGORY_STYLES['Other'];
  const prioStyle = (p) => PRIORITY_STYLES[p] || PRIORITY_STYLES['Low'];

  const openAttachmentInNewTab = (file, notif) => {
    const html = `
<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${file.name}</title>
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
  .doc-body { font-size: 10pt; line-height: 1.6; margin: 0 0 12px; }
  .doc-meta-row { display: flex; gap: 24px; margin-bottom: 12px; font-size: 10pt; }
  .doc-meta-item { display: flex; align-items: baseline; }
  .doc-meta-label { font-weight: 500; color: #4b5563; white-space: nowrap; margin-right: 6px; }
  .doc-meta-value { font-weight: 600; border-bottom: 1px dotted #000; flex: 1; min-height: 1em; }
  .dotted-area { min-height: 40px; border-bottom: 1px dotted #000; margin-bottom: 4px; }
  .signature { text-align: right; font-style: italic; margin-bottom: 8px; font-size: 9pt; }
  .footer { margin-top: 16px; font-size: 9pt; color: #555; text-align: center; }
  .attachment-info { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px 14px; margin-top: 12px; font-size: 9pt; color: #374151; }
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
    <div class="doc-title">${notif.title}</div>
    <div class="doc-subtitle">Document: ${file.name} &middot; Size: ${file.size}</div>
    <div class="section-title">Announcement Details</div>
    <div class="doc-body">${notif.content}</div>
    <div class="section-title">Official Record</div>
    <div class="doc-meta-row">
      <div class="doc-meta-item"><span class="doc-meta-label">Category:</span><span class="doc-meta-value">${notif.category}</span></div>
      <div class="doc-meta-item"><span class="doc-meta-label">Priority:</span><span class="doc-meta-value">${notif.priority}</span></div>
    </div>
    <div class="doc-meta-row">
      <div class="doc-meta-item"><span class="doc-meta-label">Target Audience:</span><span class="doc-meta-value">${notif.targetAudience}</span></div>
      <div class="doc-meta-item"><span class="doc-meta-label">Published:</span><span class="doc-meta-value">${notif.publishDate}</span></div>
    </div>
    <div class="dotted-area"></div>
    <div class="signature">Authorized Signature &middot; Date</div>
    <div class="attachment-info">Attachment: ${file.name} (${file.size})</div>
    <div class="footer">Ref: ${notif.title} &middot; Generated by HRMS Staff Portal</div>
  </div>
</body></html>
    `;
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '0';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    container.innerHTML = html;
    document.body.appendChild(container);
    const pageEl = container.querySelector('.page');
    const opt = {
      margin: 0,
      filename: file.name,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' }
    };
    html2pdf().set(opt).from(pageEl).outputPdf('blob').then((blob) => {
      document.body.removeChild(container);
      const url = URL.createObjectURL(blob);
      openDocument(url, file.name);
      setTimeout(() => URL.revokeObjectURL(url), 30000);
    });
  };

  return (
    <div className="notifications-page">
      {/* Category Filter Cards */}
      <div className="notifications-page-stats">
        <button
          className={`notif-stat-card ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => handleCategoryChange('all')}
        >
          <div className="notif-stat-icon" style={{ background: '#F3F4F6', color: '#0B2E59' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
          </div>
          <div className="notif-stat-info">
            <span className="notif-stat-count">{NOTIFICATIONS.length}</span>
            <span className="notif-stat-label">All Announcements</span>
          </div>
        </button>
        {CATEGORIES.map(cat => {
          const cs = catStyle(cat);
          return (
            <button
              key={cat}
              className={`notif-stat-card ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              <div className="notif-stat-icon" style={{ background: cs.bg, color: cs.color }}>
                {cs.icon}
              </div>
              <div className="notif-stat-info">
                <span className="notif-stat-count">{categoryCounts[cat]}</span>
                <span className="notif-stat-label">{cat}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Notification Cards List */}
      <div className="notif-card-list">
        {paginatedNotifs.map(notif => {
          const cs = catStyle(notif.category);
          const ps = prioStyle(notif.priority);
          const hasAttachments = notif.attachments && notif.attachments.length > 0;
          return (
            <div key={notif.id} className="notif-card" onClick={() => openNotifModal(notif)}>
              <div className="notif-card-header">
                <div className="notif-card-title-row">
                  <div className="notif-card-icon" style={{ background: cs.bg, color: cs.color }}>
                    {cs.icon}
                  </div>
                  <h4 className="notif-card-title">{notif.title}</h4>
                </div>
                <div className="notif-card-badges">
                  <span className="notif-badge notif-badge-category" style={{ background: cs.bg, color: cs.color }}>
                    {cs.icon}
                    {notif.category}
                  </span>
                  <span className="notif-badge notif-badge-priority" style={{ background: ps.bg, color: ps.color }}>
                    <span className="notif-priority-dot" style={{ background: ps.dot }} />
                    {notif.priority}
                  </span>
                </div>
              </div>
              <div className="notif-card-body">
                <div className="notif-card-meta-row">
                  <div className="notif-card-meta-item">
                    <span className="notif-card-meta-label">Target Audience</span>
                    <span className="notif-card-meta-value">{notif.targetAudience}</span>
                  </div>
                  <div className="notif-card-meta-item">
                    <span className="notif-card-meta-label">Published</span>
                    <span className="notif-card-meta-value">{notif.publishDate}</span>
                  </div>
                  <div className="notif-card-meta-item">
                    <span className="notif-card-meta-label">Expires</span>
                    <span className="notif-card-meta-value">{notif.expiryDate}</span>
                  </div>
                </div>
                <div className="notif-card-footer">
                  <div className="notif-card-attachment-indicator">
                    {hasAttachments ? (
                      <>
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                        <span>{notif.attachments.length} Attachment{notif.attachments.length > 1 ? 's' : ''}</span>
                      </>
                    ) : (
                      <span className="notif-card-no-attachment">No attachments</span>
                    )}
                  </div>
                  <button className="notif-card-view-btn" onClick={(e) => { e.stopPropagation(); openNotifModal(notif); }}>
                    View Details
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {filteredNotifs.length > 0 && (
        <div className="notif-pagination">
          <div className="notif-pagination-left">
            <span className="notif-pagination-info">Showing <b>{startEntry}</b> to <b>{endEntry}</b> of <b>{filteredNotifs.length}</b> entries</span>
          </div>
          <div className="notif-pagination-right">
            <button className="notif-page-btn notif-page-btn--icon" disabled={safePage === 1} onClick={() => setCurrentPage(1)} title="First">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
            </button>
            <button className="notif-page-btn notif-page-btn--icon" disabled={safePage === 1} onClick={() => setCurrentPage(safePage - 1)} title="Previous">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <div className="notif-page-numbers">
              {pageNumbers.map(p => (
                <button key={p} className={`notif-page-num ${p === safePage ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
              ))}
            </div>
            <button className="notif-page-btn notif-page-btn--icon" disabled={safePage === totalPages} onClick={() => setCurrentPage(safePage + 1)} title="Next">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <button className="notif-page-btn notif-page-btn--icon" disabled={safePage === totalPages} onClick={() => setCurrentPage(totalPages)} title="Last">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
            </button>
          </div>
        </div>
      )}

      {/* Notification Detail Modal */}
      {selectedNotif && (
        <Modal
          isOpen={!!selectedNotif}
          onClose={closeNotifModal}
          title="Announcement Details"
          size="lg"
        >
          <div className="notif-detail-modal">
            {/* Header Section */}
            <div className="notif-detail-header">
              <h3 className="notif-detail-title">{selectedNotif.title}</h3>
              <div className="notif-detail-badges">
                {(() => {
                  const cs = catStyle(selectedNotif.category);
                  return (
                    <span className="notif-badge notif-badge-category" style={{ background: cs.bg, color: cs.color }}>
                      {cs.icon}
                      {selectedNotif.category}
                    </span>
                  );
                })()}
                {(() => {
                  const ps = prioStyle(selectedNotif.priority);
                  return (
                    <span className="notif-badge notif-badge-priority" style={{ background: ps.bg, color: ps.color }}>
                      <span className="notif-priority-dot" style={{ background: ps.dot }} />
                      {selectedNotif.priority}
                    </span>
                  );
                })()}
              </div>
            </div>

            {/* Info Table Section */}
            <div className="notif-detail-info">
              <div className="notif-detail-info-grid">
                <div className="notif-detail-info-item">
                  <span className="notif-detail-info-label">Announcement Title</span>
                  <span className="notif-detail-info-value">{selectedNotif.title}</span>
                </div>
                <div className="notif-detail-info-item">
                  <span className="notif-detail-info-label">Category</span>
                  <span className="notif-detail-info-value">{selectedNotif.category}</span>
                </div>
                <div className="notif-detail-info-item">
                  <span className="notif-detail-info-label">Priority</span>
                  <span className="notif-detail-info-value">{selectedNotif.priority}</span>
                </div>
                <div className="notif-detail-info-item">
                  <span className="notif-detail-info-label">Target Audience</span>
                  <span className="notif-detail-info-value">{selectedNotif.targetAudience}</span>
                </div>
                <div className="notif-detail-info-item">
                  <span className="notif-detail-info-label">Publish Date</span>
                  <span className="notif-detail-info-value">{selectedNotif.publishDate}</span>
                </div>
                <div className="notif-detail-info-item">
                  <span className="notif-detail-info-label">Expiry Date</span>
                  <span className="notif-detail-info-value">{selectedNotif.expiryDate}</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="notif-detail-content-section">
              <h5 className="notif-detail-section-title">Announcement Content</h5>
              <p className="notif-detail-content-body">{selectedNotif.content}</p>
            </div>

            {/* Attachment Section */}
            {selectedNotif.attachments && selectedNotif.attachments.length > 0 && (
              <div className="notif-detail-attachments-section">
                <h5 className="notif-detail-section-title">Supporting Attachments</h5>
                <div className="notif-detail-attachments-list">
                  {selectedNotif.attachments.map((file, idx) => (
                    <div key={idx} className="notif-detail-attachment">
                      <div className="notif-detail-attachment-icon">
                        {renderAttachmentIcon(file.type)}
                      </div>
                      <div className="notif-detail-attachment-info">
                        <span className="notif-detail-attachment-name">{file.name}</span>
                        <span className="notif-detail-attachment-size">{file.size}</span>
                      </div>
                      <button className="notif-detail-attachment-btn" onClick={() => openAttachmentInNewTab(file, selectedNotif)}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6"/><path d="M10 14L21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                        View Document
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

export default AnnouncementsPage;
