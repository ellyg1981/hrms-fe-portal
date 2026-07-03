import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import Modal from '../../common/Modal/Modal';
import Sidebar from '../Sidebar/Sidebar';
import Header from '../Header/Header';
import './AppLayout.css';

function AppLayout({ children, title, subtitle }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(true);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [pwStrength, setPwStrength] = useState(0);

  const dropdownRef = useRef(null);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false);
      }
      if (
        window.innerWidth > 1024 &&
        !collapsed &&
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        !e.target.closest('.sidebar-toggle-btn')
      ) {
        setCollapsed(true);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [collapsed]);

  const handleLogout = () => {
    setShowUserDropdown(false);
    setShowSignOutConfirm(true);
  };

  const confirmLogout = () => {
    logout();
    navigate('/login');
  };

  const openModal = (modalName) => {
    setShowUserDropdown(false);
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
    setShowSignOutConfirm(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPwStrength(0);
  };

  const getPasswordStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const handleNewPasswordChange = (e) => {
    const val = e.target.value;
    setNewPassword(val);
    setPwStrength(getPasswordStrength(val));
  };

  const getBreadcrumb = () => {
    const map = {
      '/dashboard': 'Dashboard',
      '/modules/profile': 'My Profile',
      '/modules/likizo': 'Leave',
      '/modules/training': 'Training',
      '/modules/announcements': 'Announcements',
      '/modules/documents': 'Documents',
      '/modules/performance': 'Performance',
      '/modules/salary': 'Salary',
      '/modules/staff-id': 'Staff ID',
    };
    return map[location.pathname] || title || 'Dashboard';
  };

  return (
    <div className="app-layout">
      <Header />
      <div ref={sidebarRef}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          showMobile={showMobileSidebar}
          setShowMobile={setShowMobileSidebar}
          user={user}
          onLogout={handleLogout}
        />
      </div>
      {showMobileSidebar && (
        <div className="mobile-overlay" onClick={() => setShowMobileSidebar(false)} />
      )}
      <div className={`main-content ${collapsed ? 'collapsed' : ''}`}>
        <div className="content-bar">
          <div className="content-bar-left">
            <button
              className="sidebar-toggle-btn"
              onClick={() => setCollapsed(!collapsed)}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <svg className="toggle-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
            <button
              className="mobile-toggle-btn"
              onClick={() => setShowMobileSidebar(true)}
              aria-label="Open menu"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
            <nav className="breadcrumb">
              <span className="breadcrumb-parent">{getBreadcrumb()}</span>
              <span className="breadcrumb-separator">›</span>
              <span className="breadcrumb-current">{getBreadcrumb()}</span>
            </nav>
          </div>
          <div className="content-bar-right" ref={dropdownRef}>
            <button className="content-notif-btn" aria-label="Notifications">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              <span className="content-notif-badge">1</span>
            </button>
            <div className="content-user" onClick={() => setShowUserDropdown(!showUserDropdown)}>
              <div className="content-user-text">
                <span className="content-user-name">{user?.name || 'System Admin'}</span>
                <span className="content-user-role">{user?.role || 'Admin'}</span>
              </div>
              <div className="content-user-avatar">
                <span>{user?.name?.charAt(0) || 'S'}</span>
              </div>
              <svg className={`content-user-chevron ${showUserDropdown ? 'open' : ''}`} viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            </div>
            {showUserDropdown && (
              <div className="content-user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">
                    <span>{user?.name?.charAt(0) || 'S'}</span>
                  </div>
                  <div className="dropdown-header-info">
                    <span className="dropdown-header-name">{user?.name || 'System Admin'}</span>
                    <span className="dropdown-header-email">{user?.email || 'admin@immigration.go.tz'}</span>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <button className="dropdown-item" onClick={() => openModal('profile')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                  <span>My Profile</span>
                </button>
                <button className="dropdown-item" onClick={() => openModal('accountSettings')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15 1.65 1.65 0 0 0 3 13.41V13a2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 6.4 9.55l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 10.55 7.3V7a2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1z"/></svg>
                  <span>Account Settings</span>
                </button>
                <button className="dropdown-item" onClick={() => openModal('changePassword')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                  <span>Change Password</span>
                </button>
                <button className="dropdown-item" onClick={() => openModal('helpSupport')}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                  <span>Help & Support</span>
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item dropdown-signout" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <main className="page-content">
          {title && (
            <div className="page-header">
              <div>
                <h1 className="page-title">{title}</h1>
                {subtitle && <p className="page-subtitle">{subtitle}</p>}
              </div>
            </div>
          )}
          {children}
        </main>
      </div>

      {/* My Profile Modal */}
      <Modal isOpen={activeModal === 'profile'} onClose={closeModal} title="My Profile" size="md"
        footer={
          <>
            <button className="modal-btn modal-btn-secondary" onClick={closeModal}>Close</button>
            <button className="modal-btn modal-btn-primary" onClick={() => { closeModal(); navigate('/modules/profile'); }}>Edit Profile</button>
          </>
        }>
        <div className="modal-profile-header">
          <div className="modal-profile-avatar">{user?.name?.charAt(0) || 'S'}</div>
          <div className="modal-profile-info">
            <h4>{user?.name || 'System Admin'}</h4>
            <p>{user?.email || 'admin@immigration.go.tz'}</p>
          </div>
        </div>
        <div className="modal-form-row">
          <div className="modal-form-group"><label className="modal-form-label">Full Name</label><div className="modal-form-value">{user?.name || 'System Admin'}</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Employee Number</label><div className="modal-form-value">EMP-2024-001</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Designation</label><div className="modal-form-value">Senior Officer</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Department</label><div className="modal-form-value">Human Resources</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Directorate/Unit</label><div className="modal-form-value">HR Operations</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Office Location</label><div className="modal-form-value">Head Office - DSM</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Work Email</label><div className="modal-form-value">{user?.email || 'admin@immigration.go.tz'}</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Phone Number</label><div className="modal-form-value">+255 712 345 678</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Employment Status</label><div className="modal-form-value">Permanent</div></div>
          <div className="modal-form-group"><label className="modal-form-label">Date Joined</label><div className="modal-form-value">15 Jan 2020</div></div>
        </div>
      </Modal>

      {/* Account Settings Modal */}
      <Modal isOpen={activeModal === 'accountSettings'} onClose={closeModal} title="Account Settings" size="md"
        footer={
          <>
            <button className="modal-btn modal-btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="modal-btn modal-btn-primary" onClick={closeModal}>Save Changes</button>
          </>
        }>
        <div className="modal-form-group">
          <label className="modal-form-label">Username</label>
          <input className="modal-form-input" defaultValue={user?.name?.toLowerCase().replace(/\s+/g, '.') || 'admin.user'} />
        </div>
        <div className="modal-form-group">
          <label className="modal-form-label">Email Address</label>
          <input className="modal-form-input" defaultValue={user?.email || 'admin@immigration.go.tz'} type="email" />
        </div>
        <div className="modal-form-row">
          <div className="modal-form-group">
            <label className="modal-form-label">Preferred Language</label>
            <select className="modal-form-select" defaultValue="en"><option value="en">English</option><option value="sw">Swahili</option></select>
          </div>
          <div className="modal-form-group">
            <label className="modal-form-label">Date & Time Format</label>
            <select className="modal-form-select" defaultValue="dd/MM/yyyy"><option value="dd/MM/yyyy">DD/MM/YYYY</option><option value="MM/dd/yyyy">MM/DD/YYYY</option><option value="yyyy-MM-dd">YYYY-MM-DD</option></select>
          </div>
        </div>
        <div className="modal-form-group">
          <label className="modal-form-label">Theme Preference</label>
          <select className="modal-form-select" defaultValue="light"><option value="light">Light</option><option value="dark">Dark</option><option value="system">System Default</option></select>
        </div>
        <div className="modal-form-group">
          <label className="modal-form-label">Session Timeout</label>
          <div className="modal-form-value">30 minutes of inactivity</div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal isOpen={activeModal === 'changePassword'} onClose={closeModal} title="Change Password" size="sm"
        footer={
          <>
            <button className="modal-btn modal-btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="modal-btn modal-btn-primary" onClick={closeModal}>Update Password</button>
          </>
        }>
        <div className="modal-form-group">
          <label className="modal-form-label">Current Password</label>
          <div className="modal-input-wrapper">
            <input className="modal-form-input" type={showCurrentPw ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} placeholder="Enter current password" />
            <button className="modal-input-toggle" onClick={() => setShowCurrentPw(!showCurrentPw)}>
              {showCurrentPw ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.8-7.55A4 4 0 0 0 8.24 8.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              )}
            </button>
          </div>
        </div>
        <div className="modal-form-group">
          <label className="modal-form-label">New Password</label>
          <div className="modal-input-wrapper">
            <input className="modal-form-input" type={showNewPw ? 'text' : 'password'} value={newPassword} onChange={handleNewPasswordChange} placeholder="Enter new password" />
            <button className="modal-input-toggle" onClick={() => setShowNewPw(!showNewPw)}>
              {showNewPw ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.8-7.55A4 4 0 0 0 8.24 8.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              )}
            </button>
          </div>
          <div className="modal-password-strength">
            {[1, 2, 3, 4].map((bar) => (
              <div key={bar} className={`modal-password-strength-bar ${pwStrength >= bar ? (pwStrength <= 1 ? 'weak' : pwStrength === 2 ? 'fair' : pwStrength === 3 ? 'good' : 'strong') : ''}`} />
            ))}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '4px' }}>
            {pwStrength === 0 ? 'Password must be at least 8 characters with uppercase, number, and special character.' : pwStrength === 1 ? 'Weak – add uppercase, numbers, and symbols.' : pwStrength === 2 ? 'Fair – add more character types.' : pwStrength === 3 ? 'Good – one more requirement for strong.' : 'Strong password!'}
          </p>
        </div>
        <div className="modal-form-group">
          <label className="modal-form-label">Confirm New Password</label>
          <div className="modal-input-wrapper">
            <input className="modal-form-input" type={showConfirmPw ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
            <button className="modal-input-toggle" onClick={() => setShowConfirmPw(!showConfirmPw)}>
              {showConfirmPw ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.8-7.55A4 4 0 0 0 8.24 8.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              )}
            </button>
          </div>
          {confirmPassword && newPassword !== confirmPassword && (
            <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginTop: '4px' }}>Passwords do not match.</p>
          )}
        </div>
      </Modal>

      {/* Help & Support Modal */}
      <Modal isOpen={activeModal === 'helpSupport'} onClose={closeModal} title="Help & Support" size="md"
        footer={<button className="modal-btn modal-btn-secondary" onClick={closeModal}>Close</button>}>
        <div className="modal-support-grid">
          {[
            { title: 'User Guide', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg> },
            { title: 'FAQs', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
            { title: 'Contact HR', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91"/><line x1="23" y1="1" x2="1" y2="23"/></svg> },
            { title: 'Contact ICT', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
            { title: 'Report Issue', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg> },
            { title: 'Documentation', icon: <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg> },
          ].map((card) => (
            <div key={card.title} className="modal-support-card">
              <div className="modal-support-icon">{card.icon}</div>
              <span className="modal-support-title">{card.title}</span>
            </div>
          ))}
        </div>
      </Modal>

      {/* Sign Out Confirmation Modal */}
      <Modal isOpen={showSignOutConfirm} onClose={closeModal} title="Confirm Sign Out" size="sm"
        footer={
          <>
            <button className="modal-btn modal-btn-secondary" onClick={closeModal}>Cancel</button>
            <button className="modal-btn modal-btn-danger" onClick={confirmLogout}>Sign Out</button>
          </>
        }>
        <div className="modal-confirm-body">
          <div className="modal-confirm-icon">
            <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </div>
          <h4 className="modal-confirm-title">Sign Out</h4>
          <p className="modal-confirm-text">Are you sure you want to sign out of the HRMS Staff Portal?</p>
        </div>
      </Modal>
    </div>
  );
}

export default AppLayout;
