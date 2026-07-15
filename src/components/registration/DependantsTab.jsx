import React, { useState, useRef } from 'react';

const GENDERS = ['Male','Female'];
const RELS = ['Spouse','Child','Parent','Sibling','Relative','Other'];

const FG = ({ label, children, error, req }) => (
  <div className={`form-group${error ? ' form-group--error' : ''}`}>
    <label className="form-label">{label}{req && <span className="reg-required"> *</span>}</label>
    {children}
    {error && <span className="reg-form-error">{error}</span>}
  </div>
);

const update = (list, setList, id, field, val) => setList(list.map(i => i.id === id ? { ...i, [field]: val } : i));
const remove = (list, setList, id) => setList(list.filter(i => i.id !== id));
const add = (setList, template) => setList(prev => [...prev, template()]);
const makeId = () => Date.now() + Math.floor(Math.random() * 1000);

function DependantsTab({ dependants, setDependants }) {
  const [pendingDepId, setPendingDepId] = useState(null);
  const fileRef = useRef(null);

  const handleDepAttachments = (e) => {
    if (!pendingDepId) return;
    const files = Array.from(e.target.files);
    const newFiles = files.map(f => ({ id: Date.now() + Math.random(), file: f, name: f.name, size: f.size, type: f.type }));
    const dep = dependants.find(d => d.id === pendingDepId);
    if (dep) {
      update(dependants, setDependants, pendingDepId, 'attachments', [...(dep.attachments || []), ...newFiles]);
    }
    setPendingDepId(null);
    e.target.value = '';
  };

  const viewAtt = (att) => { const url = URL.createObjectURL(att.file); window.open(url, '_blank'); };
  const removeAtt = (depId, attId) => {
    const dep = dependants.find(d => d.id === depId);
    if (dep) {
      update(dependants, setDependants, depId, 'attachments', (dep.attachments || []).filter(a => a.id !== attId));
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="leave-form-section">
      <h4 className="leave-form-section-title">Dependants</h4>
      <input type="file" ref={fileRef} className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleDepAttachments} />
      {dependants.map(item => (
        <div key={item.id} className="reg-dynamic-row reg-dynamic-row--bordered">
          <div className="leave-form-row">
            <FG label="Full Name"><input className="form-input" value={item.fullName} onChange={e => update(dependants, setDependants, item.id, 'fullName', e.target.value)} placeholder="Enter full name" /></FG>
            <FG label="Relationship">
              <select className="form-input form-select" value={item.relationship} onChange={e => update(dependants, setDependants, item.id, 'relationship', e.target.value)}>
                <option value="">Select</option>{RELS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FG>
            <FG label="Gender">
              <select className="form-input form-select" value={item.gender} onChange={e => update(dependants, setDependants, item.id, 'gender', e.target.value)}>
                <option value="">Select</option>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </FG>
          </div>
          <div className="leave-form-row">
            <FG label="Date of Birth"><input type="date" className="form-input" value={item.dateOfBirth} onChange={e => update(dependants, setDependants, item.id, 'dateOfBirth', e.target.value)} /></FG>
            <FG label="Occupation"><input className="form-input" value={item.occupation} onChange={e => update(dependants, setDependants, item.id, 'occupation', e.target.value)} placeholder="Enter occupation" /></FG>
            <FG label="School (if applicable)"><input className="form-input" value={item.school} onChange={e => update(dependants, setDependants, item.id, 'school', e.target.value)} placeholder="Enter school name" /></FG>
          </div>
          <div className="leave-form-row" style={{ marginTop: 'var(--space-4)', justifyContent: 'flex-end' }}>
            <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
              {dependants.length > 1 && <button type="button" className="reg-btn-remove" onClick={() => remove(dependants, setDependants, item.id)}>Remove Dependant</button>}
            </div>
          </div>
          <div className="leave-form-row leave-form-row--full" style={{ marginTop: 'var(--space-4)' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 0 }}>
              <h5 className="leave-form-section-title">Supporting Documents</h5>
              <p className="leave-form-hint">Upload birth certificate, marriage certificate, or other supporting documents. Allowed: PDF, JPG, PNG (max 10MB each).</p>
              <button type="button" className="btn btn-secondary" onClick={() => { setPendingDepId(item.id); fileRef.current?.click(); }}>Add Attachment</button>
              {(item.attachments || []).length > 0 && (
                <div className="reg-attachments-list">
                  {(item.attachments || []).map(att => (
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
                        <button type="button" className="reg-attachment-btn reg-attachment-btn--danger" onClick={() => removeAtt(item.id, att.id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="reg-btn-add" onClick={() => add(setDependants, () => ({ id: makeId(), fullName: '', relationship: '', gender: '', dateOfBirth: '', occupation: '', school: '', attachments: [] }))}>+ Add Dependant</button>
    </div>
  );
}

export default DependantsTab;
