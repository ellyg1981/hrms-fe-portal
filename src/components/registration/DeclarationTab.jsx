import React, { useState } from 'react';

const dv = (val) => (val && String(val).trim()) ? val : '—';

function SummarySection({ title, items }) {
  return (
    <div className="reg-decl-summary-section">
      <h5 className="reg-decl-summary-title">{title}</h5>
      <div className="reg-decl-summary-grid">
        {items.map((item, i) => (
          <div key={i} className="reg-decl-summary-item">
            <span className="reg-decl-summary-label">{item.label}</span>
            <span className="reg-decl-summary-value">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeclarationTab({ personal, contact, physAddr, workLoc, basicEdu, higherEdu, profQuals, dependants, nextOfKin, attachments, declared, setDeclared, onSubmit, onSaveDraft, submitting }) {
  const [signature, setSignature] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fullName = [personal?.firstName, personal?.middleName, personal?.lastName].filter(Boolean).join(' ') || '—';

  const handleCheckbox = (e) => {
    const checked = e.target.checked && signature.trim() !== '';
    if (setDeclared) setDeclared(checked);
  };

  const handleSignature = (e) => {
    setSignature(e.target.value);
    if (setDeclared) setDeclared(e.target.value.trim() !== '' && document.getElementById('decl-checkbox')?.checked);
  };

  const allEdu = [
    ...(basicEdu || []).map(e => ({ qualification: e.level, institution: e.institution, year: e.year, attachments: e.attachments })),
    ...(higherEdu || []).map(e => ({ qualification: e.degree, institution: e.institution, year: e.year, attachments: e.attachments })),
    ...(profQuals || []).map(e => ({ qualification: e.qualification, institution: e.institution, year: e.year, attachments: e.attachments })),
  ];

  return (
    <div className="reg-declaration-wrap">
      <h4 className="leave-form-section-title">Profile Summary</h4>
      <p className="leave-form-hint">Review all information below before accepting the declaration and submitting your update request.</p>

      <SummarySection
        title="Personal Information"
        items={[
          { label: 'Employee Name', value: dv(fullName) },
          { label: 'National ID (NIN)', value: dv(personal?.idNumber) },
          { label: 'Check Number', value: dv(personal?.checkNumber) },
          { label: 'Employee ID', value: dv(personal?.employeeId) },
          { label: 'Date of Birth', value: dv(personal?.dateOfBirth) },
          { label: 'Gender', value: dv(personal?.gender) },
          { label: 'Marital Status', value: dv(personal?.maritalStatus) },
          { label: 'Nationality', value: dv(personal?.nationality) },
        ]}
      />

      <SummarySection
        title="Working Information"
        items={[
          { label: 'Department', value: dv(personal?.department) },
          { label: 'Designation', value: dv(personal?.designation) },
          { label: 'Grade / Scale', value: dv(personal?.grade) },
          { label: 'Employment Type', value: dv(personal?.employmentType) },
          { label: 'Working Region', value: dv(workLoc?.region) },
          { label: 'Working Station', value: dv(workLoc?.district) },
          { label: 'Date of First Appointment', value: dv(personal?.dateOfFirstAppointment) },
          { label: 'Date of Current Appointment', value: dv(personal?.dateOfCurrentAppointment) },
        ]}
      />

      <SummarySection
        title="Education Summary"
        items={allEdu.length > 0 ? allEdu.map((e, i) => ({
          label: `Qualification ${i + 1}`,
          value: `${dv(e.qualification)} — ${dv(e.institution)} (${dv(e.year)})${e.attachments?.length ? ` | ${e.attachments.length} certificate(s)` : ''}`,
        })) : [{ label: 'Education', value: 'No education records' }]}
      />

      <SummarySection
        title="Dependants Summary"
        items={(dependants || []).length > 0 ? dependants.map((d, i) => ({
          label: `Dependant ${i + 1}`,
          value: `${dv(d.fullName)} (${dv(d.relationship)}) — DOB: ${dv(d.dateOfBirth)}${d.attachments?.length ? ` | ${d.attachments.length} document(s)` : ''}`,
        })) : [{ label: 'Dependants', value: 'No dependants recorded' }]}
      />

      <SummarySection
        title="Next of Kin Summary"
        items={(nextOfKin || []).length > 0 ? nextOfKin.map((k, i) => ({
          label: `Kin ${i + 1}`,
          value: `${dv(k.fullName)} (${dv(k.relationship)}) — ${dv(k.phone)} | ${dv(k.physicalAddress)}`,
        })) : [{ label: 'Next of Kin', value: 'No next of kin recorded' }]}
      />

      <SummarySection
        title="Contact Information"
        items={[
          { label: 'Mobile Number', value: dv(contact?.phone) },
          { label: 'Email Address', value: dv(contact?.email) },
          { label: 'Alt Phone', value: dv(contact?.altPhone) },
          { label: 'Physical Address', value: dv(physAddr?.region ? `${physAddr.region}, ${physAddr.district}, ${physAddr.ward}` : '') },
          { label: 'Supporting Documents', value: (attachments?.length || 0) + ' document(s)' },
        ]}
      />

      <div className="reg-decl-divider" />

      <div className="leave-form-section">
        <h4 className="leave-form-section-title">Declaration</h4>
        <p className="leave-form-hint">
          I hereby declare that the information provided in this profile update request is true, accurate, and complete
          to the best of my knowledge. I understand that any false or misleading information may result in disciplinary
          action in accordance with HRMS policies.
        </p>

        <div className="reg-declaration-checkbox">
          <label className="reg-declaration-label">
            <input
              id="decl-checkbox"
              type="checkbox"
              onChange={handleCheckbox}
            />
            <span>I confirm that all information provided in my profile update request is true and accurate.</span>
          </label>
        </div>

        <div className="leave-form-row">
          <div className="form-group">
            <label className="form-label">Full Name (Signature) <span className="reg-required">*</span></label>
            <input
              className="form-input"
              value={signature}
              onChange={handleSignature}
              placeholder="Type your full name as signature"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-input"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        {!declared && (
          <div className="reg-submit-warning">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>Please check the declaration box and type your signature to enable submission.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeclarationTab;
