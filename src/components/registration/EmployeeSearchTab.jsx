import React, { useState } from 'react';

const FG = ({ label, children, error }) => (
  <div className={`form-group${error ? ' form-group--error' : ''}`}>
    <label className="form-label">{label}</label>
    {children}
    {error && <span className="reg-form-error">{error}</span>}
  </div>
);

const DEMO_EMPLOYEES = {
  'PF-123456': {
    personal: { firstName: 'John', middleName: 'Doe', lastName: 'Smith', gender: 'Male', dateOfBirth: '1985-03-15', maritalStatus: 'Married', nationality: 'Tanzanian', idType: 'National ID', idNumber: '19850315-12345-67890', employeeId: 'EMP-2024-001', checkNumber: 'CHK-001', department: 'Human Resources', designation: 'HR Officer', grade: 'Grade III', dateOfFirstAppointment: '2010-01-15', dateOfCurrentAppointment: '2022-06-01', employmentType: 'Permanent' },
    contact: { phone: '+255 712 345 678', email: 'john.smith@example.com', altPhone: '' },
    physAddr: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kariakoo', village: 'Kariakoo', street: 'Mkwajuni', house: 'Plot 123' },
    workLoc: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kisutu', office: 'Ministry HQ' },
    domicile: { region: 'Dodoma', district: 'Dodoma Municipal', ward: 'Kikombo', village: 'Majengo', street: 'Uhuru', house: 'Plot 45' },
    dependants: [{ id: 1, fullName: 'Jane Smith', relationship: 'Spouse', gender: 'Female', dateOfBirth: '1987-07-20', occupation: 'Teacher', school: '', attachments: [] }, { id: 2, fullName: 'Michael Smith', relationship: 'Child', gender: 'Male', dateOfBirth: '2010-05-10', occupation: 'Student', school: 'Primary School', attachments: [] }],
    nextOfKin: [{ id: 1, fullName: 'Robert Smith', relationship: 'Parent', dateOfBirth: '1955-11-02', gender: 'Male', occupation: 'Retired', phone: '+255 713 456 789', email: 'robert.smith@example.com', physicalAddress: 'Dodoma', postalAddress: 'P.O. Box 123' }],
    basicEdu: [{ id: 1, level: 'Primary', institution: 'Mkwajuni Primary School', year: '2000', attachments: [] }],
    higherEdu: [{ id: 1, degree: 'Bachelor of Arts in Human Resources', institution: 'University of Dar es Salaam', year: '2008', attachments: [] }],
    profQuals: [{ id: 1, qualification: 'Certified HR Professional', institution: 'HRM Institute', year: '2012', attachments: [] }],
  },
  'CHK-001': {
    personal: { firstName: 'John', middleName: 'Doe', lastName: 'Smith', gender: 'Male', dateOfBirth: '1985-03-15', maritalStatus: 'Married', nationality: 'Tanzanian', idType: 'National ID', idNumber: '19850315-12345-67890', employeeId: 'EMP-2024-001', checkNumber: 'CHK-001', department: 'Human Resources', designation: 'HR Officer', grade: 'Grade III', dateOfFirstAppointment: '2010-01-15', dateOfCurrentAppointment: '2022-06-01', employmentType: 'Permanent' },
    contact: { phone: '+255 712 345 678', email: 'john.smith@example.com', altPhone: '' },
    physAddr: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kariakoo', village: 'Kariakoo', street: 'Mkwajuni', house: 'Plot 123' },
    workLoc: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kisutu', office: 'Ministry HQ' },
    domicile: { region: 'Dodoma', district: 'Dodoma Municipal', ward: 'Kikombo', village: 'Majengo', street: 'Uhuru', house: 'Plot 45' },
    dependants: [{ id: 1, fullName: 'Jane Smith', relationship: 'Spouse', gender: 'Female', dateOfBirth: '1987-07-20', occupation: 'Teacher', school: '', attachments: [] }, { id: 2, fullName: 'Michael Smith', relationship: 'Child', gender: 'Male', dateOfBirth: '2010-05-10', occupation: 'Student', school: 'Primary School', attachments: [] }],
    nextOfKin: [{ id: 1, fullName: 'Robert Smith', relationship: 'Parent', dateOfBirth: '1955-11-02', gender: 'Male', occupation: 'Retired', phone: '+255 713 456 789', email: 'robert.smith@example.com', physicalAddress: 'Dodoma', postalAddress: 'P.O. Box 123' }],
    basicEdu: [{ id: 1, level: 'Primary', institution: 'Mkwajuni Primary School', year: '2000', attachments: [] }],
    higherEdu: [{ id: 1, degree: 'Bachelor of Arts in Human Resources', institution: 'University of Dar es Salaam', year: '2008', attachments: [] }],
    profQuals: [{ id: 1, qualification: 'Certified HR Professional', institution: 'HRM Institute', year: '2012', attachments: [] }],
  }
};

function EmployeeSearchTab({ onPopulate }) {
  const [pfNumber, setPfNumber] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    setSearchError('');
    if (!pfNumber.trim() && !checkNumber.trim()) {
      setSearchError('Please enter PF Number or Check Number');
      return;
    }
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      const key = pfNumber.trim() || checkNumber.trim();
      const data = DEMO_EMPLOYEES[key] || DEMO_EMPLOYEES['PF-123456'];
      if (data) {
        onPopulate(data);
      } else {
        setSearchError('No employee record found. Please verify the number and try again.');
      }
    }, 800);
  };

  return (
    <div className="leave-form-section">
      <h4 className="leave-form-section-title">Employee Search</h4>
      <p className="leave-form-hint">Enter an existing employee&apos;s PF Number or Check Number to auto-populate the registration form with their details.</p>
      <div className="leave-form-row">
        <FG label="PF Number" error={searchError && !pfNumber && !checkNumber ? searchError : ''}>
          <input className="form-input" value={pfNumber} onChange={e => { setPfNumber(e.target.value); setSearchError(''); }} placeholder="e.g. PF-123456" />
        </FG>
        <FG label="Check Number">
          <input className="form-input" value={checkNumber} onChange={e => { setCheckNumber(e.target.value); setSearchError(''); }} placeholder="e.g. CHK-001" />
        </FG>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={handleSearch} disabled={searching} style={{ height: '44px', width: '100%' }}>
            {searching ? 'Searching...' : 'Search Employee'}
          </button>
        </div>
      </div>
      {searchError && pfNumber && (
        <div className="reg-form-error" style={{ marginTop: '8px' }}>{searchError}</div>
      )}
    </div>
  );
}

export default EmployeeSearchTab;
