import React, { useState } from 'react';

const FG = ({ label, children, error }) => (
  <div className={`form-group${error ? ' form-group--error' : ''}`}>
    <label className="form-label">{label}</label>
    {children}
    {error && <span className="reg-form-error">{error}</span>}
  </div>
);

const emp1 = {
  personal: { firstName: 'John', middleName: 'Michael', lastName: 'Mushi', gender: 'Male', dateOfBirth: '1990-01-01', maritalStatus: 'Married', nationality: 'Tanzanian', idType: 'National ID', idNumber: '19900101-12345-00001-01', employeeId: 'EMP-001', checkNumber: 'CHK-00012345', department: 'Human Resource Management', designation: 'HR Officer', grade: 'Grade III', dateOfFirstAppointment: '2015-01-15', dateOfCurrentAppointment: '2022-06-01', employmentType: 'Permanent' },
  contact: { phone: '+255712345678', email: 'john.mushi@example.go.tz', altPhone: '' },
  physAddr: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kariakoo', village: 'Kariakoo', street: 'Mkwajuni', house: 'Plot 123' },
  workLoc: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kisutu', office: 'Immigration Headquarters' },
  domicile: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kariakoo', village: 'Kariakoo', street: 'Mkwajuni', house: 'Plot 123' },
  dependants: [{ id: 1, fullName: 'Mary Mushi', relationship: 'Spouse', gender: 'Female', dateOfBirth: '1992-05-10', occupation: 'Teacher', school: '', attachments: [] }, { id: 2, fullName: 'Grace Mushi', relationship: 'Child', gender: 'Female', dateOfBirth: '2018-03-15', occupation: 'Student', school: 'Primary School', attachments: [] }],
  nextOfKin: [{ id: 1, fullName: 'Michael Mushi', relationship: 'Parent', dateOfBirth: '1960-08-20', gender: 'Male', occupation: 'Retired', phone: '+255713456789', email: 'michael.mushi@example.com', physicalAddress: 'Dar es Salaam', postalAddress: 'P.O. Box 123' }],
  basicEdu: [{ id: 1, level: 'Primary', institution: 'Kariakoo Primary School', year: '2005', attachments: [] }],
  higherEdu: [{ id: 1, degree: 'Bachelor of Arts in Human Resources', institution: 'University of Dar es Salaam', year: '2013', attachments: [] }],
  profQuals: [{ id: 1, qualification: 'Certified HR Professional', institution: 'HRM Institute', year: '2016', attachments: [] }],
};

const emp2 = {
  personal: { firstName: 'Asha', middleName: 'Hamisi', lastName: 'Juma', gender: 'Female', dateOfBirth: '1988-05-15', maritalStatus: 'Single', nationality: 'Tanzanian', idType: 'National ID', idNumber: '19880515-23456-00002-02', employeeId: 'EMP-002', checkNumber: 'CHK-00012346', department: 'Immigration Services', designation: 'Immigration Officer', grade: 'Grade II', dateOfFirstAppointment: '2012-03-01', dateOfCurrentAppointment: '2023-01-15', employmentType: 'Permanent' },
  contact: { phone: '+255722334455', email: 'asha.juma@example.go.tz', altPhone: '' },
  physAddr: { region: 'Dar es Salaam', district: 'Kinondoni', ward: 'Mzimuni', village: 'Mzimuni', street: 'Ali Hassan Mwinyi', house: 'Plot 78' },
  workLoc: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kisutu', office: 'Immigration Headquarters' },
  domicile: { region: 'Dar es Salaam', district: 'Temeke', ward: 'Temeke', village: 'Temeke', street: 'Changombe', house: 'Plot 12' },
  dependants: [{ id: 1, fullName: 'Fatma Juma', relationship: 'Child', gender: 'Female', dateOfBirth: '2015-09-10', occupation: 'Student', school: 'Primary School', attachments: [] }],
  nextOfKin: [{ id: 1, fullName: 'Hamisi Juma', relationship: 'Parent', dateOfBirth: '1958-04-20', gender: 'Male', occupation: 'Farmer', phone: '+255733445566', email: 'hamisi.juma@example.com', physicalAddress: 'Temeke', postalAddress: 'P.O. Box 456' }],
  basicEdu: [{ id: 1, level: 'Primary', institution: 'Changombe Primary School', year: '2003', attachments: [] }],
  higherEdu: [{ id: 1, degree: 'Bachelor of Laws', institution: 'University of Dar es Salaam', year: '2011', attachments: [] }],
  profQuals: [{ id: 1, qualification: 'Immigration Officer Certification', institution: 'Immigration Training Institute', year: '2013', attachments: [] }],
};

