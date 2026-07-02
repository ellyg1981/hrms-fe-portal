import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import coatOfArms from '../../assets/images/coat_of_arms.png';
import uhamiajiLogo from '../../assets/images/uhamiaji_logo.png';
import './RegisterPage.css';

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

const DEPARTMENTS = [
  'Immigration Services',
  'Human Resources',
  'Finance',
  'ICT',
  'Administration',
  'Training',
  'Policy & Planning',
];

function RegisterPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    checkNumber: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % SLIDES.length), 4000);
    return () => clearInterval(timer);
  }, []);

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
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1000);
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

        <div className="login-right" style={{ overflowY: 'auto' }}>
          {!success ? (
            <>
              <h1 className="login-title">Register</h1>
              <p className="login-subtitle">Create your Employee Self Service account</p>

              <form onSubmit={handleSubmit} className="login-form">
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

                <div className={`form-group ${errors.username ? 'form-group--error' : ''}`}>
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

                <button type="submit" className="btn btn-primary login-submit" disabled={loading}>
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </form>

              <p className="login-register">
                Already have an account? <button type="button" className="link-btn link-btn--bold" onClick={() => navigate('/login')}>Login here</button>
              </p>
            </>
          ) : (
            <div className="reset-success">
              <div className="reset-success-icon">
                <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="#059669" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              </div>
              <h2 className="login-title" style={{ textAlign: 'center' }}>Registration Submitted</h2>
              <p className="login-subtitle" style={{ textAlign: 'center' }}>Your account request has been sent to HR for approval. You will receive an email once approved.</p>
              <button className="btn btn-primary login-submit" onClick={() => navigate('/login')}>Back to Login</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
