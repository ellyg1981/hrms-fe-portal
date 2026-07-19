import React from 'react';

function SubmitTab({ personal, contact, onSubmit, submitting, declared }) {
  const summary = [
    { label: 'Full Name', value: [personal.firstName, personal.middleName, personal.lastName].filter(Boolean).join(' ') || '—' },
    { label: 'Employee ID', value: personal.employeeId || '—' },
    { label: 'Check Number', value: personal.checkNumber || '—' },
    { label: 'Department', value: personal.department || '—' },
    { label: 'Designation', value: personal.designation || '—' },
    { label: 'Phone', value: contact.phone || '—' },
    { label: 'Email', value: contact.email || '—' },
    { label: 'Employment Type', value: personal.employmentType || '—' },
  ];

  return (
    <div className="leave-form-section">
      <h4 className="leave-form-section-title">Review and Submit</h4>
      <p className="leave-form-hint">
        Please review the summary below. Ensure all information is correct before submitting your profile update request.
      </p>

      <div className="reg-submit-summary">
        {summary.map((item, i) => (
          <div key={i} className="reg-submit-summary-item">
            <span className="reg-history-detail-label">{item.label}</span>
            <span className="reg-history-detail-value">{item.value}</span>
          </div>
        ))}
      </div>

      {!declared && (
        <div className="reg-submit-warning">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          <span>Please complete the Declaration tab before submitting.</span>
        </div>
      )}

      <div className="reg-submit-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={onSubmit}
          disabled={submitting || !declared}
        >
          {submitting ? 'Submitting...' : 'Submit Update Request'}
        </button>
      </div>
    </div>
  );
}

export default SubmitTab;
