import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import coatOfArms from '../../assets/images/coat_of_arms.png';
import uhamiajiLogo from '../../assets/images/uhamiaji_logo.png';
import bgImage from '../../assets/images/hq_dodoma.jpg';
import './LoginPage.css';

const SLIDES = [
  { id: 'coat', src: coatOfArms, alt: 'Coat of Arms' },
  { id: 'logo', src: uhamiajiLogo, alt: 'Uhamiaji Logo' },
];

const DEPARTMENTS = [
  'Immigration Services','Human Resources','Finance','ICT','Administration','Training','Policy & Planning',
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
  const [modal, setModal] = useState(null); // 'reset' | 'register' | null

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

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setLoginError('');
    setTimeout(() => {
      try {
        login(form.username.trim().toLowerCase(), form.password, form.rememberMe);
        setLoading(false);
        navigate('/dashboard');
      } catch (err) {
        setLoading(false);
        setLoginError(err.message || 'Invalid username or password');
      }
    }, 800);
  };

  const openModal = (name) => setModal(name);
  const closeModal = () => setModal(null);

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
        </div>

        <div className="login-right">
          <h1 className="login-title">Welcome</h1>
          <p className="login-subtitle">Login into the Employee Self Service</p>

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

            <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          <p className="login-register">
            Not Registered? <button type="button" className="link-btn link-btn--bold" onClick={() => openModal('register')}>Click here to register</button>
          </p>
        </div>
      </div>

      {/* Reset Password Modal */}
      {modal === 'reset' && <ResetPasswordModal onClose={closeModal} />}
      {/* Register Modal */}
      {modal === 'register' && <RegisterModal onClose={closeModal} />}
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

function RegisterModal({ onClose }) {
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', checkNumber: '', department: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => {
      const next = { ...prev, [name]: value };
      if (name === 'firstName' || name === 'lastName') {
        const f = name === 'firstName' ? value : prev.firstName;
        const l = name === 'lastName' ? value : prev.lastName;
        next.username = `${f.trim().toLowerCase()}.${l.trim().toLowerCase()}`.replace(/^\.|\.$/, '').replace(/\.+/g, '.');
      }
      return next;
    });
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required';
    if (!form.lastName.trim()) e.lastName = 'Last name is required';
    if (!form.username.trim()) e.username = 'Username is required';
    if (!form.checkNumber.trim()) e.checkNumber = 'Check number is required';
    if (!form.department) e.department = 'Department is required';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 1000);
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal login-modal--wide" onClick={e => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>&times;</button>
        {!success ? (
          <>
            <h3 className="login-modal-title">Register</h3>
            <p className="login-modal-subtitle">Create your Employee Self Service account</p>
            <form onSubmit={handleSubmit} className="login-modal-form">
              <div className="register-row">
                <div className={`form-group ${errors.firstName ? 'form-group--error' : ''}`}>
                  <label className="form-label">First Name *</label>
                  <input className="form-input" type="text" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" />
                  {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                </div>
                <div className={`form-group ${errors.lastName ? 'form-group--error' : ''}`}>
                  <label className="form-label">Last Name *</label>
                  <input className="form-input" type="text" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" />
                  {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" type="text" name="username" value={form.username} readOnly />
                <span className="form-hint">Auto-generated from firstname.lastname</span>
              </div>
              <div className={`form-group ${errors.checkNumber ? 'form-group--error' : ''}`}>
                <label className="form-label">Check Number *</label>
                <input className="form-input" type="text" name="checkNumber" value={form.checkNumber} onChange={handleChange} placeholder="Enter check number" />
                {errors.checkNumber && <span className="form-error">{errors.checkNumber}</span>}
              </div>
              <div className={`form-group ${errors.department ? 'form-group--error' : ''}`}>
                <label className="form-label">Department *</label>
                <select className="form-input form-select" name="department" value={form.department} onChange={handleChange}>
                  <option value="">Select department</option>
                  {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
                {errors.department && <span className="form-error">{errors.department}</span>}
              </div>
              <div className={`form-group ${errors.password ? 'form-group--error' : ''}`}>
                <label className="form-label">Password *</label>
                <input className="form-input" type="password" name="password" value={form.password} onChange={handleChange} placeholder="Create password" />
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>
              <div className={`form-group ${errors.confirmPassword ? 'form-group--error' : ''}`}>
                <label className="form-label">Confirm Password *</label>
                <input className="form-input" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="Confirm password" />
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>
              <button type="submit" className="btn btn-primary login-submit" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
            </form>
          </>
        ) : (
          <div className="login-modal-success">
            <div className="reset-success-icon"><svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
            <h3 className="login-modal-title" style={{ textAlign: 'center' }}>Registration Submitted</h3>
            <p className="login-modal-subtitle" style={{ textAlign: 'center' }}>Your request has been sent to HR for approval.</p>
            <button className="btn btn-primary login-submit" onClick={onClose}>Back to Login</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
