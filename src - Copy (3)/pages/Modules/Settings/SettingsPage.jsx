import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import './SettingsPage.css';

function SettingsPage() {
  const { i18n } = useTranslation();
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });
  const [notifications, setNotifications] = useState({
    email: true,
    leaveUpdates: true,
    trainingAlerts: true,
    announcements: false,
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
  };

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar title="Settings" subtitle="Manage your account preferences and security" color="#0B2E59" />

        <div className="settings-grid">
          {/* Change Password */}
          <Card hover={false} className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon" style={{ background: '#EAF4FF', color: '#2F80ED' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
              </div>
              <div>
                <h3 className="settings-title">Change Password</h3>
                <p className="settings-desc">Update your account password regularly for security</p>
              </div>
            </div>
            <form onSubmit={handlePasswordChange} className="settings-form">
              <div className="form-group">
                <label className="form-label">Current Password</label>
                <input type="password" className="form-input" placeholder="Enter current password" value={passwordForm.current} onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">New Password</label>
                <input type="password" className="form-input" placeholder="Enter new password" value={passwordForm.new} onChange={e => setPasswordForm(p => ({ ...p, new: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Confirm New Password</label>
                <input type="password" className="form-input" placeholder="Confirm new password" value={passwordForm.confirm} onChange={e => setPasswordForm(p => ({ ...p, confirm: e.target.value }))} />
              </div>
              <button type="submit" className="btn btn-primary">Update Password</button>
            </form>
          </Card>

          {/* Notifications */}
          <Card hover={false} className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon" style={{ background: '#ECFDF5', color: '#059669' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
              </div>
              <div>
                <h3 className="settings-title">Notification Preferences</h3>
                <p className="settings-desc">Choose what notifications you want to receive</p>
              </div>
            </div>
            <div className="settings-toggles">
              {Object.entries(notifications).map(([key, value]) => (
                <label key={key} className="toggle-row">
                  <span className="toggle-label">
                    {key === 'email' ? 'Email Notifications' :
                     key === 'leaveUpdates' ? 'Leave Updates' :
                     key === 'trainingAlerts' ? 'Training Alerts' :
                     'HR Announcements'}
                  </span>
                  <div className="toggle-switch">
                    <input type="checkbox" checked={value} onChange={() => setNotifications(p => ({ ...p, [key]: !p[key] }))} />
                    <span className="toggle-slider" />
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Language */}
          <Card hover={false} className="settings-card">
            <div className="settings-card-header">
              <div className="settings-icon" style={{ background: '#F5F3FF', color: '#7C3AED' }}>
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
              </div>
              <div>
                <h3 className="settings-title">Language</h3>
                <p className="settings-desc">Select your preferred interface language</p>
              </div>
            </div>
            <div className="language-options">
              <button className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('en')}>
                <span className="lang-flag">EN</span>
                <span className="lang-name">English</span>
              </button>
              <button className={`language-btn ${i18n.language === 'sw' ? 'active' : ''}`} onClick={() => i18n.changeLanguage('sw')}>
                <span className="lang-flag">SW</span>
                <span className="lang-name">Kiswahili</span>
              </button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export default SettingsPage;
