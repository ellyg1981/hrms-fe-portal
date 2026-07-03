import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import coatOfArms from '../../assets/images/coat_of_arms.png';
import uhamiajiLogo from '../../assets/images/uhamiaji_logo.png';
import './ForgotPasswordPage.css';

function TanzaniaFlag() {
  return (
    <svg viewBox="0 0 300 200" width="220" height="147" className="login-flag">
      <rect width="300" height="200" fill="#00A3DD" />
      <polygon points="0,0 300,0 0,200" fill="#1EB53A" />
      <line x1="0" y1="200" x2="300" y2="0" stroke="#FCD116" strokeWidth="40" />
      <line x1="0" y1="200" x2="300" y2="0" stroke="#000000" strokeWidth="24" />
    </svg>
  );
}

const SLIDES = [
  { id: 'flag', render: () => <TanzaniaFlag /> },
  { id: 'coat', src: coatOfArms, alt: 'Coat of Arms' },
  { id: 'logo', src: uhamiajiLogo, alt: 'Uhamiaji Logo' },
];

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const handleSendCode = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('Username is required'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 800);
  };

  const handleReset = (e) => {
    e.preventDefault();
    setError('');
    if (code.length < 4) { setError('Please enter a valid verification code'); return; }
    if (!newPassword) { setError('New password is required'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="login-page">
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
              <button key={idx} className={`login-dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)} aria-label={`Slide ${idx + 1}`} />
            ))}
          </div>
        </div>

        <div className="login-right">
          {!success ? (
            <>
              <h1 className="login-title">Reset Password</h1>
              <p className="login-subtitle">{step === 1 ? 'Enter your username to receive a reset code' : 'Enter the code sent to your email and set a new password'}</p>

              {error && <div className="login-error-banner">{error}</div>}

              {step === 1 && (
                <form onSubmit={handleSendCode} className="login-form">
                  <div className="form-group">
                    <label className="form-label">Username *</label>
                    <div className="input-wrapper">
                      <input className="form-input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="e.g. steven.mzena" autoFocus />
                      <span className="input-suffix"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
                    </div>
                    <span className="form-hint">Enter firstname.lastname</span>
                  </div>
                  <button type="submit" className="btn btn-primary login-submit" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Code'}</button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleReset} className="login-form">
                  <div className="form-group">
                    <label className="form-label">Verification Code *</label>
                    <div className="input-wrapper">
                      <input className="form-input" type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Enter 6-digit code" maxLength={6} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">New Password *</label>
                    <div className="input-wrapper">
                      <input className="form-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Confirm Password *</label>
                    <div className="input-wrapper">
                      <input className="form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                    </div>
                  </div>
                  <button type="submit" className="btn btn-primary login-submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                  <button type="button" className="btn btn-secondary login-submit" onClick={() => setStep(1)} style={{ marginTop: 12 }}>Back</button>
                </form>
              )}

              <p className="login-register">
                Remember your password? <button type="button" className="link-btn link-btn--bold" onClick={() => navigate('/login')}>Back to Login</button>
              </p>
            </>
          ) : (
            <div className="reset-success">
              <div className="reset-success-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 className="login-title" style={{ textAlign: 'center' }}>Password Reset Successful</h2>
              <p className="login-subtitle" style={{ textAlign: 'center' }}>Your password has been updated. Please login with your new password.</p>
              <button className="btn btn-primary login-submit" onClick={() => navigate('/login')}>Back to Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
