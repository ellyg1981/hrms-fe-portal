import React from 'react';

const GENDERS = ['Male','Female'];
const KIN_RELS = ['Spouse','Parent','Sibling','Child','Relative','Friend','Other'];

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

function NextOfKinTab({ nextOfKin, setNextOfKin }) {
  return (
    <div className="leave-form-section">
      <h4 className="leave-form-section-title">Next of Kin</h4>
      {nextOfKin.map(item => (
        <div key={item.id} className="reg-dynamic-row reg-dynamic-row--bordered">
          <div className="leave-form-row">
            <FG label="Full Name"><input className="form-input" value={item.fullName} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'fullName', e.target.value)} placeholder="Enter full name" /></FG>
            <FG label="Relationship">
              <select className="form-input form-select" value={item.relationship} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'relationship', e.target.value)}>
                <option value="">Select</option>{KIN_RELS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </FG>
            <FG label="Date of Birth"><input type="date" className="form-input" value={item.dateOfBirth} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'dateOfBirth', e.target.value)} /></FG>
            <FG label="Gender">
              <select className="form-input form-select" value={item.gender} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'gender', e.target.value)}>
                <option value="">Select</option>{GENDERS.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </FG>
          </div>
          <div className="leave-form-row">
            <FG label="Occupation"><input className="form-input" value={item.occupation} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'occupation', e.target.value)} placeholder="Enter occupation" /></FG>
            <FG label="Phone Number"><input type="tel" className="form-input" value={item.phone} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'phone', e.target.value)} placeholder="+255 7XX XXX XXX" /></FG>
            <FG label="Email Address"><input type="email" className="form-input" value={item.email} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'email', e.target.value)} placeholder="email@example.com" /></FG>
            <FG label="Physical Address"><input className="form-input" value={item.physicalAddress} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'physicalAddress', e.target.value)} placeholder="Enter physical address" /></FG>
          </div>
          <div className="leave-form-row">
            <FG label="Postal Address"><input className="form-input" value={item.postalAddress} onChange={e => update(nextOfKin, setNextOfKin, item.id, 'postalAddress', e.target.value)} placeholder="P.O. Box XXX" /></FG>
            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              {nextOfKin.length > 1 && <button type="button" className="reg-btn-remove" style={{ width: '100%', height: '48px' }} onClick={() => remove(nextOfKin, setNextOfKin, item.id)}>Remove Next of Kin</button>}
            </div>
          </div>
        </div>
      ))}
      <button type="button" className="reg-btn-add" onClick={() => add(setNextOfKin, () => ({ id: makeId(), fullName: '', relationship: '', dateOfBirth: '', gender: '', occupation: '', phone: '', email: '', physicalAddress: '', postalAddress: '' }))}>+ Add Next of Kin</button>
    </div>
  );
}

export default NextOfKinTab;
