import React, { createContext, useContext, useState } from 'react';
import { DEMO_EMPLOYEES } from '../data/demoEmployees';

const AuthContext = createContext(null);

function employeeToUser(emp) {
  const username = emp.officialEmail ? emp.officialEmail.split('@')[0] : '';
  return {
    username,
    password: 'Uhamiaji@123',
    name: `${emp.firstName} ${emp.lastName}`,
    role: 'staff',
    email: emp.officialEmail,
    employeeId: emp.employeeId,
    employeeNumber: emp.employeeNumber,
    checkNumber: emp.checkNumber,
    forceNumber: emp.forceNumber,
    nin: emp.nin,
    fullName: emp.fullName,
    firstName: emp.firstName,
    lastName: emp.lastName,
    gender: emp.gender,
    dob: emp.dob,
    nationality: emp.nationality,
    maritalStatus: emp.maritalStatus,
    department: emp.department,
    designation: emp.designation,
    position: emp.position,
    employmentType: emp.employmentType,
    territory: emp.territory,
    workingRegion: emp.workingRegion,
    workingStation: emp.workingStation,
    region: emp.region,
    district: emp.district,
    ward: emp.ward,
    physicalAddress: emp.physicalAddress,
    postalAddress: emp.postalAddress,
    bloodGroup: emp.bloodGroup,
    phone: emp.phoneNumber || emp.mobile || '',
    phoneNumber: emp.phoneNumber || emp.mobile || '',
    mobileNumber: emp.mobileNumber || emp.mobile || '',
    officialEmail: emp.officialEmail,
  };
}

export const DEMO_USERS = DEMO_EMPLOYEES.map(employeeToUser);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const local = localStorage.getItem('hrms_user');
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem('hrms_user_session');
    if (session) return JSON.parse(session);
    return null;
  });

  const login = (username, password, rememberMe = false) => {
    const found = DEMO_USERS.find(u => u.username === username);
    if (!found || found.password !== password) {
      throw new Error('Invalid username or password');
    }
    const userData = {
      name: found.name,
      username: found.username,
      email: found.email,
      role: found.role,
      employeeNumber: found.employeeNumber || '',
      checkNumber: found.checkNumber || '',
      forceNumber: found.forceNumber || '',
      nin: found.nin || '',
      fullName: found.fullName || found.name || '',
      department: found.department || '',
      designation: found.designation || '',
      territory: found.territory || '',
      workingRegion: found.workingRegion || '',
      workingStation: found.workingStation || '',
      bloodGroup: found.bloodGroup || '',
      phone: found.phone || '',
      officialEmail: found.officialEmail || found.email || '',
    };
    setUser(userData);
    if (rememberMe) {
      localStorage.setItem('hrms_user', JSON.stringify(userData));
      sessionStorage.removeItem('hrms_user_session');
    } else {
      sessionStorage.setItem('hrms_user_session', JSON.stringify(userData));
      localStorage.removeItem('hrms_user');
    }
    return userData;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrms_user');
    sessionStorage.removeItem('hrms_user_session');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
