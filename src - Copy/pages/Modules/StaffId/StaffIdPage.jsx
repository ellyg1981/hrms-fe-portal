import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import './StaffIdPage.css';

const ID_CARD = {
  name: 'John Doe',
  checkNumber: 'CH-78432',
  department: 'Immigration Services',
  designation: 'Senior Immigration Officer',
  issued: '2025-01-15',
  expires: '2030-01-15',
  status: 'Active',
  photo: null,
};

const STATUS_STYLE = {
  Active:    { background: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' },
  Expired:   { background: '#FEF2F2', color: '#991B1B', border: '1px solid #FCA5A5' },
  Pending:   { background: '#FFFBEB', color: '#92400E', border: '1px solid #FDE68A' },
  Approved:  { background: '#EAF4FF', color: '#0B2E59', border: '1px solid #D9E2EC' },
};

function StaffIdPage() {
  const [showReplaceModal, setShowReplaceModal] = useState(false);
  const card = ID_CARD;

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar title="Staff ID Card" subtitle="View and manage your official identification" color="#0B2E59" />

        <div className="staffid-grid">
          <Card className="id-card-visual" hover={false}>
            <div className="id-card-header">
              <div className="id-card-logo">TZ</div>
              <div className="id-card-org">
                <div className="id-card-org-name">United Republic of Tanzania</div>
                <div className="id-card-org-sub">Immigration Services Department</div>
              </div>
            </div>
            <div className="id-card-body">
              <div className="id-card-photo">
                {card.photo ? <img src={card.photo} alt="Staff" /> : <span className="id-card-photo-placeholder">JD</span>}
              </div>
              <div className="id-card-details">
                <div className="id-card-name">{card.name}</div>
                <div className="id-card-designation">{card.designation}</div>
                <div className="id-card-meta">
                  <span>Check No: {card.checkNumber}</span>
                  <span>Dept: {card.department}</span>
                </div>
              </div>
            </div>
            <div className="id-card-footer">
              <span>Issued: {card.issued}</span>
              <span>Expires: {card.expires}</span>
              <span className="id-card-status" style={STATUS_STYLE[card.status]}>{card.status}</span>
            </div>
          </Card>

          <Card className="id-card-info" hover={false}>
            <h3 className="id-info-title">ID Information</h3>
            <div className="id-info-list">
              <div className="id-info-row"><span className="id-info-label">Full Name</span><span className="id-info-value">{card.name}</span></div>
              <div className="id-info-row"><span className="id-info-label">Check Number</span><span className="id-info-value">{card.checkNumber}</span></div>
              <div className="id-info-row"><span className="id-info-label">Department</span><span className="id-info-value">{card.department}</span></div>
              <div className="id-info-row"><span className="id-info-label">Designation</span><span className="id-info-value">{card.designation}</span></div>
              <div className="id-info-row"><span className="id-info-label">Date Issued</span><span className="id-info-value">{card.issued}</span></div>
              <div className="id-info-row"><span className="id-info-label">Expiry Date</span><span className="id-info-value">{card.expires}</span></div>
              <div className="id-info-row"><span className="id-info-label">Status</span><span className="id-info-value"><span className="badge" style={STATUS_STYLE[card.status]}>{card.status}</span></span></div>
            </div>
            <div className="id-info-actions">
              <button className="btn btn-secondary">Download Card</button>
              <button className="btn btn-primary" onClick={() => setShowReplaceModal(true)}>Request Replacement</button>
            </div>
          </Card>
        </div>

        {showReplaceModal && (
          <div className="modal-overlay" onClick={() => setShowReplaceModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3>Request ID Replacement</h3><button className="modal-close" onClick={() => setShowReplaceModal(false)}>&times;</button></div>
              <div className="modal-body">
                <p style={{ marginBottom: 16, fontSize: 14, color: 'var(--color-text-secondary)' }}>Select a reason for replacement:</p>
                {['Lost ID Card', 'Damaged ID Card', 'Photo Update', 'Information Change', 'Stolen ID Card'].map(reason => (
                  <label key={reason} className="replace-reason">
                    <input type="radio" name="reason" value={reason} />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowReplaceModal(false)}>Cancel</button>
                <button className="btn btn-primary">Submit Request</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StaffIdPage;
