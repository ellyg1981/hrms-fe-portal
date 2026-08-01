/**
 * Shared sample employee master records used across the HRMS Staff Portal.
 *
 * In the real application these records come from the backend. In the
 * sample/development environment they act as the canonical employee master
 * data so the logged-in user, Staff ID verification, Registration, My Profile
 * and other modules all refer to the same identity.
 */

const employees = [
  {
    employeeId: 1255,
    employeeNumber: 'EMP-2024-00001',
    checkNumber: 'CHK-00000001',
    forceNumber: 'F0000001',
    nin: '19850101-00001-00001-01',
    fullName: 'Steven Joseph Mzena',
    firstName: 'Steven',
    middleName: 'Joseph',
    lastName: 'Mzena',
    gender: 'Male',
    dob: '1985-01-01',
    nationality: 'Tanzanian',
    maritalStatus: 'Married',
    idType: 'National ID',
    photo: '',

    department: 'Human Resources',
    designation: 'Senior HR Officer',
    position: 'Senior HR Officer',
    employmentType: 'Permanent',
    grade: 'Grade I',
    dateOfFirstAppointment: '2010-01-15',
    dateOfCurrentAppointment: '2022-06-01',
    appointmentDate: '2022-06-01',

    territory: 'Tanzania Mainland',
    workingRegion: 'Dodoma',
    workingStation: 'Immigration Headquarters',
    dutyStation: 'Immigration Headquarters',
    region: 'Dodoma',
    district: 'Dodoma Municipal',
    ward: 'Kikombo',
    physicalAddress: 'P.O. Box 1234, Dodoma',
    postalAddress: 'P.O. Box 1234, Dodoma',

    email: 'steven.mzena@immigration.go.tz',
    officialEmail: 'steven.mzena@immigration.go.tz',
    emailAddress: 'steven.mzena@immigration.go.tz',
    phoneNumber: '+255712345001',
    mobile: '+255712345001',
    mobileNumber: '+255712345001',
    phone: '+255712345001',

    bloodGroup: 'A+',

    // Profile registration tab shape
    personal: {
      firstName: 'Steven',
      middleName: 'Joseph',
      lastName: 'Mzena',
      gender: 'Male',
      dateOfBirth: '1985-01-01',
      maritalStatus: 'Married',
      nationality: 'Tanzanian',
      idType: 'National ID',
      idNumber: '19850101-00001-00001-01',
      employeeId: 'EMP-2024-00001',
      checkNumber: 'CHK-00000001',
      department: 'Human Resources',
      designation: 'Senior HR Officer',
      grade: 'Grade I',
      dateOfFirstAppointment: '2010-01-15',
      dateOfCurrentAppointment: '2022-06-01',
      employmentType: 'Permanent',
    },
    contact: { phone: '+255712345001', email: 'steven.mzena@immigration.go.tz', altPhone: '' },
    physAddr: { region: 'Dodoma', district: 'Dodoma Municipal', ward: 'Kikombo', village: 'Kikombo', street: 'Mkwajuni', house: 'Plot 12' },
    workLoc: { region: 'Dodoma', district: 'Dodoma Municipal', ward: 'Kikombo', office: 'Immigration Headquarters' },
    domicile: { region: 'Dodoma', district: 'Dodoma Municipal', ward: 'Kikombo', village: 'Kikombo', street: 'Mkwajuni', house: 'Plot 12' },
    dependants: [
      { id: 1, fullName: 'Grace Mzena', relationship: 'Spouse', gender: 'Female', dateOfBirth: '1987-04-10', occupation: 'Teacher', school: '', attachments: [] },
      { id: 2, fullName: 'Daniel Mzena', relationship: 'Child', gender: 'Male', dateOfBirth: '2015-02-20', occupation: 'Student', school: 'Primary School', attachments: [] },
    ],
    nextOfKin: [
      { id: 1, fullName: 'Joseph Mzena', relationship: 'Parent', dateOfBirth: '1955-08-20', gender: 'Male', occupation: 'Retired', phone: '+255713456789', email: 'joseph.mzena@example.com', physicalAddress: 'Dodoma', postalAddress: 'P.O. Box 1234' },
    ],
    basicEdu: [{ id: 1, level: 'Primary', institution: 'Dodoma Primary School', year: '2000', attachments: [] }],
    higherEdu: [{ id: 1, degree: 'Bachelor of Arts in Human Resources', institution: 'University of Dodoma', year: '2008', attachments: [] }],
    profQuals: [{ id: 1, qualification: 'Certified HR Professional', institution: 'HRM Institute', year: '2012', attachments: [] }],
  },
  {
    employeeId: 1254,
    employeeNumber: 'EMP-2026-00125',
    checkNumber: 'CHK-00000125',
    forceNumber: 'F0000125',
    nin: '19900101-12345-00001-01',
    fullName: 'Goodluck Edwin Msuya',
    firstName: 'Goodluck',
    middleName: 'Edwin',
    lastName: 'Msuya',
    gender: 'Male',
    dob: '1990-01-01',
    nationality: 'Tanzanian',
    maritalStatus: 'Single',
    idType: 'National ID',
    photo: '',

    department: 'Immigration Services',
    designation: 'Assistant Superintendent',
    position: 'Assistant Superintendent',
    employmentType: 'Permanent',
    grade: 'Grade II',
    dateOfFirstAppointment: '2015-03-01',
    dateOfCurrentAppointment: '2023-01-15',
    appointmentDate: '2023-01-15',

    territory: 'Tanzania Mainland',
    workingRegion: 'Dar es Salaam',
    workingStation: 'Dar es Salaam HQ',
    dutyStation: 'Dar es Salaam HQ',
    region: 'Dar es Salaam',
    district: 'Ilala',
    ward: 'Kisutu',
    physicalAddress: 'P.O. Box 5555, Dar es Salaam',
    postalAddress: 'P.O. Box 5555, Dar es Salaam',

    email: 'goodluck.msuya@immigration.go.tz',
    officialEmail: 'goodluck.msuya@immigration.go.tz',
    emailAddress: 'goodluck.msuya@immigration.go.tz',
    phoneNumber: '+255712345678',
    mobile: '+255712345678',
    mobileNumber: '+255712345678',
    phone: '+255712345678',

    bloodGroup: 'AB+',

    personal: {
      firstName: 'Goodluck',
      middleName: 'Edwin',
      lastName: 'Msuya',
      gender: 'Male',
      dateOfBirth: '1990-01-01',
      maritalStatus: 'Single',
      nationality: 'Tanzanian',
      idType: 'National ID',
      idNumber: '19900101-12345-00001-01',
      employeeId: 'EMP-2026-00125',
      checkNumber: 'CHK-00000125',
      department: 'Immigration Services',
      designation: 'Assistant Superintendent',
      grade: 'Grade II',
      dateOfFirstAppointment: '2015-03-01',
      dateOfCurrentAppointment: '2023-01-15',
      employmentType: 'Permanent',
    },
    contact: { phone: '+255712345678', email: 'goodluck.msuya@immigration.go.tz', altPhone: '' },
    physAddr: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kisutu', village: 'Kisutu', street: 'Sokoine', house: 'Plot 78' },
    workLoc: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kisutu', office: 'Dar es Salaam HQ' },
    domicile: { region: 'Dar es Salaam', district: 'Ilala', ward: 'Kisutu', village: 'Kisutu', street: 'Sokoine', house: 'Plot 78' },
    dependants: [],
    nextOfKin: [
      { id: 1, fullName: 'Edwin Msuya', relationship: 'Parent', dateOfBirth: '1960-04-20', gender: 'Male', occupation: 'Retired', phone: '+255713456789', email: 'edwin.msuya@example.com', physicalAddress: 'Dar es Salaam', postalAddress: 'P.O. Box 5555' },
    ],
    basicEdu: [{ id: 1, level: 'Primary', institution: 'Kisutu Primary School', year: '2003', attachments: [] }],
    higherEdu: [{ id: 1, degree: 'Bachelor of Laws', institution: 'University of Dar es Salaam', year: '2012', attachments: [] }],
    profQuals: [{ id: 1, qualification: 'Immigration Officer Certification', institution: 'Immigration Training Institute', year: '2014', attachments: [] }],
  },
  {
    employeeId: 1256,
    employeeNumber: 'EMP-2024-00002',
    checkNumber: 'CHK-00000002',
    forceNumber: 'F0000002',
    nin: '19880515-23456-00002-02',
    fullName: 'John Michael Mkosamali',
    firstName: 'John',
    middleName: 'Michael',
    lastName: 'Mkosamali',
    gender: 'Male',
    dob: '1988-05-15',
    nationality: 'Tanzanian',
    maritalStatus: 'Single',
    idType: 'National ID',
    photo: '',

    department: 'ICT',
    designation: 'Systems Analyst',
    position: 'Systems Analyst',
    employmentType: 'Permanent',
    grade: 'Grade I',
    dateOfFirstAppointment: '2012-07-01',
    dateOfCurrentAppointment: '2024-01-15',
    appointmentDate: '2024-01-15',

    territory: 'Tanzania Mainland',
    workingRegion: 'Arusha',
    workingStation: 'Arusha Regional Office',
    dutyStation: 'Arusha Regional Office',
    region: 'Arusha',
    district: 'Arusha City',
    ward: 'Themi',
    physicalAddress: 'P.O. Box 789, Arusha',
    postalAddress: 'P.O. Box 789, Arusha',

    email: 'john.mkosamali@immigration.go.tz',
    officialEmail: 'john.mkosamali@immigration.go.tz',
    emailAddress: 'john.mkosamali@immigration.go.tz',
    phoneNumber: '+255712345002',
    mobile: '+255712345002',
    mobileNumber: '+255712345002',
    phone: '+255712345002',

    bloodGroup: 'O+',

    personal: {
      firstName: 'John',
      middleName: 'Michael',
      lastName: 'Mkosamali',
      gender: 'Male',
      dateOfBirth: '1988-05-15',
      maritalStatus: 'Single',
      nationality: 'Tanzanian',
      idType: 'National ID',
      idNumber: '19880515-23456-00002-02',
      employeeId: 'EMP-2024-00002',
      checkNumber: 'CHK-00000002',
      department: 'ICT',
      designation: 'Systems Analyst',
      grade: 'Grade I',
      dateOfFirstAppointment: '2012-07-01',
      dateOfCurrentAppointment: '2024-01-15',
      employmentType: 'Permanent',
    },
    contact: { phone: '+255712345002', email: 'john.mkosamali@immigration.go.tz', altPhone: '' },
    physAddr: { region: 'Arusha', district: 'Arusha City', ward: 'Themi', village: 'Themi', street: 'Safari', house: 'Plot 56' },
    workLoc: { region: 'Arusha', district: 'Arusha City', ward: 'Themi', office: 'Arusha Regional Office' },
    domicile: { region: 'Arusha', district: 'Arusha City', ward: 'Themi', village: 'Themi', street: 'Safari', house: 'Plot 56' },
    dependants: [],
    nextOfKin: [
      { id: 1, fullName: 'Michael Mkosamali', relationship: 'Parent', dateOfBirth: '1958-11-30', gender: 'Male', occupation: 'Farmer', phone: '+255713456789', email: 'michael.mkosamali@example.com', physicalAddress: 'Arusha', postalAddress: 'P.O. Box 789' },
    ],
    basicEdu: [{ id: 1, level: 'Primary', institution: 'Themi Primary School', year: '2005', attachments: [] }],
    higherEdu: [{ id: 1, degree: 'Bachelor of Science in Information Systems', institution: 'University of Arusha', year: '2011', attachments: [] }],
    profQuals: [{ id: 1, qualification: 'Certified Systems Analyst', institution: 'ICT Institute', year: '2013', attachments: [] }],
  },
];

function normalize(value) {
  if (value === undefined || value === null) return '';
  return String(value).trim();
}

export const DEMO_EMPLOYEES = employees;

export function findDemoEmployee({ checkNumber = '', nin = '', employeeNumber = '', forceNumber = '' } = {}) {
  const searchCheck = normalize(checkNumber).toLowerCase();
  const searchNin = normalize(nin).toLowerCase();
  const searchEmpNo = normalize(employeeNumber).toLowerCase();
  const searchForce = normalize(forceNumber).toLowerCase();

  return employees.find(emp => {
    const matchesCheck = searchCheck && normalize(emp.checkNumber).toLowerCase() === searchCheck;
    const matchesNin = searchNin && normalize(emp.nin).toLowerCase() === searchNin;
    const matchesEmpNo = searchEmpNo && normalize(emp.employeeNumber).toLowerCase() === searchEmpNo;
    const matchesForce = searchForce && normalize(emp.forceNumber).toLowerCase() === searchForce;
    return matchesCheck || matchesNin || matchesEmpNo || matchesForce;
  }) || null;
}
