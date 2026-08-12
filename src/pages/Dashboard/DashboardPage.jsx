import React from 'react';
import { useNavigate } from 'react-router-dom';
import ServiceCard from '../../components/common/ServiceCard/ServiceCard';
import './DashboardPage.css';

const SERVICE_CARDS = [
  {
    title: 'My Profile',
    description: 'View and update your personal, contact, and employment details.',
    path: '/modules/profile',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,
    iconColor: '#0B2E59',
    iconBg: '#EAF4FF',
  },
  {
    title: 'Staff ID Services',
    description: 'Request, manage, and track staff ID applications.',
    path: '/modules/staff-id',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="12" cy="10" r="3" /><path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2" /></svg>,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
  },
  {
    title: 'Transfer Management',
    description: 'Submit transfer requests and track employee movement history.',
    path: '/modules/transfer',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h3v3h-3z" /><path d="M8 18h3v3H8z" /><path d="M21 6l-9 9" /><path d="M15 6h6v6" /><path d="M9 18H3v-6" /></svg>,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
  },
  {
    title: 'Leave Management',
    description: 'Submit leave requests, track approvals, and view leave history.',
    path: '/modules/likizo',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>,
    iconColor: '#059669',
    iconBg: '#ECFDF5',
  },
  {
    title: 'Training Management',
    description: 'Request training programs and manage professional development activities.',
    path: '/modules/training',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10l-10-6-10 6 10 6 10-6z" /><path d="M6 12v5l6 3 6-3v-5" /></svg>,
    iconColor: '#2563EB',
    iconBg: '#EFF6FF',
  },
  {
    title: 'Announcements',
    description: 'Stay informed with the latest organizational announcements, notices, policy updates, and important staff communications.',
    path: '/modules/announcements',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>,
    iconColor: '#E11D48',
    iconBg: '#FFF1F2',
  },
  {
    title: 'Anuai za Jamii',
    description: 'Understand, report, seek assistance, and communicate on social diversity issues.',
    path: '/modules/anuai-za-jamii',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>,
    iconColor: '#0B2E59',
    iconBg: '#EAF4FF',
  },
  {
    title: 'Salary Slip',
    description: 'Access salary information and download monthly payslips.',
    path: '/modules/salary',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="12" cy="12" r="3" /><path d="M6 12h.01" /><path d="M18 12h.01" /></svg>,
    iconColor: '#0D9488',
    iconBg: '#F0FDFA',
  },
  {
    title: 'Loan Management',
    description: 'Manage loan applications and repayment information.',
    path: '/modules/loan',
    icon: <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="7" r="4" /><path d="M7 14h10a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" /><path d="M12 11v3" /></svg>,
    iconColor: '#DC2626',
    iconBg: '#FEF2F2',
  },
];

function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-page">
      {/* Section Separator */}
      <div className="dashboard-separator" />

      {/* Service Cards */}
      <div className="service-cards-grid">
        {SERVICE_CARDS.map((svc) => (
          <ServiceCard
            key={svc.path}
            title={svc.title}
            description={svc.description}
            icon={svc.icon}
            iconBg={svc.iconBg}
            iconColor={svc.iconColor}
            onClick={() => navigate(svc.path)}
          />
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