const emp3 = {
  personal: { firstName: 'Peter', middleName: 'Emmanuel', lastName: 'Mwita', gender: 'Male', dateOfBirth: '1992-03-20', maritalStatus: 'Single', nationality: 'Tanzanian', idType: 'National ID', idNumber: '19920320-34567-00003-03', employeeId: 'EMP-003', checkNumber: 'CHK-00012347', department: 'Finance', designation: 'Finance Officer', grade: 'Grade II', dateOfFirstAppointment: '2016-07-01', dateOfCurrentAppointment: '2023-06-01', employmentType: 'Permanent' },
  contact: { phone: '+255733445566', email: 'peter.mwita@example.go.tz', altPhone: '' },
  physAddr: { region: 'Dodoma', district: 'Dodoma Municipal', ward: 'Majengo', village: 'Majengo', street: 'Uhuru', house: 'Plot 34' },
  workLoc: { region: 'Dodoma', district: 'Dodoma Municipal', ward: 'Kikombo', office: 'Immigration Headquarters' },
  domicile: { region: 'Dodoma', district: 'Dodoma Municipal', ward: 'Majengo', village: 'Majengo', street: 'Uhuru', house: 'Plot 34' },
  dependants: [],
  nextOfKin: [{ id: 1, fullName: 'Emmanuel Mwita', relationship: 'Parent', dateOfBirth: '1965-02-14', gender: 'Male', occupation: 'Business', phone: '+255744556677', email: 'emmanuel.mwita@example.com', physicalAddress: 'Dodoma', postalAddress: 'P.O. Box 789' }],
  basicEdu: [{ id: 1, level: 'Primary', institution: 'Majengo Primary School', year: '2007', attachments: [] }],
  higherEdu: [{ id: 1, degree: 'Bachelor of Commerce in Finance', institution: 'University of Dodoma', year: '2015', attachments: [] }],
  profQuals: [{ id: 1, qualification: 'Certified Public Accountant', institution: 'NBAA', year: '2017', attachments: [] }],
};

const emp4 = {
  personal: { firstName: 'Neema', middleName: 'Joseph', lastName: 'Mollel', gender: 'Female', dateOfBirth: '1995-07-12', maritalStatus: 'Single', nationality: 'Tanzanian', idType: 'National ID', idNumber: '19950712-45678-00004-04', employeeId: 'EMP-004', checkNumber: 'CHK-00012348', department: 'ICT', designation: 'Systems Analyst', grade: 'Grade I', dateOfFirstAppointment: '2018-09-01', dateOfCurrentAppointment: '2024-01-15', employmentType: 'Permanent' },
  contact: { phone: '+255744556677', email: 'neema.mollel@example.go.tz', altPhone: '' },
  physAddr: { region: 'Arusha', district: 'Arusha City', ward: 'Serengeti', village: 'Serengeti', street: 'Safari', house: 'Plot 56' },
  workLoc: { region: 'Arusha', district: 'Arusha City', ward: 'Themi', office: 'Arusha Regional Office' },
  domicile: { region: 'Arusha', district: 'Arusha City', ward: 'Serengeti', village: 'Serengeti', street: 'Safari', house: 'Plot 56' },
  dependants: [],
  nextOfKin: [{ id: 1, fullName: 'Joseph Mollel', relationship: 'Parent', dateOfBirth: '1968-11-30', gender: 'Male', occupation: 'Farmer', phone: '+255755667788', email: 'joseph.mollel@example.com', physicalAddress: 'Arusha', postalAddress: 'P.O. Box 321' }],
  basicEdu: [{ id: 1, level: 'Primary', institution: 'Serengeti Primary School', year: '2010', attachments: [] }],
  higherEdu: [{ id: 1, degree: 'Bachelor of Science in Information Systems', institution: 'University of Arusha', year: '2017', attachments: [] }],
  profQuals: [{ id: 1, qualification: 'Certified Systems Analyst', institution: 'ICT Institute', year: '2019', attachments: [] }],
};

