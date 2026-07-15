import React, { useState } from 'react';
import ModuleTitleBar from '../../../components/common/ModuleTitleBar/ModuleTitleBar';
import Card from '../../../components/common/Card/Card';
import LocationGroup from '../../../components/common/location/LocationGroup';
import './ProfilePage.css';

const TABS = [
  { key: 'personal', label: 'Personal Information' },
  { key: 'employment', label: 'Employment Details' },
  { key: 'education', label: 'Education & Certifications' },
  { key: 'documents', label: 'Documents' },
  { key: 'emergency', label: 'Emergency Contacts' },
];

const PROFILE_DATA = {
  personal: {
    fullName: 'John Doe',
    dateOfBirth: '1985-03-15',
    gender: 'Male',
    maritalStatus: 'Married',
    nationality: 'Tanzanian',
    phone: '+255 712 345 678',
    email: 'john.doe@hrms.go.tz',
    address: '123 Uhuru Street, Dar es Salaam',
  },
  employment: {
    employeeId: 'TG-2010-0042',
    department: 'Immigration Services',
    designation: 'Senior Immigration Officer',
    grade: 'Grade II',
    checkNumber: 'CH-78432',
    dateOfJoining: '2010-06-01',
    station: 'Headquarters - Dar es Salaam',
    supervisor: 'Jane Smith',
    contractType: 'Permanent & Pensionable',
  },
  education: [
    { degree: 'BSc Computer Science', institution: 'University of Dar es Salaam', year: '2008' },
    { degree: 'Diploma in Public Administration', institution: 'ESAMI', year: '2012' },
  ],
  documents: [
    { name: 'Appointment Letter', type: 'PDF', date: '2010-06-01' },
    { name: 'Staff ID Card', type: 'PDF', date: '2025-01-15' },
    { name: 'Annual Performance Review 2025', type: 'PDF', date: '2025-12-20' },
  ],
  emergency: [
    { name: 'Mary Doe', relationship: 'Spouse', phone: '+255 723 456 789' },
    { name: 'Peter Doe', relationship: 'Father', phone: '+255 734 567 890' },
  ],
};

function InfoRow({ label, value }) {
  return (
    <div className="info-row">
      <span className="info-label">{label}</span>
      <span className="info-value">{value}</span>
    </div>
  );
}

function ProfilePage() {
  const [activeTab, setActiveTab] = useState('personal');
  const [showEditModal, setShowEditModal] = useState(false);
  const [profileLocation, setProfileLocation] = useState({ region: '', district: '', ward: '' });

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        const p = PROFILE_DATA.personal;
        return (
          <div className="info-grid">
            <InfoRow label="Full Name" value={p.fullName} />
            <InfoRow label="Date of Birth" value={p.dateOfBirth} />
            <InfoRow label="Gender" value={p.gender} />
            <InfoRow label="Marital Status" value={p.maritalStatus} />
            <InfoRow label="Nationality" value={p.nationality} />
            <InfoRow label="Phone" value={p.phone} />
            <InfoRow label="Email" value={p.email} />
            <InfoRow label="Address" value={p.address} />
          </div>
        );
      case 'employment':
        const e = PROFILE_DATA.employment;
        return (
          <div className="info-grid">
            <InfoRow label="Employee ID" value={e.employeeId} />
            <InfoRow label="Department" value={e.department} />
            <InfoRow label="Designation" value={e.designation} />
            <InfoRow label="Grade" value={e.grade} />
            <InfoRow label="Check Number" value={e.checkNumber} />
            <InfoRow label="Date of Joining" value={e.dateOfJoining} />
            <InfoRow label="Station" value={e.station} />
            <InfoRow label="Supervisor" value={e.supervisor} />
            <InfoRow label="Contract Type" value={e.contractType} />
          </div>
        );
      case 'education':
        return (
          <div className="education-list">
            {PROFILE_DATA.education.map((edu, i) => (
              <div key={i} className="education-card">
                <div className="edu-degree">{edu.degree}</div>
                <div className="edu-institution">{edu.institution}</div>
                <div className="edu-year">{edu.year}</div>
              </div>
            ))}
          </div>
        );
      case 'documents':
        return (
          <div className="documents-list">
            {PROFILE_DATA.documents.map((doc, i) => (
              <div key={i} className="document-item">
                <div className="doc-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                </div>
                <div className="doc-info">
                  <div className="doc-name">{doc.name}</div>
                  <div className="doc-meta">{doc.type} &middot; {doc.date}</div>
                </div>
                <button className="btn btn-sm btn-secondary">Download</button>
              </div>
            ))}
          </div>
        );
      case 'emergency':
        return (
          <div className="emergency-list">
            {PROFILE_DATA.emergency.map((contact, i) => (
              <div key={i} className="emergency-card">
                <div className="emergency-avatar">{contact.name.charAt(0)}</div>
                <div className="emergency-info">
                  <div className="emergency-name">{contact.name}</div>
                  <div className="emergency-relationship">{contact.relationship}</div>
                  <div className="emergency-phone">{contact.phone}</div>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="module-content">
      <main className="module-main">
        <ModuleTitleBar
          title="My Profile"
          subtitle="View and manage your personal and employment details"
          color="#0B2E59"
          ctaLabel="Edit Profile"
          onCta={() => setShowEditModal(true)}
          avatar="JD"
        />

        <div className="profile-tabs tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Card hover={false}>
          {renderTabContent()}
        </Card>

        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header"><h3>Edit Profile</h3><button className="modal-close" onClick={() => setShowEditModal(false)}>&times;</button></div>
              <div className="modal-body">
                <div className="leave-form-section">
                  <h4 className="leave-form-section-title">Personal Information</h4>
                  <div className="leave-form-row">
                    <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" defaultValue="John Doe" /></div>
                    <div className="form-group"><label className="form-label">Phone</label><input className="form-input" defaultValue="+255 712 345 678" /></div>
                    <div className="form-group"><label className="form-label">Email</label><input className="form-input" defaultValue="john.doe@hrms.go.tz" /></div>
                  </div>
                </div>
                <div className="leave-form-section">
                  <h4 className="leave-form-section-title">Residential Address</h4>
                  <div className="leave-form-row">
                    <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                      <LocationGroup
                        region={profileLocation.region}
                        district={profileLocation.district}
                        ward={profileLocation.ward}
                        onChange={setProfileLocation}
                        labels={{ region: 'Region', district: 'District', ward: 'Ward' }}
                      />
                    </div>
                    <div className="form-group"><label className="form-label">Village / Street</label><input className="form-input" placeholder="e.g. Uhuru Street" /></div>
                    <div className="form-group"><label className="form-label">House Number</label><input className="form-input" placeholder="e.g. Plot 123" /></div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button className="btn btn-primary">Save Changes</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;
