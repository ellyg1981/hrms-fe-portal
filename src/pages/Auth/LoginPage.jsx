import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, MotionConfig } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import BlurFadeText from '../../components/common/BlurFadeText/BlurFadeText';
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

const formVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } },
};

const fieldVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

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
    <MotionConfig reducedMotion="user">
    <div className="login-page">
      <div className="login-bg">
        <motion.img
          src={bgImage}
          alt=""
          className="login-bg-img"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.4, ease: 'easeOut' }}
        />
        <div className="login-bg-overlay" />
      </div>
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="login-left">
          <div className="login-slider">
            <AnimatePresence initial={false}>
              <motion.div
                key={SLIDES[currentSlide].id}
                className="login-slide"
                initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.05, filter: 'blur(8px)' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {SLIDES[currentSlide].render ? SLIDES[currentSlide].render() : <img src={SLIDES[currentSlide].src} alt={SLIDES[currentSlide].alt} className="login-slide-img" />}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="login-dots">
            {SLIDES.map((_, idx) => (
              <motion.button key={idx} className={`login-dot ${idx === currentSlide ? 'active' : ''}`} onClick={() => setCurrentSlide(idx)} aria-label={`Go to slide ${idx + 1}`} whileHover={{ scale: 1.3 }} whileTap={{ scale: 0.9 }} />
            ))}
          </div>
          {testUsers.length > 0 && (
            <motion.button type="button" className="login-users-trigger" onClick={() => openModal('users')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Users
            </motion.button>
          )}
        </div>

        <div className="login-right">
          <BlurFadeText as="h1" className="login-title" text="Welcome" delay={0.2} />
          {/* <p className="login-subtitle">Login into the Employee Self Service</p> */}
          <BlurFadeText as="p" className="login-subtitle" text="Login to: TISD Employee Self Service" delay={0.35} />

          <AnimatePresence>
            {loginError && (
              <motion.div
                className="login-error-banner"
                initial={{ opacity: 0, height: 0, x: 0 }}
                animate={{ opacity: 1, height: 'auto', x: [0, -8, 8, -5, 5, 0] }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
              >
                {loginError}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.form onSubmit={handleSubmit} className="login-form" variants={formVariants} initial="hidden" animate="visible">
            <motion.div variants={fieldVariants} className={`form-group ${errors.username ? 'form-group--error' : ''}`}>
              <label className="form-label">Username *</label>
              <div className="input-wrapper">
                <input className="form-input" type="text" name="username" value={form.username} onChange={handleChange} placeholder="e.g. steven.mzena" autoFocus />
                <span className="input-suffix"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
              </div>
              <span className="form-hint">Enter firstname.lastname (domain @immigration.go.tz is added automatically)</span>
              <AnimatePresence>
                {errors.username && <motion.span className="form-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{errors.username}</motion.span>}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fieldVariants} className={`form-group ${errors.password ? 'form-group--error' : ''}`}>
              <label className="form-label">Password *</label>
              <div className="input-wrapper">
                <input className="form-input" type={showPassword ? 'text' : 'password'} name="password" value={form.password} onChange={handleChange} placeholder="Enter password" />
                <button type="button" className="input-suffix input-suffix--btn" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={showPassword ? 'hide' : 'show'} style={{ display: 'flex' }} initial={{ opacity: 0, rotate: -90, scale: 0.6 }} animate={{ opacity: 1, rotate: 0, scale: 1 }} exit={{ opacity: 0, rotate: 90, scale: 0.6 }} transition={{ duration: 0.18 }}>
                      {showPassword ? (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-3.72 1.08L3 3"/><circle cx="12" cy="12" r="3"/></svg>
                      ) : (
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      )}
                    </motion.span>
                  </AnimatePresence>
                </button>
              </div>
              <AnimatePresence>
                {errors.password && <motion.span className="form-error" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{errors.password}</motion.span>}
              </AnimatePresence>
            </motion.div>

            <motion.div variants={fieldVariants} className="login-options">
              <label className="checkbox-label">
                <input type="checkbox" name="rememberMe" checked={form.rememberMe} onChange={handleChange} />
                <span>Remember me</span>
              </label>
              <motion.button type="button" className="link-btn" onClick={() => openModal('reset')} whileHover={{ x: 2 }}>Reset Password?</motion.button>
            </motion.div>

            <motion.button
              variants={fieldVariants}
              type="submit"
              className="btn btn-primary login-submit"
              disabled={loading}
              aria-busy={loading}
              whileHover={loading ? undefined : { scale: 1.02, boxShadow: '0 8px 24px rgba(11, 30, 58, 0.25)' }}
              whileTap={loading ? undefined : { scale: 0.98 }}
            >
              {loading ? <span className="login-submit-spinner" aria-label="Signing in" /> : 'LOGIN'}
            </motion.button>
          </motion.form>

          <motion.p className="login-register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.4 }}>
            Not Registered? <button type="button" className="link-btn link-btn--bold" onClick={() => openModal('register')}>Click here to register</button>
          </motion.p>
        </div>
      </motion.div>

      {/* Signing-in loading overlay */}
      {loading && <LoadingScreen message="Signing in..." />}
      {/* Reset Password Modal */}
      <AnimatePresence>
        {modal === 'reset' && <ResetPasswordModal key="reset" onClose={closeModal} />}
      </AnimatePresence>
      {/* Register Modal */}
      {modal === 'register' && <RegisterModal onClose={closeModal} />}
      {/* Users Modal */}
      {modal === 'users' && <UsersModal users={testUsers} onClose={closeModal} onSelect={handleSelectUser} />}
    </div>
    </MotionConfig>
  );
}

const OTP_LENGTH = 6;

function OtpInput({ value, onChange, autoFocus }) {
  const inputsRef = useRef([]);
  const focusAt = (i) => inputsRef.current[Math.max(0, Math.min(i, OTP_LENGTH - 1))]?.focus();

  const setDigits = (start, digits) => {
    const next = [...value];
    digits.split('').slice(0, OTP_LENGTH - start).forEach((d, k) => { next[start + k] = d; });
    onChange(next);
    focusAt(start + digits.length);
  };

  const handleChange = (i, e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) return;
    setDigits(i, digits.length > 1 && !value[i] ? digits : digits.slice(-1));
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...value];
      if (next[i]) { next[i] = ''; onChange(next); } else if (i > 0) { next[i - 1] = ''; onChange(next); focusAt(i - 1); }
    } else if (e.key === 'ArrowLeft') { e.preventDefault(); focusAt(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focusAt(i + 1); }
  };

  const handlePaste = (i, e) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '');
    if (!digits) return;
    e.preventDefault();
    setDigits(i, digits);
  };

  return (
    <div className="otp-group" role="group" aria-label="Verification code">
      {value.map((digit, i) => (
        <motion.input
          key={i}
          ref={el => { inputsRef.current[i] = el; }}
          className={`otp-input ${digit ? 'otp-input--filled' : ''}`}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={OTP_LENGTH}
          value={digit}
          aria-label={`Digit ${i + 1}`}
          autoFocus={autoFocus && i === 0}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          onPaste={e => handlePaste(i, e)}
          onFocus={e => e.target.select()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0, scale: digit ? [1, 1.08, 1] : 1 }}
          transition={{ delay: i * 0.04, duration: 0.25 }}
        />
      ))}
    </div>
  );
}

