import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Modal from '../common/Modal/Modal';

const GENDERS = ['Male','Female'];
const MARITAL = ['Single','Married','Divorced','Widowed'];
const ID_TYPES = ['National ID','Passport','Driving License','Voter ID','Other'];
const EMP_TYPES = ['Permanent','Contract','Temporary','Intern'];

const FG = ({ label, children, error, req }) => (
  <div className={`form-group${error ? ' form-group--error' : ''}`}>
    <label className="form-label">{label}{req && <span className="reg-required"> *</span>}</label>
    {children}
    {error && <span className="reg-form-error">{error}</span>}
  </div>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
);

function PhotoFrame({ photo, setPhoto, setPersonal, photoRef, onChange }) {
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleRemove = () => {
    if (photo?.startsWith('blob:')) URL.revokeObjectURL(photo);
    setPhoto(null);
    setPersonal(p => ({ ...p, employeePhoto: null }));
  };

  const handleDownload = () => {
    if (!photo) return;
    const a = document.createElement('a');
    a.href = photo;
    a.download = 'employee-photo.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="reg-photo-cell">
      <div
        className="reg-photo-frame"
        style={{ backgroundImage: photo ? `url(${photo})` : 'none' }}
        aria-label={photo ? 'Employee photo' : 'No employee photo uploaded'}
        role="img"
      >
        {!photo && (
          <div className="reg-photo-frame-placeholder">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
        )}
      </div>
      <input type="file" ref={photoRef} accept="image/*" className="file-upload-input" onChange={onChange} />
      <div className="reg-photo-actions">
        <button type="button" className="btn btn-secondary reg-photo-upload" onClick={() => photoRef.current?.click()}>
          <UploadIcon /> Upload Photo
        </button>
        {photo && (
          <>
            <button type="button" className="reg-photo-action" onClick={() => setPreviewOpen(true)} title="View photo" aria-label="View photo">
              <EyeIcon />
            </button>
            <button type="button" className="reg-photo-action" onClick={handleDownload} title="Download photo" aria-label="Download photo">
              <DownloadIcon />
            </button>
            <button type="button" className="reg-photo-action reg-photo-action--danger" onClick={handleRemove} title="Remove photo" aria-label="Remove photo">
              <XIcon />
            </button>
          </>
        )}
      </div>

      <Modal isOpen={previewOpen} onClose={() => setPreviewOpen(false)} title="Employee Photo" size="lg">
        <div className="reg-photo-preview-modal">
          <img src={photo || ''} alt="Employee" />
        </div>
      </Modal>
    </div>
  );
}

