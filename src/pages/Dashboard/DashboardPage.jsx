import React from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const SERVICE_CARDS = [
  { label: 'My Profile', desc: 'Manage profile', path: '/modules/profile', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>, color: '#0B2E59', bg: '#EAF4FF' },
  { label: 'Staff ID', desc: 'Manage ID card', path: '/modules/staff-id', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M7 21v-2a4 4 0 014-4h2a4 4 0 014 4v2" /></svg>, color: '#D97706', bg: '#FFFBEB' },
  { label: 'Transfer', desc: 'Request transfer', path: '/modules/transfer', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 3h3v3h-3z" /><path d="M8 18h3v3H8z" /><path d="M21 6l-9 9" /><path d="M15 6h6v6" /><path d="M9 18H3v-6" /></svg>, color: '#7C3AED', bg: '#F5F3FF' },
  { label: 'Leave', desc: 'Apply for leave', path: '/modules/likizo', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>, color: '#059669', bg: '#ECFDF5' },
  { label: 'Training', desc: 'Courses & programs', path: '/modules/training', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 14l9-5-9-5-9 5 9 5z" /><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>, color: '#2563EB', bg: '#EFF6FF' },
  { label: 'Notifications', desc: 'View notifications', path: '/modules/notifications', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>, color: '#E11D48', bg: '#FFF1F2' },
  { label: 'Salary Slip', desc: 'Download payslips', path: '/modules/salary', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><path d="M1 10h22" /></svg>, color: '#0D9488', bg: '#F0FDFA' },
  { label: 'Loan', desc: 'Apply for loan', path: '/modules/loan', icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>, color: '#DC2626', bg: '#FEF2F2' },
];

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      {/* Section Separator */}
      <div className="dashboard-separator" />

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