function ResetPasswordModal({ onClose }) {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState(() => Array(OTP_LENGTH).fill(''));
  const code = otp.join('');
  const codeComplete = code.length === OTP_LENGTH;
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
    if (!codeComplete) { setError('Please enter the 6-digit verification code'); return; }
    if (!newPassword) { setError('New password is required'); return; }
    if (newPassword.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setSuccess(true); }, 800);
  };

  return (
    <motion.div className="login-modal-overlay" style={{ animation: 'none' }} onClick={onClose} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <motion.div
        className="login-modal"
        style={{ animation: 'none' }}
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
      >
        <button className="login-modal-close" onClick={onClose}>&times;</button>
        {!success ? (
          <>
            <h3 className="login-modal-title">Reset Password</h3>
            <p className="login-modal-subtitle">
              {step === 1 ? 'Enter your username to receive a reset code' : codeComplete ? 'Code entered. Now set your new password' : 'Enter the 6-digit code sent to you'}
            </p>
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
                  <OtpInput value={otp} onChange={next => { setOtp(next); setError(''); }} autoFocus />
                </div>
                <AnimatePresence initial={false}>
                  {codeComplete && (
                    <motion.div
                      key="password-fields"
                      className="login-modal-form"
                      initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      animate={{ opacity: 1, height: 'auto', transitionEnd: { overflow: 'visible' } }}
                      exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                      <div className="form-group">
                        <label className="form-label">New Password *</label>
                        <input className="form-input" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" autoFocus />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Confirm Password *</label>
                        <input className="form-input" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" />
                      </div>
                      <button type="submit" className="btn btn-primary login-submit" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</button>
                    </motion.div>
                  )}
                </AnimatePresence>
                <button type="button" className="btn btn-secondary login-submit" onClick={() => { setStep(1); setOtp(Array(OTP_LENGTH).fill('')); setError(''); }}>Back</button>
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
      </motion.div>
    </motion.div>
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
