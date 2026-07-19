import React, { useState, useRef } from 'react';

const FG = ({ label, children, error, req }) => (
  <div className={`form-group${error ? ' form-group--error' : ''}`}>
    <label className="form-label">{label}{req && <span className="reg-required"> *</span>}</label>
    {children}
    {error && <span className="reg-form-error">{error}</span>}
  </div>
);

const updateRow = (list, setList, id, field, val) => setList(list.map(i => i.id === id ? { ...i, [field]: val } : i));
const removeRow = (list, setList, id) => setList(list.filter(i => i.id !== id));
const addRow = (setList, template) => setList(prev => [...prev, template()]);

const makeId = () => Date.now() + Math.floor(Math.random() * 1000);

const formatSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

const viewAtt = (att) => { const url = URL.createObjectURL(att.file); window.open(url, '_blank'); };

function EducationTab({ basicEdu, setBasicEdu, higherEdu, setHigherEdu, profQuals, setProfQuals }) {
  const [target, setTarget] = useState(null);
  const fileRef = useRef(null);

  const handleFileChange = (e) => {
    if (!target) return;
    const files = Array.from(e.target.files).map(f => ({ id: Date.now() + Math.random(), file: f, name: f.name, size: f.size, type: f.type }));
    const { section, id } = target;
    if (section === 'basic') {
      const row = basicEdu.find(r => r.id === id);
      if (row) updateRow(basicEdu, setBasicEdu, id, 'attachments', [...(row.attachments || []), ...files]);
    } else if (section === 'higher') {
      const row = higherEdu.find(r => r.id === id);
      if (row) updateRow(higherEdu, setHigherEdu, id, 'attachments', [...(row.attachments || []), ...files]);
    } else if (section === 'prof') {
      const row = profQuals.find(r => r.id === id);
      if (row) updateRow(profQuals, setProfQuals, id, 'attachments', [...(row.attachments || []), ...files]);
    }
    setTarget(null);
    e.target.value = '';
  };

  const removeAtt = (section, rowId, attId) => {
    if (section === 'basic') {
      const row = basicEdu.find(r => r.id === rowId);
      if (row) updateRow(basicEdu, setBasicEdu, rowId, 'attachments', (row.attachments || []).filter(a => a.id !== attId));
    } else if (section === 'higher') {
      const row = higherEdu.find(r => r.id === rowId);
      if (row) updateRow(higherEdu, setHigherEdu, rowId, 'attachments', (row.attachments || []).filter(a => a.id !== attId));
    } else if (section === 'prof') {
      const row = profQuals.find(r => r.id === rowId);
      if (row) updateRow(profQuals, setProfQuals, rowId, 'attachments', (row.attachments || []).filter(a => a.id !== attId));
    }
  };

  const renderAttachments = (section, row) => {
    const atts = row.attachments || [];
    if (atts.length === 0) return null;
    return (
      <div className="reg-attachments-list">
        {atts.map(att => (
          <div key={att.id} className="reg-attachment-item">
            <div className="reg-attachment-icon">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
            </div>
            <div className="reg-attachment-info">
              <span className="reg-attachment-name">{att.name}</span>
              <span className="reg-attachment-size">{formatSize(att.size)}</span>
            </div>
            <div className="reg-attachment-actions">
              <button type="button" className="reg-attachment-btn" onClick={() => viewAtt(att)}>View</button>
              <button type="button" className="reg-attachment-btn reg-attachment-btn--danger" onClick={() => removeAtt(section, row.id, att.id)}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const triggerUpload = (section, id) => { setTarget({ section, id }); fileRef.current?.click(); };

  return (
    <>
      <input type="file" ref={fileRef} className="file-upload-input" accept=".pdf,.jpg,.jpeg,.png" multiple onChange={handleFileChange} />

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Basic Academic Background</h4>
        {basicEdu.map(item => (
          <div key={item.id} className="reg-dynamic-row">
            <div className="leave-form-row">
              <FG label="Education Level"><input className="form-input" value={item.level} onChange={e => updateRow(basicEdu, setBasicEdu, item.id, 'level', e.target.value)} placeholder="e.g. Primary" /></FG>
              <FG label="Institution"><input className="form-input" value={item.institution} onChange={e => updateRow(basicEdu, setBasicEdu, item.id, 'institution', e.target.value)} placeholder="Enter institution" /></FG>
              <FG label="Year Completed"><input type="number" className="form-input" value={item.year} onChange={e => updateRow(basicEdu, setBasicEdu, item.id, 'year', e.target.value)} placeholder="e.g. 2010" /></FG>
              <div className="form-group">
                <label className="form-label">Attachments</label>
                <button type="button" className="btn btn-secondary" onClick={() => triggerUpload('basic', item.id)}>Upload Certificate</button>
                {basicEdu.length > 1 && <button type="button" className="reg-btn-remove" style={{ marginTop: 'var(--space-2)' }} onClick={() => removeRow(basicEdu, setBasicEdu, item.id)}>Remove</button>}
              </div>
            </div>
            {renderAttachments('basic', item)}
          </div>
        ))}
        <button type="button" className="reg-btn-add" style={{ marginTop: '8px' }} onClick={() => addRow(setBasicEdu, () => ({ id: makeId(), level: '', institution: '', year: '', attachments: [] }))}>+ Add Academic Record</button>
      </div>

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Higher Education</h4>
        {higherEdu.map(item => (
          <div key={item.id} className="reg-dynamic-row">
            <div className="leave-form-row">
              <FG label="Degree / Diploma"><input className="form-input" value={item.degree} onChange={e => updateRow(higherEdu, setHigherEdu, item.id, 'degree', e.target.value)} placeholder="e.g. Bachelor" /></FG>
              <FG label="Institution"><input className="form-input" value={item.institution} onChange={e => updateRow(higherEdu, setHigherEdu, item.id, 'institution', e.target.value)} placeholder="Enter institution" /></FG>
              <FG label="Year Completed"><input type="number" className="form-input" value={item.year} onChange={e => updateRow(higherEdu, setHigherEdu, item.id, 'year', e.target.value)} placeholder="e.g. 2015" /></FG>
              <div className="form-group">
                <label className="form-label">Attachments</label>
                <button type="button" className="btn btn-secondary" onClick={() => triggerUpload('higher', item.id)}>Upload Certificate</button>
                {higherEdu.length > 1 && <button type="button" className="reg-btn-remove" style={{ marginTop: 'var(--space-2)' }} onClick={() => removeRow(higherEdu, setHigherEdu, item.id)}>Remove</button>}
              </div>
            </div>
            {renderAttachments('higher', item)}
          </div>
        ))}
        <button type="button" className="reg-btn-add" style={{ marginTop: '8px' }} onClick={() => addRow(setHigherEdu, () => ({ id: makeId(), degree: '', institution: '', year: '', attachments: [] }))}>+ Add Academic Content</button>
      </div>

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Professional Qualifications</h4>
        {profQuals.map(item => (
          <div key={item.id} className="reg-dynamic-row">
            <div className="leave-form-row">
              <FG label="Qualification"><input className="form-input" value={item.qualification} onChange={e => updateRow(profQuals, setProfQuals, item.id, 'qualification', e.target.value)} placeholder="e.g. CPA" /></FG>
              <FG label="Institution"><input className="form-input" value={item.institution} onChange={e => updateRow(profQuals, setProfQuals, item.id, 'institution', e.target.value)} placeholder="Enter institution" /></FG>
              <FG label="Year Completed"><input type="number" className="form-input" value={item.year} onChange={e => updateRow(profQuals, setProfQuals, item.id, 'year', e.target.value)} placeholder="e.g. 2018" /></FG>
              <div className="form-group">
                <label className="form-label">Attachments</label>
                <button type="button" className="btn btn-secondary" onClick={() => triggerUpload('prof', item.id)}>Upload Certificate</button>
                {profQuals.length > 1 && <button type="button" className="reg-btn-remove" style={{ marginTop: 'var(--space-2)' }} onClick={() => removeRow(profQuals, setProfQuals, item.id)}>Remove</button>}
              </div>
            </div>
            {renderAttachments('prof', item)}
          </div>
        ))}
        <button type="button" className="reg-btn-add" style={{ marginTop: '8px' }} onClick={() => addRow(setProfQuals, () => ({ id: makeId(), qualification: '', institution: '', year: '', attachments: [] }))}>+ Add Professional Qualification</button>
      </div>
    </>
  );
}

export default EducationTab;
