import React, { useState, useEffect, useRef, useCallback } from 'react';
import { findDemoEmployee } from '../../data/demoEmployees';
import './RegisterModal.css';

const maskEmail = (email) => {
  const [name, domain] = email.split('@');
  if (name.length <= 3) return email;
  return name.slice(0, 3) + '******@' + domain;
};

const passwordChecks = (pw) => [
  { label: 'Minimum 8 characters', ok: pw.length >= 8 },
  { label: 'At least one uppercase letter', ok: /[A-Z]/.test(pw) },
  { label: 'At least one lowercase letter', ok: /[a-z]/.test(pw) },
  { label: 'At least one number', ok: /\d/.test(pw) },
  { label: 'At least one special character', ok: /[^A-Za-z0-9]/.test(pw) },
];

const getStrength = (pw) => {
  const checks = passwordChecks(pw);
  const count = checks.filter(c => c.ok).length;
  if (count <= 2) return { label: 'Weak', pct: 25, color: '#EF4444' };
  if (count <= 3) return { label: 'Fair', pct: 50, color: '#F59E0B' };
  if (count <= 4) return { label: 'Good', pct: 75, color: '#3B82F6' };
  return { label: 'Strong', pct: 100, color: '#10B981' };
};

function RegisterModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [nin, setNin] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [employee, setEmployee] = useState(null);

  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendCountdown, setResendCountdown] = useState(0);
  const otpRefs = useRef([]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState('');

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const t = setInterval(() => setResendCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [resendCountdown]);

  const startCountdown = useCallback(() => setResendCountdown(60), []);

  const handleVerify = (e) => {
    e.preventDefault();
    setError('');
    if (!nin.trim() && !checkNumber.trim()) {
      setError('Please enter either your National ID (NIN) or Check Number.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const found = findDemoEmployee({ checkNumber, nin });
      if (!found) {
        setError('No employee record was found using the provided information. Please verify your National ID or Check Number and try again.');
        return;
      }
      setEmployee(found);
      setStep(2);
      startCountdown();
    }, 800);
  };

  const handleOtpChange = (idx, val) => {
    if (!/^\d?$/.test(val)) return;
    setOtpError('');
    setOtpDigits(prev => {
      const next = [...prev];
      next[idx] = val;
      return next;
    });
    if (val && idx < 5) otpRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && !otpDigits[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const next = pasted.split('').concat(Array(6 - pasted.length).fill(''));
      setOtpDigits(next);
      otpRefs.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    setOtpError('');
    const otp = otpDigits.join('');
    if (otp.length < 6) {
      setOtpError('Please enter the complete 6-digit OTP code.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (otp === '456321' || otp === '123456') {
        setStep(3);
      } else {
        setOtpError('The OTP entered is incorrect or has expired. Please try again.');
      }
    }, 800);
  };

  const handleResendOtp = () => {
    if (resendCountdown > 0) return;
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError('');
    startCountdown();
    otpRefs.current[0]?.focus();
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setPwError('');
    const checks = passwordChecks(password);
    const allOk = checks.every(c => c.ok);
    if (!allOk) {
      setPwError('Password does not meet all requirements.');
      return;
    }
    if (password !== confirmPassword) {
      setPwError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
  };

  const steps = ['Verification', 'OTP Verification', 'Create Password'];

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal login-modal--wide reg-modal" onClick={e => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>&times;</button>

        {!success && (
          <div className="reg-progress">
            {steps.map((label, idx) => (
              <div key={label} className={`reg-progress-step ${step >= idx + 1 ? 'active' : ''} ${step > idx + 1 ? 'done' : ''}`}>
                <div className="reg-progress-circle">
                  {step > idx + 1 ? (
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    idx + 1
                  )}
                </div>
                <span className="reg-progress-label">{label}</span>
                {idx < steps.length - 1 && <div className="reg-progress-bar" />}
              </div>
            ))}
          </div>
        )}

        {success ? (
          <div className="login-modal-success">
            <div className="reset-success-icon">
              <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3 className="login-modal-title" style={{ textAlign: 'center' }}>Registration Completed Successfully</h3>
            <p className="login-modal-subtitle" style={{ textAlign: 'center' }}>
              Your HRMS Staff Portal account has been created successfully.
            </p>
            <div className="reg-success-info">
              <p className="reg-success-label">You can now log in using:</p>
              <div className="reg-success-username">{employee?.email}</div>
              <p className="reg-success-hint">Please use your newly created password to access the system.</p>
            </div>
            <button className="btn btn-primary login-submit" onClick={onClose}>Go to Login</button>
          </div>
        ) : step === 1 ? (
          <>
            <h3 className="login-modal-title">Employee Verification</h3>
            <p className="login-modal-subtitle">Enter either your National Identification Number (NIN) or your Check Number to verify your employee record.</p>
            {error && <div className="login-modal-error">{error}</div>}
            <form onSubmit={handleVerify} className="login-modal-form">
              <div className="form-group">
                <label className="form-label">National Identification Number (NIN)</label>
                <input className="form-input" type="text" value={nin} onChange={e => { setNin(e.target.value); setError(''); }} placeholder="e.g. 1990123456789001" autoFocus />
              </div>
              <div className="form-group">
                <label className="form-label">Check Number</label>
                <input className="form-input" type="text" value={checkNumber} onChange={e => { setCheckNumber(e.target.value); setError(''); }} placeholder="e.g. CHK000123" />
              </div>
              <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </form>
          </>
        ) : step === 2 ? (
          <>
            <h3 className="login-modal-title">OTP Verification</h3>
            <p className="login-modal-subtitle">
              A One-Time Password (OTP) has been sent to your official email address.
            </p>
            <div className="reg-otp-email">{maskEmail(employee?.email || '')}</div>
            {otpError && <div className="login-modal-error">{otpError}</div>}
            <form onSubmit={handleVerifyOtp} className="login-modal-form">
              <div className="reg-otp-inputs" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={el => { otpRefs.current[idx] = el; }}
                    className="reg-otp-box"
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(idx, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(idx, e)}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
              <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify OTP'}
              </button>
              <div className="reg-otp-resend">
                {resendCountdown > 0 ? (
                  <span className="reg-otp-countdown">Resend OTP in {resendCountdown}s</span>
                ) : (
                  <button type="button" className="link-btn" onClick={handleResendOtp}>Resend OTP</button>
                )}
              </div>
            </form>
          </>
        ) : (
          <>
            <h3 className="login-modal-title">Complete Registration</h3>
            <p className="login-modal-subtitle">Review your information and create a password.</p>

            <div className="reg-employee-info">
              <h4 className="reg-info-title">Employee Information</h4>
              <div className="reg-info-grid">
                <div className="reg-info-item"><span className="reg-info-label">Employee Number</span><span className="reg-info-value">{employee?.employeeNumber}</span></div>
                <div className="reg-info-item"><span className="reg-info-label">Full Name</span><span className="reg-info-value">{employee?.fullName}</span></div>
                <div className="reg-info-item"><span className="reg-info-label">Department</span><span className="reg-info-value">{employee?.department}</span></div>
                <div className="reg-info-item"><span className="reg-info-label">Designation</span><span className="reg-info-value">{employee?.designation}</span></div>
                <div className="reg-info-item"><span className="reg-info-label">Official Email</span><span className="reg-info-value">{employee?.email}</span></div>
              </div>
            </div>

            {pwError && <div className="login-modal-error">{pwError}</div>}

            <form onSubmit={handleRegister} className="login-modal-form">
              <div className="form-group">
                <label className="form-label">Username</label>
                <input className="form-input" type="text" value={employee?.email || ''} readOnly />
                <span className="form-hint">Your official email address is your username</span>
              </div>

              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-wrapper">
                  <input className="form-input" type={showPassword ? 'text' : 'password'} value={password} onChange={e => { setPassword(e.target.value); setPwError(''); }} placeholder="Create password" />
                  <button type="button" className="input-suffix input-suffix--btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                    {showPassword ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.72 1.08L3 3"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
                {password && (
                  <div className="reg-pw-strength">
                    <div className="reg-pw-strength-bar">
                      <div className="reg-pw-strength-fill" style={{ width: `${getStrength(password).pct}%`, background: getStrength(password).color }} />
                    </div>
                    <span className="reg-pw-strength-label" style={{ color: getStrength(password).color }}>{getStrength(password).label}</span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <div className="input-wrapper">
                  <input className="form-input" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); setPwError(''); }} placeholder="Confirm password" />
                  <button type="button" className="input-suffix input-suffix--btn" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1}>
                    {showConfirm ? (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.72 1.08L3 3"/><circle cx="12" cy="12" r="3"/></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="reg-pw-requirements">
                <p className="reg-pw-req-title">Password Requirements</p>
                <ul className="reg-pw-req-list">
                  {passwordChecks(password).map(req => (
                    <li key={req.label} className={req.ok ? 'reg-pw-req-ok' : ''}>
                      <span className="reg-pw-req-icon">{req.ok ? '✓' : '○'}</span>
                      {req.label}
                    </li>
                  ))}
                </ul>
              </div>

              <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                {loading ? 'Registering...' : 'Submit Registration'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default RegisterModal;
