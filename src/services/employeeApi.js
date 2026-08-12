import { notificationService } from '../components/Notifications/notificationService';
import { DEMO_EMPLOYEES, findDemoEmployee } from '../data/demoEmployees';
import { getToken } from './authApi';
import { apiClient } from './apiClient';
import {
  USE_DEMO,
  EMPLOYEE_ME_ENDPOINT,
  EMPLOYEE_SEARCH_ENDPOINT,
} from '../config/api';

/**
 * Normalize the employee API response into a canonical shape used across the Staff ID modal.
 * This handles the most common field-name variants so the backend shape can be adjusted
 * without touching every component.
 */
export function normalizeEmployee(data = {}) {
  const firstName = data.firstName || data.givenName || data.givenNames || '';
  const lastName = data.lastName || data.surname || data.familyName || '';
  const fullName = data.fullName || data.name || `${firstName} ${lastName}`.trim() || '';
  const givenNames = data.givenNames || data.givenName || data.firstName || (fullName.split(' ').slice(0, -1).join(' ') || fullName);
  const surname = data.surname || data.lastName || data.familyName || (fullName.split(' ').pop() || '');

  return {
    employeeId: data.employeeId || data.id || data.employee_id || '',
    employeeNumber: data.employeeNumber || data.employeeNo || data.employee_number || data.empNo || '',
    checkNumber: data.checkNumber || data.checkNo || data.check_number || data.checkNo || '',
    forceNumber: data.forceNumber || data.force_number || data.forceNo || data.force_no || '',
    nin: data.nin || data.NIN || data.nationalId || data.national_id || data.nationalID || '',

    fullName,
    givenNames,
    surname,
    gender: data.gender || data.sex || '',
    dob: data.dob || data.dateOfBirth || data.date_of_birth || data.birthDate || '',
    nationality: data.nationality || data.nationalityName || '',
    maritalStatus: data.maritalStatus || data.marital_status || data.marital || '',
    photo: data.photo || data.photoUrl || data.photo_url || data.employeePhoto || data.profilePicture || '',

    department: data.department || data.departmentName || data.unit || '',
    designation: data.designation || data.title || data.jobTitle || data.position || data.role || '',
    employmentType: data.employmentType || data.employment_type || data.employmentStatus || '',
    appointmentDate: data.appointmentDate || data.appointment_date || data.dateOfAppointment || '',
    dutyStation: data.dutyStation || data.duty_station || data.workStation || data.workingStation || data.station || '',
    region: data.region || data.workingRegion || data.working_region || data.assignedRegion || '',
    district: data.district || data.assignedDistrict || '',
    position: data.position || data.rank || data.jobPosition || data.designation || '',

    territory: data.territory || data.employeeTerritory || '',
    workingRegion: data.workingRegion || data.working_region || data.region || '',
    workingStation: data.workingStation || data.working_station || data.dutyStation || data.station || '',

    officialEmail: data.officialEmail || data.official_email || data.email || data.workEmail || data.emailAddress || '',
    phoneNumber: data.phoneNumber || data.phone_number || data.phone || data.mobile || data.mobileNumber || '',
    mobile: data.mobile || data.mobileNumber || data.phoneNumber || data.phone || '',
    ward: data.ward || data.wardName || '',
    physicalAddress: data.physicalAddress || data.physical_address || data.address || data.streetAddress || '',
    postalAddress: data.postalAddress || data.postal_address || data.postal || '',

    bloodGroup: data.bloodGroup || data.blood_group || data.blood || '',

    // Nested profile-tab data, when present in the source record
    personal: data.personal || null,
    contact: data.contact || null,
    physAddr: data.physAddr || null,
    workLoc: data.workLoc || null,
    domicile: data.domicile || null,
    basicEdu: data.basicEdu || [],
    higherEdu: data.higherEdu || [],
    profQuals: data.profQuals || [],
    dependants: data.dependants || [],
    nextOfKin: data.nextOfKin || [],
    transferHistory: data.transferHistory || [],
    leaveHistory: data.leaveHistory || [],
  };
}

/**
 * Fetch the currently logged-in employee's record.
 */
export async function getCurrentEmployee() {
  if (USE_DEMO) {
    const token = getToken();
    const employee = token
      ? DEMO_EMPLOYEES[0]
      : null;
    if (!employee) throw new Error('Employee record not found.');
    return normalizeEmployee(employee);
  }
  const data = await apiClient.get(EMPLOYEE_ME_ENDPOINT);
  return normalizeEmployee(data);
}

/**
 * Search for an employee by check number and/or NIN.
 */
export async function searchEmployee({ checkNumber = '', nin = '', forceNumber = '' } = {}) {
  const hasCheckNumber = checkNumber.trim();
  const hasNin = nin.trim();
  const hasForceNumber = forceNumber.trim();

  if (!hasCheckNumber && !hasNin && !hasForceNumber) {
    throw new Error('Please provide a Check Number, National ID (NIN), or Force Number.');
  }

  if (USE_DEMO) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const employee = findDemoEmployee({ checkNumber, nin, forceNumber });
    if (!employee) throw new Error('Employee record not found.');
    return normalizeEmployee(employee);
  }

  const data = await apiClient.get(EMPLOYEE_SEARCH_ENDPOINT, { checkNumber, nin, forceNumber });
  return normalizeEmployee(data);
}

/**
 * Convenience wrapper that attaches HRMS-style loading/success/error notifications.
 */
export function withApiNotification(promise, messages) {
  return notificationService.promise(promise, messages);
}
