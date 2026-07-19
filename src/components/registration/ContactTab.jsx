import React from 'react';
import RegionSelect from '../common/location/RegionSelect';
import DistrictSelect from '../common/location/DistrictSelect';
import WardSelect from '../common/location/WardSelect';

const FG = ({ label, children, error, req }) => (
  <div className={`form-group${error ? ' form-group--error' : ''}`}>
    <label className="form-label">{label}{req && <span className="reg-required"> *</span>}</label>
    {children}
    {error && <span className="reg-form-error">{error}</span>}
  </div>
);

const INIT_LOC = { region: '', district: '', ward: '' };

function ContactTab({ contact, setContact, physAddr, setPhysAddr, workLoc, setWorkLoc, domicile, setDomicile, attachments, setAttachments, fileRef, errors }) {
  const handleAttachments = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(f => ({ id: Date.now() + Math.random(), file: f, name: f.name, size: f.size, type: f.type }));
    setAttachments(prev => [...prev, ...newFiles]);
  };

  const viewAtt = (a) => { const url = URL.createObjectURL(a.file); window.open(url, '_blank'); };
  const removeAtt = (id) => setAttachments(prev => prev.filter(a => a.id !== id));

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Contact Information</h4>
        <div className="leave-form-row">
          <FG label="Phone Number" error={errors.phone} req><input type="tel" className="form-input" value={contact.phone} onChange={e => setContact(c => ({ ...c, phone: e.target.value }))} placeholder="+255 7XX XXX XXX" /></FG>
          <FG label="Email Address" error={errors.email} req><input type="email" className="form-input" value={contact.email} onChange={e => setContact(c => ({ ...c, email: e.target.value }))} placeholder="email@example.com" /></FG>
          <FG label="Alternative Phone"><input type="tel" className="form-input" value={contact.altPhone} onChange={e => setContact(c => ({ ...c, altPhone: e.target.value }))} placeholder="+255 7XX XXX XXX" /></FG>
        </div>
      </div>

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Physical Address Information</h4>
        <div className="leave-form-row">
          <FG label="Region" error={errors.physRegion} req>
            <RegionSelect value={physAddr.region} onChange={val => setPhysAddr({ ...INIT_LOC, region: val, village: physAddr.village, street: physAddr.street, house: physAddr.house })} placeholder="Select Region" />
          </FG>
          <FG label="District" error={errors.physDistrict} req>
            <DistrictSelect value={physAddr.district} region={physAddr.region} onChange={val => setPhysAddr(p => ({ ...p, district: val, ward: '' }))} placeholder="Select District" />
          </FG>
          <FG label="Ward">
            <WardSelect value={physAddr.ward} district={physAddr.district} onChange={val => setPhysAddr(p => ({ ...p, ward: val }))} placeholder="Select Ward" />
          </FG>
          <FG label="Village / Street"><input className="form-input" value={physAddr.village} onChange={e => setPhysAddr(p => ({ ...p, village: e.target.value }))} placeholder="e.g. Uhuru Street" /></FG>
        </div>
        <div className="leave-form-row">
          <FG label="Street / Road"><input className="form-input" value={physAddr.street} onChange={e => setPhysAddr(p => ({ ...p, street: e.target.value }))} placeholder="Enter street name" /></FG>
          <FG label="House Number"><input className="form-input" value={physAddr.house} onChange={e => setPhysAddr(p => ({ ...p, house: e.target.value }))} placeholder="e.g. Plot 123" /></FG>
        </div>
      </div>

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Work Location</h4>
        <div className="leave-form-row">
          <FG label="Region"><RegionSelect value={workLoc.region} onChange={val => setWorkLoc({ ...INIT_LOC, region: val, office: workLoc.office, department: workLoc.department })} placeholder="Select Region" /></FG>
          <FG label="District"><DistrictSelect value={workLoc.district} region={workLoc.region} onChange={val => setWorkLoc(p => ({ ...p, district: val, ward: '' }))} placeholder="Select District" /></FG>
          <FG label="Ward"><WardSelect value={workLoc.ward} district={workLoc.district} onChange={val => setWorkLoc(p => ({ ...p, ward: val }))} placeholder="Select Ward" /></FG>
          <FG label="Office / Building"><input className="form-input" value={workLoc.office} onChange={e => setWorkLoc(p => ({ ...p, office: e.target.value }))} placeholder="Enter office" /></FG>
        </div>
      </div>

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Domicile Information</h4>
        <div className="leave-form-row">
          <FG label="Region"><RegionSelect value={domicile.region} onChange={val => setDomicile({ ...INIT_LOC, region: val, village: domicile.village, street: domicile.street, house: domicile.house })} placeholder="Select Region" /></FG>
          <FG label="District"><DistrictSelect value={domicile.district} region={domicile.region} onChange={val => setDomicile(p => ({ ...p, district: val, ward: '' }))} placeholder="Select District" /></FG>
          <FG label="Ward"><WardSelect value={domicile.ward} district={domicile.district} onChange={val => setDomicile(p => ({ ...p, ward: val }))} placeholder="Select Ward" /></FG>
          <FG label="Village / Street"><input className="form-input" value={domicile.village} onChange={e => setDomicile(p => ({ ...p, village: e.target.value }))} placeholder="e.g. Uhuru Street" /></FG>
        </div>
        <div className="leave-form-row">
          <FG label="Street / Road"><input className="form-input" value={domicile.street} onChange={e => setDomicile(p => ({ ...p, street: e.target.value }))} placeholder="Enter street name" /></FG>
          <FG label="House Number"><input className="form-input" value={domicile.house} onChange={e => setDomicile(p => ({ ...p, house: e.target.value }))} placeholder="e.g. Plot 123" /></FG>
        </div>
      </div>

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Supporting Documents</h4>
        <input type="file" ref={fileRef} className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleAttachments} />
        <div className="leave-form-row">
          <div className="form-group">
            <label className="form-label">Attachments</label>
            <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()}>Add Attachment</button>
          </div>
        </div>
        {attachments.length > 0 && (
          <div className="reg-attachments-list" style={{ marginTop: 'var(--space-3)' }}>
            {attachments.map(att => (
              <div key={att.id} className="reg-attachment-item">
                <div className="reg-attachment-icon">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="reg-attachment-info">
                  <span className="reg-attachment-name">{att.name}</span>
                  <span className="reg-attachment-size">{formatSize(att.size)}</span>
                </div>
                <div className="reg-attachment-actions">
                  <button type="button" className="reg-attachment-btn" onClick={() => viewAtt(att)}>View</button>
                  <button type="button" className="reg-attachment-btn reg-attachment-btn--danger" onClick={() => removeAtt(att.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default ContactTab;