const emp5 = {
  personal: { firstName: 'David', middleName: 'Robert', lastName: 'Kweka', gender: 'Male', dateOfBirth: '1989-12-25', maritalStatus: 'Married', nationality: 'Tanzanian', idType: 'National ID', idNumber: '19891225-56789-00005-05', employeeId: 'EMP-005', checkNumber: 'CHK-00012349', department: 'Administration', designation: 'Administrative Officer', grade: 'Grade III', dateOfFirstAppointment: '2014-02-01', dateOfCurrentAppointment: '2022-12-01', employmentType: 'Permanent' },
  contact: { phone: '+255755667788', email: 'david.kweka@example.go.tz', altPhone: '' },
  physAddr: { region: 'Mwanza', district: 'Mwanza City', ward: 'Nyamagana', village: 'Nyamagana', street: 'Makorongo', house: 'Plot 90' },
  workLoc: { region: 'Mwanza', district: 'Mwanza City', ward: 'Nyamagana', office: 'Mwanza Regional Office' },
  domicile: { region: 'Mwanza', district: 'Mwanza City', ward: 'Nyamagana', village: 'Nyamagana', street: 'Makorongo', house: 'Plot 90' },
  dependants: [{ id: 1, fullName: 'Sarah Kweka', relationship: 'Spouse', gender: 'Female', dateOfBirth: '1991-06-18', occupation: 'Nurse', school: '', attachments: [] }, { id: 2, fullName: 'Daniel Kweka', relationship: 'Child', gender: 'Male', dateOfBirth: '2020-01-05', occupation: 'Student', school: 'Daycare', attachments: [] }],
  nextOfKin: [{ id: 1, fullName: 'Robert Kweka', relationship: 'Parent', dateOfBirth: '1962-03-22', gender: 'Male', occupation: 'Retired', phone: '+255766778899', email: 'robert.kweka@example.com', physicalAddress: 'Mwanza', postalAddress: 'P.O. Box 654' }],
  basicEdu: [{ id: 1, level: 'Primary', institution: 'Nyamagana Primary School', year: '2005', attachments: [] }],
  higherEdu: [{ id: 1, degree: 'Bachelor of Public Administration', institution: 'University of Mwanza', year: '2013', attachments: [] }],
  profQuals: [{ id: 1, qualification: 'Certified Administrative Professional', institution: 'Institute of Administration', year: '2015', attachments: [] }],
};

const DEMO_EMPLOYEES = {
  '19900101-12345-00001-01': emp1, 'CHK-00012345': emp1, 'F0012345': emp1,
  '19880515-23456-00002-02': emp2, 'CHK-00012346': emp2, 'F0012346': emp2,
  '19920320-34567-00003-03': emp3, 'CHK-00012347': emp3, 'F0012347': emp3,
  '19950712-45678-00004-04': emp4, 'CHK-00012348': emp4, 'F0012348': emp4,
  '19891225-56789-00005-05': emp5, 'CHK-00012349': emp5, 'F0012349': emp5,
};

function EmployeeSearchTab({ onPopulate }) {
  const [nin, setNin] = useState('');
  const [checkNumber, setCheckNumber] = useState('');
  const [forceNumber, setForceNumber] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = () => {
    setSearchError('');
    if (!nin.trim() && !checkNumber.trim() && !forceNumber.trim()) {
      setSearchError('Please enter at least one search field');
      return;
    }
    setSearching(true);
    setTimeout(() => {
      setSearching(false);
      const key = nin.trim() || checkNumber.trim() || forceNumber.trim();
      const data = DEMO_EMPLOYEES[key];
      if (data) {
        onPopulate(data);
      } else {
        setSearchError('No employee record found. Please verify your entries and try again.');
      }
    }, 800);
  };

  return (
    <div className="leave-form-section">
      <h4 className="leave-form-section-title">Employee Search</h4>
      <p className="leave-form-hint">Enter an existing employee&apos;s National ID (NIN), Check Number, or Force Number to auto-populate the registration form with their details.</p>
      <div className="leave-form-row">
        <FG label="National ID (NIN)" error={searchError && !nin && !checkNumber && !forceNumber ? searchError : ''}>
          <input className="form-input" value={nin} onChange={e => { setNin(e.target.value); setSearchError(''); }} placeholder="e.g. 19900101-12345-00001-01" />
        </FG>
        <FG label="Check Number">
          <input className="form-input" value={checkNumber} onChange={e => { setCheckNumber(e.target.value); setSearchError(''); }} placeholder="e.g. CHK-00012345" />
        </FG>
        <FG label="Force Number">
          <input className="form-input" value={forceNumber} onChange={e => { setForceNumber(e.target.value); setSearchError(''); }} placeholder="e.g. F0012345" />
        </FG>
        <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end' }}>
          <button type="button" className="btn btn-primary" onClick={handleSearch} disabled={searching} style={{ height: '48px', width: '100%' }}>
            {searching ? 'Searching...' : 'Search Employee'}
          </button>
        </div>
      </div>
      {searchError && (nin || checkNumber || forceNumber) && (
        <div className="reg-form-error" style={{ marginTop: '8px' }}>{searchError}</div>
      )}
    </div>
  );
}

export default EmployeeSearchTab;
