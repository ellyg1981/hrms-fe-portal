import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import RegisterModal from './RegisterModal';
import coatOfArms from '../../assets/images/coat_of_arms.png';
import uhamiajiLogo from '../../assets/images/uhamiaji_logo.png';
import bgImage from '../../assets/images/hq_dodoma.jpg';
import { notificationService } from '../../components/Notifications/notificationService';
import Modal from '../../components/common/Modal/Modal';
import LoadingScreen from '../../components/common/LoadingScreen/LoadingScreen';
import { getLoginTestUsers } from '../../services/authApi';
import './LoginPage.css';

const SLIDES = [
  { id: 'coat', src: coatOfArms, alt: 'Coat of Arms' },
  { id: 'logo', src: uhamiajiLogo, alt: 'Uhamiaji Logo' },
];

function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [form, setForm] = useState({ username: '', password: '', rememberMe: false });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const submittingRef = useRef(false);
  const [modal, setModal] = useState(null); // 'reset' | 'register' | null

  useEffect(() => { document.title = 'Login | HRMS Portal'; }, []);

  useEffect(() => { if (user) navigate('/dashboard', { replace: true }); }, [user, navigate]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
    setLoginError('');
  };

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (submittingRef.current) return;
    if (!validate()) {
      notificationService.warning('Please correct the highlighted fields before submitting.');
      return;
    }
    submittingRef.current = true;
    setLoading(true);
    setLoginError('');
    try {
      await notificationService.promise(
        login(form.username.trim().toLowerCase(), form.password, form.rememberMe),
        {
          loading: 'Logging in...',
          success: (u) => `Login successful. Welcome back, ${u?.name || u?.fullName || 'User'}.`,
          error: (err) => err.message || 'Invalid username or password.',
        }
      );
    } catch (err) {
      setLoginError(err.message || 'Invalid username or password');
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  const openModal = (name) => setModal(name);
  const closeModal = () => setModal(null);
  const testUsers = getLoginTestUsers();

  const handleSelectUser = (selectedUser) => {
    setForm(prev => ({
      ...prev,
      username: selectedUser.username || selectedUser.email?.split('@')[0] || '',
      password: selectedUser.password || '',
    }));
    setErrors({});
    setLoginError('');
    closeModal();
  };

  return (
    <div className="login-page">
      <div className="login-bg">
        <img src={bgImage} alt="" className="login-bg-img" />
        <div className="login-bg-overlay" />
      </div>
      <div className="login-card">
        <div className="login-left">
          <div className="login-slider">
            {SLIDES.map((slide, idx) => (
              <div key={slide.id} className={`login-slide ${idx === currentSlide ? 'active' : ''}`}>
                {slide.render ? slide.render() : <img src={slide.src} alt={slide.alt} className="login-slide-img" />}
              </div>
            ))}
          </div>
          <div className="login-dots">
            {SLIDES.map((_, idx) => (
              <button key={idx} className={`login-dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)} aria-label={`Go to slide ${idx + 1}`} />
            ))}
          </div>
          {testUsers.length > 0 && (
            <button type="button" className="login-users-trigger" onClick={() => openModal('users')}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Users
            </button>
          )}
        </div>

        <div className="login-right">
          <h1 className="login-title">Welcome</h1>
          {/* <p className="login-subtitle">Login into the Employee Self Service</p> */}
          <p className="login-subtitle">Login to: TISD Employee Self Service</p>

          {loginError && <div className="login-error-banner">{loginError}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <div className={`form-group ${errors.username ? 'form-group--error' : ''}`}>
              <label className="form-label">Username *</label>
              <div className="input-wrapper">
                <input className="form-input" type="text" name="username" value={form.username} onChange={handleChange} placeholder="e.g. steven.mzena" autoFocus />
                <span className="input-suffix"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
              </div>
              <span className="form-hint">Enter firstname.lastname (domain @immigration.go.tz is added automatically)</span>
              {errors.username && <span className="form-error">{errors.username}</span>}
            </div>

            <div className={`form-group ${errors.password ? 'form-group--error' : ''}`}>
              <label className="form-label">Password *</label>
              <div className="input-wrapper">
                <input className="form-input" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
                <button type="button" className="input-suffix input-suffix--btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.72 1.08L3 3"/><circle cx="12" cy="12" r="3"/></svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>

            <div className="login-options">
              <label className="checkbox-label">
                <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange} />
                <span>Remember me</span>
              </label>
              <button type="button" className="link-btn" onClick={() => openModal('reset')}>Reset Password?</button>
            </div>

            <button type="submit" className="btn btn-primary login-submit" disabled={loading} aria-busy={loading}>
              {loading ? <span className="login-submit-spinner" aria-label="Signing in" /> : 'LOGIN'}
            </button>
          </form>

          <p className="login-register">
            Not Registered? <button type="button" className="link-btn link-btn--bold" onClick={() => openModal('register')}>Click here to register</button>
          </p>
        </div>
      </div>

      {/* Signing-in loading overlay */}
      {loading && <LoadingScreen message="Signing in..." />}
      {/* Reset Password Modal */}
      {modal === 'reset' && <ResetPasswordModal onClose={closeModal} />}
      {/* Register Modal */}
      {modal === 'register' && <RegisterModal onClose={closeModal} />}
      {/* Users Modal */}
      {modal === 'users' && <UsersModal users={testUsers} onClose={closeModal} onSelect={handleSelectUser} />}
    </div>
  );
}

function ResetPasswordModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSendCode = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Username is required'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 800);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setError('');
    if (code.length < 4) { setError('Please enter a valid verification code'); return; }
    if (!newPassword) { setError('New password is required'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 800);
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal" onClick={e => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>&times;</button>
        {!success ? (
          <>
            <h3 className="login-modal-title">Reset Password</h3>
            <p className="login-modal-subtitle">{step === 1 ? 'Enter your username to receive a reset code' : 'Enter the code and set a new password'}</p>
            {error && <div className="login-modal-error">{error}</div>}
            {step === 1 ? (
              <form onSubmit={handleSendCode} className="login-modal-form">
                <div className="form-group">
                  <label className="form-label">Username *</label>
                  <input className="form-input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. steven.mzena" autoFocus />
                </div>
                <button type="submit" className="btn btn-primary login-submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Code'}</button>
              </form>
            ) : (
              <form onSubmit={handleReset} className="login-modal-form">
                <div className="form-group">
                  <label className="form-label">Verification Code *</label>
                  <input className="form-input" type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <input className="form-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm Password *</label>
                  <input className="form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                </div>
                <button type="submit" className="btn btn-primary login-submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                <button type="button" className="btn btn-secondary login-submit" style={{ marginTop: 10 }} onClick={() => setStep(1)}>Back</button>
              </form>
            )}
          </>
        ) : (
          <div className="login-modal-success">
            <div className="reset-success-icon"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <h3 className="login-modal-title" style={{ textAlign: 'center' }}>Password Reset Successful</h3>
            <p className="login-modal-subtitle" style={{ textAlign: 'center' }}>Your password has been updated.</p>
            <button className="btn btn-primary login-submit" onClick={onClose}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}

function UsersModal({ users, onClose, onSelect }) {
  return (
    <Modal isOpen onClose={onClose} title="Available Users" size="lg">
      <div className="login-users-list" role="list">
        {users.map((user, i) => (
          <div key={user.userId || user.username || i} className="login-users-item" role="listitem">
            <div className="login-users-info">
              <span className="login-users-name">{user.fullName}</span>
              <span className="login-users-meta">{user.email}</span>
            </div>
            <button type="button" className="btn btn-primary login-users-select" onClick={() => onSelect(user)}>
              Select User
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}

export default LoginPage;
