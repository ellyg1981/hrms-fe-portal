import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../components/common/Modal/Modal';
import './DashboardPage.css';

const NOTIFICATION_SECTIONS = [
  {
    id: 'hr',
    title: 'HR Notifications',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
    items: [
      { text: 'New leave policy effective July 2026', time: '2 hours ago', type: 'circular', content: 'The Human Resources Department has updated the leave policy effective 1 July 2026. All staff are required to review the new guidelines and acknowledge receipt through the staff portal. Key changes include increased annual leave days for officers with over 10 years of service and a streamlined application process.', attachments: [{ name: 'Leave_Policy_2026.pdf', size: '1.2 MB' }, { name: 'Leave_Policy_Summary.pdf', size: '340 KB' }] },
      { text: 'Annual performance review period opened', time: '1 day ago', type: 'instruction', content: 'The annual performance review period is now open from 1 July to 15 August 2026. All staff must complete their self-assessment forms and schedule review meetings with their supervisors. Late submissions may affect your annual increment eligibility.', attachments: [{ name: 'Performance_Review_Guidelines_2026.pdf', size: '890 KB' }] },
      { text: 'End of year staff party on 15th December', time: '3 days ago', type: 'memo', content: 'The annual end-of-year staff party has been scheduled for 15 December 2026 at the Golden Tulip Hotel, Dodoma. All staff and their spouses are invited. RSVP through your department head by 30 November 2026. Transport arrangements will be communicated in due course.', attachments: [{ name: 'Staff_Party_Invitation_2026.pdf', size: '450 KB' }] },
    ],
  },
  {
    id: 'training',
    title: 'Training Notifications',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>,
    items: [
      { text: 'Cybersecurity training scheduled for 15 Jul 2026', time: '5 hours ago', type: 'form', content: 'Mandatory cybersecurity awareness training is scheduled for 15 July 2026 at the ICT Training Room, Headquarters. All staff must attend. The session will cover phishing detection, password security, and data protection protocols. Certificates will be issued upon completion.', attachments: [{ name: 'Training_Registration_Form.pdf', size: '120 KB' }, { name: 'Cybersecurity_Training_Agenda.pdf', size: '280 KB' }] },
      { text: 'Leadership workshop registration deadline extended', time: '2 days ago', type: 'letter', content: 'The registration deadline for the Senior Leadership Development Workshop has been extended to 10 July 2026. This workshop is open to Senior Officers and above. It will take place at the Arusha International Conference Centre from 22-26 July 2026.', attachments: [{ name: 'Leadership_Workshop_Letter.pdf', size: '560 KB' }] },
    ],
  },
  {
    id: 'personal',
    title: 'Personal Notifications',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    items: [
      { text: 'Your annual leave request is pending approval', time: '1 day ago', type: 'form', content: 'Your annual leave application for 15-26 July 2026 is currently under review by your Head of Unit. You will be notified once a decision is made. Please ensure your handover notes are prepared in advance to avoid delays.', attachments: [{ name: 'Leave_Application_Form.pdf', size: '85 KB' }] },
      { text: 'Salary slip for June 2026 is available', time: '2 days ago', type: 'form', content: 'Your salary slip for June 2026 is now available for download. Please log in to the Salary module to view and download your payslip. If you notice any discrepancies, contact the Finance Department within 7 working days.', attachments: [{ name: 'Salary_Slip_June_2026.pdf', size: '210 KB' }] },
      { text: 'Pension contribution statement updated', time: '4 days ago', type: 'form', content: 'Your pension contribution statement for the first half of 2026 has been updated. You can now view your latest contributions and projected benefits in the Pension module. For any queries, contact the Pensions Unit.', attachments: [{ name: 'Pension_Statement_H1_2026.pdf', size: '340 KB' }] },
    ],
  },
  {
    id: 'activities',
    title: 'My Activities',
    icon: <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    items: [
      { text: 'Annual Leave application submitted', time: '15 Jun 2026', type: 'form', content: 'You submitted an Annual Leave application on 15 June 2026 for 15-26 July 2026. The application is currently pending approval from your Head of Unit and the Human Resources Department.', attachments: [{ name: 'Leave_Application_Copy.pdf', size: '85 KB' }] },
      { text: 'Sick Leave approved by Head of Unit', time: '16 Jun 2026', type: 'letter', content: 'Your Sick Leave application for 10-12 June 2026 was approved by the Head of Unit on 16 June 2026. Please ensure you submit your medical report to the HR office upon resumption of duty.', attachments: [{ name: 'Sick_Leave_Approval_Letter.pdf', size: '180 KB' }] },
      { text: 'Long Course application under review', time: '20 Feb 2026', type: 'form', content: 'Your application for the Long Course Training Programme at Mzumbe University has been received and is under review by the Training and Capacity Building Committee. A decision is expected by 30 July 2026.', attachments: [{ name: 'Long_Course_Application_Form.pdf', size: '150 KB' }, { name: 'Course_Prospectus_2026.pdf', size: '2.1 MB' }] },
      { text: 'Performance review completed', time: '30 Jun 2026', type: 'form', content: 'Your performance review for the 2025/2026 evaluation cycle was completed on 30 June 2026. You received an overall rating of "Excellent". Your supervisor has provided feedback which is now available in the Performance module.', attachments: [{ name: 'Performance_Review_Form_2026.pdf', size: '420 KB' }, { name: 'Supervisor_Feedback.pdf', size: '310 KB' }] },
    ],
  },
];