function PersonalTab({ personal, setPersonal, errors, setErrors, photo, setPhoto, photoRef, variant }) {
  const { user } = useAuth();

  const setP = (field, val) => {
    setPersonal(p => ({ ...p, [field]: val }));
    if (errors && errors[field] && setErrors) setErrors(e => { const n = { ...e }; delete n[field]; return n; });
  };

  const handlePhoto = (e) => {
    const f = e.target.files[0];
    if (f) { setP('employeePhoto', f); setPhoto(URL.createObjectURL(f)); }
  };

  useEffect(() => {
    if (photo) return;
    const empPhoto = personal.employeePhoto;
    if (empPhoto) {
      if (typeof empPhoto === 'string') setPhoto(empPhoto);
      else if (empPhoto instanceof File) setPhoto(URL.createObjectURL(empPhoto));
    } else if (user?.photo) {
      setPhoto(user.photo);
    }
  }, [photo, personal.employeePhoto, user, setPhoto]);

  return (
    <>
      {variant === 'profile' ? (
        <div className="leave-form-section">
          <h4 className="leave-form-section-title">Personal Details</h4>
          <div className="leave-form-row reg-personal-photo-grid">
            <PhotoFrame photo={photo} setPhoto={setPhoto} setPersonal={setPersonal} photoRef={photoRef} onChange={handlePhoto} />
            <FG label="First Name" error={errors.firstName} req><input className="form-input" value={personal.firstName} onChange={e => setP('firstName', e.target.value)} placeholder="Enter first name" /></FG>
            <FG label="Middle Name"><input className="form-input" value={personal.middleName} onChange={e => setP('middleName', e.target.value)} placeholder="Enter middle name" /></FG>
            <FG label="Last Name" error={errors.lastName} req><input className="form-input" value={personal.lastName} onChange={e => setP('lastName', e.target.value)} placeholder="Enter last name" /></FG>
            <FG label="Date of Birth" error={errors.dateOfBirth} req><input type="date" className="form-input" value={personal.dateOfBirth} onChange={e => setP('dateOfBirth', e.target.value)} /></FG>
            <FG label="Gender" error={errors.gender} req>
              <select className="form-input form-select" value={personal.gender} onChange={e => setP('gender', e.target.value)}>
                <option value="">Select Gender</option>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </FG>
            <FG label="Marital Status">
              <select className="form-input form-select" value={personal.maritalStatus} onChange={e => setP('maritalStatus', e.target.value)}>
                <option value="">Select Status</option>{MARITAL.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </FG>
            <FG label="Nationality"><input className="form-input" value={personal.nationality} onChange={e => setP('nationality', e.target.value)} placeholder="e.g. Tanzanian" /></FG>
          </div>
        </div>
      ) : (
        <>
          <div className="leave-form-section">
            <h4 className="leave-form-section-title">Employee Photo</h4>
            <div className="reg-photo-section">
              <div className="reg-photo-preview">
                {photo ? (<img src={photo} alt="Preview" />) : (
                  <div className="reg-photo-placeholder">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <span>Upload Photo</span>
                  </div>
                )}
              </div>
              <div className="reg-photo-actions">
                <input type="file" ref={photoRef} accept="image/*" className="file-upload-input" onChange={handlePhoto} />
                <button type="button" className="btn btn-secondary" onClick={() => photoRef.current?.click()}>Choose Photo</button>
                <p className="reg-photo-hint">JPG, PNG (max 2MB)</p>
              </div>
            </div>
          </div>

          <div className="leave-form-section">
            <h4 className="leave-form-section-title">Personal Details</h4>
            <div className="leave-form-row">
              <FG label="First Name" error={errors.firstName} req><input className="form-input" value={personal.firstName} onChange={e => setP('firstName', e.target.value)} placeholder="Enter first name" /></FG>
              <FG label="Middle Name"><input className="form-input" value={personal.middleName} onChange={e => setP('middleName', e.target.value)} placeholder="Enter middle name" /></FG>
              <FG label="Last Name" error={errors.lastName} req><input className="form-input" value={personal.lastName} onChange={e => setP('lastName', e.target.value)} placeholder="Enter last name" /></FG>
              <FG label="Gender" error={errors.gender} req>
                <select className="form-input form-select" value={personal.gender} onChange={e => setP('gender', e.target.value)}>
                  <option value="">Select Gender</option>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </FG>
            </div>
            <div className="leave-form-row">
              <FG label="Date of Birth" error={errors.dateOfBirth} req><input type="date" className="form-input" value={personal.dateOfBirth} onChange={e => setP('dateOfBirth', e.target.value)} /></FG>
              <FG label="Marital Status">
                <select className="form-input form-select" value={personal.maritalStatus} onChange={e => setP('maritalStatus', e.target.value)}>
                  <option value="">Select Status</option>{MARITAL.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </FG>
              <FG label="Nationality"><input className="form-input" value={personal.nationality} onChange={e => setP('nationality', e.target.value)} placeholder="e.g. Tanzanian" /></FG>
            </div>
          </div>
        </>
      )}

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Identification Details</h4>
        <div className="leave-form-row">
          <FG label="ID Type" error={errors.idType} req>
            <select className="form-input form-select" value={personal.idType} onChange={e => setP('idType', e.target.value)}>
              <option value="">Select ID Type</option>{ID_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FG>
          <FG label="ID Number" error={errors.idNumber} req><input className="form-input" value={personal.idNumber} onChange={e => setP('idNumber', e.target.value)} placeholder="Enter ID number" /></FG>
        </div>
      </div>

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Employment Details</h4>
        <div className="leave-form-row">
          <FG label="Employee ID" error={errors.employeeId} req><input className="form-input" value={personal.employeeId} onChange={e => setP('employeeId', e.target.value)} placeholder="e.g. EMP-2024-001" /></FG>
          <FG label="Check Number" error={errors.checkNumber} req><input className="form-input" value={personal.checkNumber} onChange={e => setP('checkNumber', e.target.value)} placeholder="Enter check number" /></FG>
          <FG label="Department" error={errors.department} req><input className="form-input" value={personal.department} onChange={e => setP('department', e.target.value)} placeholder="Enter department" /></FG>
          <FG label="Designation"><input className="form-input" value={personal.designation} onChange={e => setP('designation', e.target.value)} placeholder="Enter designation" /></FG>
        </div>
        <div className="leave-form-row">
          <FG label="Grade / Scale"><input className="form-input" value={personal.grade} onChange={e => setP('grade', e.target.value)} placeholder="e.g. Grade III" /></FG>
          <FG label="Employment Type">
            <select className="form-input form-select" value={personal.employmentType} onChange={e => setP('employmentType', e.target.value)}>
              {EMP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </FG>
          <FG label="Date of First Appointment"><input type="date" className="form-input" value={personal.dateOfFirstAppointment} onChange={e => setP('dateOfFirstAppointment', e.target.value)} /></FG>
          <FG label="Date of Current Appointment"><input type="date" className="form-input" value={personal.dateOfCurrentAppointment} onChange={e => setP('dateOfCurrentAppointment', e.target.value)} /></FG>
        </div>
      </div>
    </>
  );
}

export default PersonalTab;