const SERVICE_CARDS = [
  { label: 'Leave', desc: 'Apply for leave', path: '/modules/likizo', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>, color: '#0B2E59', bg: '#EAF4FF' },
  { label: 'Transfer', desc: 'Request transfer', path: '/modules/requests', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h3v3h-3z"/><path d="M8 18h3v3H8z"/><path d="M21 6l-9 9"/><path d="M15 6h6v6"/><path d="M9 18H3v-6"/></svg>, color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Training', desc: 'Courses & programs', path: '/modules/training', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z"/><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/></svg>, color: '#059669', bg: '#ECFDF5' },
  { label: 'Staff ID', desc: 'Manage ID card', path: '/modules/staff-id', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M7 21v-2a4 4 0 014-4h2a4 4 0 014 4v2"/></svg>, color: '#D97706', bg: '#FFFBEB' },
  { label: 'Pension', desc: 'View contributions', path: '/modules/salary', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: '#DC2626', bg: '#FEF2F2' },
  { label: 'Salary Slip', desc: 'Download payslips', path: '/modules/salary', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><path d="M1 10h22"/></svg>, color: '#0D9488', bg: '#F0FDFA' },
  { label: 'Loan', desc: 'Apply for loan', path: '/modules/requests', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, color: '#2563EB', bg: '#EFF6FF' },
  { label: 'Performance', desc: 'Reviews & forms', path: '/modules/performance', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, color: '#C026D3', bg: '#FAE8FF' },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [openSection, setOpenSection] = useState(null);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    if (!openSection) return;
    const handleClickOutside = (e) => {
      const cardEl = cardRefs.current[openSection];
      if (cardEl && !cardEl.contains(e.target)) {
        setOpenSection(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openSection]);

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  const openNotifModal = (item, sectionTitle) => {
    setOpenSection(null);
    setSelectedNotif({ ...item, sectionTitle });
  };

  const closeNotifModal = () => {
    setSelectedNotif(null);
  };

  return (
    <div className="dashboard-page">
      {/* Notification Accordion Cards */}
      <div className="notif-accordion-grid">
        {NOTIFICATION_SECTIONS.map((section) => (
          <div
            key={section.id}
            ref={(el) => { cardRefs.current[section.id] = el; }}
            className={`notif-accordion-card ${openSection === section.id ? 'open' : ''}`}
          >
            <button
              className="notif-accordion-header"
              onClick={() => toggleSection(section.id)}
              aria-expanded={openSection === section.id}
            >
              <div className="notif-accordion-icon">{section.icon}</div>
              <span className="notif-accordion-title">{section.title}</span>
              <span className="notif-accordion-count">{section.items.length}</span>
              <svg
                className="notif-accordion-chevron"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {openSection === section.id && (
              <div className="notif-accordion-body">
                {section.items.map((item, idx) => (
                  <button key={idx} className="notif-accordion-item" onClick={() => openNotifModal(item, section.title)}>
                    <span className="notif-accordion-text">{item.text}</span>
                    <span className="notif-accordion-time">{item.time}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Section Separator */}
      <div className="dashboard-separator" />

      {/* Notification Detail Modal */}
      {selectedNotif && (
        <Modal
          isOpen={!!selectedNotif}
          onClose={closeNotifModal}
          title={selectedNotif.sectionTitle}
        >
          <div className="notif-modal-content">
            <div className="notif-modal-meta">
              {selectedNotif.type && (
                <span className={`notif-modal-type notif-modal-type-${selectedNotif.type}`}>
                  {selectedNotif.type}
                </span>
              )}
              <span className="notif-modal-time">{selectedNotif.time}</span>
            </div>
            <h4 className="notif-modal-heading">{selectedNotif.text}</h4>
            <p className="notif-modal-body">{selectedNotif.content}</p>
            {selectedNotif.attachments && selectedNotif.attachments.length > 0 && (
              <div className="notif-modal-attachments">
                <h5 className="notif-modal-attachments-title">Attachments</h5>
                <div className="notif-modal-attachments-list">
                  {selectedNotif.attachments.map((file, idx) => (
                    <div key={idx} className="notif-modal-attachment">
                      <div className="notif-modal-attachment-icon">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      </div>
                      <div className="notif-modal-attachment-info">
                        <span className="notif-modal-attachment-name">{file.name}</span>
                        <span className="notif-modal-attachment-size">{file.size}</span>
                      </div>
                      <button className="notif-modal-attachment-btn" onClick={() => alert('Downloading ' + file.name)}>View</button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Service Cards */}
      <div className="service-cards-grid">
        {SERVICE_CARDS.map((svc, i) => (
          <button
            key={i}
            className="service-card"
            onClick={() => navigate(svc.path)}
          >
            <div className="service-card-icon" style={{ background: svc.bg, color: svc.color }}>
              {svc.icon}
            </div>
            <div className="service-card-text">
              <span className="service-card-label">{svc.label}</span>
              <span className="service-card-desc">{svc.desc}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
