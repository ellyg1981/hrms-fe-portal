/**
 * Authentication API service.
 *
 * Handles login, logout, token refresh, user profile loading, and permission
 * lookup.  Works in two modes:
 *   - Demo/development: uses the shared DEMO_EMPLOYEES records.
 *   - Real backend: calls the configured auth and employee endpoints.
 *
 * Tokens and user data are stored in localStorage when "Remember me" is
 * selected, otherwise in sessionStorage.  Sensitive data such as passwords is
 * never persisted.
 */

import {
  API_BASE_URL,
  USE_DEMO,
  AUTH_LOGIN_ENDPOINT,
  AUTH_LOGOUT_ENDPOINT,
  AUTH_REFRESH_ENDPOINT,
  USER_PERMISSIONS_ENDPOINT,
  EMPLOYEE_ME_ENDPOINT,
  SESSION_MAX_AGE,
} from '../config/api';
import { DEMO_EMPLOYEES } from '../data/demoEmployees';
import { derivePermissions } from '../config/permissions';
import { notificationService } from '../components/Notifications/notificationService';

export class ApiError extends Error {
  constructor(message, status = 0, code = '', silent = false) {
    super(message);
    this.status = status;
    this.code = code;
    this.silent = silent;
  }
}

const TOKEN_LOCAL_KEY = 'hrms_token';
const TOKEN_SESSION_KEY = 'hrms_token_session';
const USER_LOCAL_KEY = 'hrms_user';
const USER_SESSION_KEY = 'hrms_user_session';
const PERMISSIONS_LOCAL_KEY = 'hrms_permissions';
const PERMISSIONS_SESSION_KEY = 'hrms_permissions_session';
const EXPIRY_LOCAL_KEY = 'hrms_session_expiry';
const EXPIRY_SESSION_KEY = 'hrms_session_expiry_session';

function isLocalStorageActive() {
  return !!localStorage.getItem(TOKEN_LOCAL_KEY);
}

function getKey(localKey, sessionKey) {
  return isLocalStorageActive() ? localKey : sessionKey;
}

function saveItem(localKey, sessionKey, value, remember) {
  if (remember) {
    localStorage.setItem(localKey, value);
    sessionStorage.removeItem(sessionKey);
  } else {
    sessionStorage.setItem(sessionKey, value);
    localStorage.removeItem(localKey);
  }
}

function removeItem(localKey, sessionKey) {
  localStorage.removeItem(localKey);
  sessionStorage.removeItem(sessionKey);
}

function readJson(key, defaultValue = null) {
  try {
    const raw = localStorage.getItem(key) || sessionStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

/* ── Token helpers ── */

export function getToken() {
  return localStorage.getItem(TOKEN_LOCAL_KEY) || sessionStorage.getItem(TOKEN_SESSION_KEY);
}

function setToken(token, remember) {
  saveItem(TOKEN_LOCAL_KEY, TOKEN_SESSION_KEY, token, remember);
}

/* ── User / permission / expiry helpers ── */

function getStoredUser() {
  return readJson(getKey(USER_LOCAL_KEY, USER_SESSION_KEY));
}

function setUser(user, remember) {
  saveItem(USER_LOCAL_KEY, USER_SESSION_KEY, JSON.stringify(user), remember);
}

function getStoredPermissions() {
  return readJson(getKey(PERMISSIONS_LOCAL_KEY, PERMISSIONS_SESSION_KEY));
}

function setPermissions(permissions, remember) {
  saveItem(PERMISSIONS_LOCAL_KEY, PERMISSIONS_SESSION_KEY, JSON.stringify(permissions), remember);
}

function getStoredExpiry() {
  const raw = localStorage.getItem(EXPIRY_LOCAL_KEY) || sessionStorage.getItem(EXPIRY_SESSION_KEY);
  return raw ? parseInt(raw, 10) : null;
}

function setExpiry(expiresAt, remember) {
  saveItem(EXPIRY_LOCAL_KEY, EXPIRY_SESSION_KEY, String(expiresAt), remember);
}

/* ── Session helpers ── */

export function saveSession({ token, user, permissions, expiresAt }, remember) {
  setToken(token, remember);
  setUser(user, remember);
  setPermissions(permissions, remember);
  setExpiry(expiresAt, remember);
}

export function getStoredSession() {
  const token = getToken();
  if (!token) return null;
  return {
    token,
    user: getStoredUser(),
    permissions: getStoredPermissions(),
    expiresAt: getStoredExpiry(),
    remember: isLocalStorageActive(),
  };
}

export function clearAuthStorage() {
  removeItem(TOKEN_LOCAL_KEY, TOKEN_SESSION_KEY);
  removeItem(USER_LOCAL_KEY, USER_SESSION_KEY);
  removeItem(PERMISSIONS_LOCAL_KEY, PERMISSIONS_SESSION_KEY);
  removeItem(EXPIRY_LOCAL_KEY, EXPIRY_SESSION_KEY);

  // Remove any legacy or module-specific cached HRMS data, including
  // employee/staff record caches that may have been stored in future releases.
  [localStorage, sessionStorage].forEach((store) => {
    for (let i = store.length - 1; i >= 0; i--) {
      const key = store.key(i);
      if (key && (key.startsWith('hrms_') || key === 'token')) {
        store.removeItem(key);
      }
    }
  });
}

/* ── Unauthorized helper used by the API client and auth flow ── */

export function handleUnauthorized(message = 'Your session has expired. Please log in again.') {
  clearAuthStorage();
  window.dispatchEvent(new CustomEvent('hrms:unauthorized', { detail: { message } }));
}

/* ── User normalization ── */

export function normalizeUser(data = {}) {
  const firstName = data.firstName || data.first_name || data.givenName || data.given_name || '';
  const lastName = data.lastName || data.last_name || data.surname || data.familyName || data.family_name || '';
  const fullName = data.fullName || data.full_name || data.name || `${firstName} ${lastName}`.trim();
  const roles = data.roles || (data.role ? [data.role] : ['staff']);

  return {
    userId: data.userId || data.user_id || data.id || data.sub || '',
    username: data.username || data.userName || data.email?.split('@')[0] || '',
    email: data.email || data.officialEmail || data.emailAddress || data.mail || '',
    officialEmail: data.officialEmail || data.official_email || data.email || '',
    employeeId: data.employeeId || data.employee_id || data.employeeNumber || data.employee_number || '',
    employeeNumber: data.employeeNumber || data.employee_number || data.employeeNo || data.employee_no || '',
    checkNumber: data.checkNumber || data.check_number || data.checkNo || data.check_no || '',
    forceNumber: data.forceNumber || data.force_number || data.forceNo || data.force_no || '',
    nin: data.nin || data.NIN || data.nationalId || data.national_id || data.nationalID || '',
    fullName,
    firstName,
    middleName: data.middleName || data.middle_name || '',
    lastName,
    name: data.name || fullName,
    gender: data.gender || data.sex || '',
    dob: data.dob || data.dateOfBirth || data.date_of_birth || data.birthDate || data.birth_date || '',
    nationality: data.nationality || data.nationalityName || '',
    maritalStatus: data.maritalStatus || data.marital_status || data.marital || '',
    department: data.department || data.departmentName || data.unit || data.directorate || '',
    designation: data.designation || data.title || data.jobTitle || data.position || data.role || '',
    position: data.position || data.rank || data.jobPosition || data.designation || '',
    employmentType: data.employmentType || data.employment_type || data.employmentStatus || '',
    territory: data.territory || data.employeeTerritory || '',
    workingRegion: data.workingRegion || data.working_region || data.assignedRegion || data.region || '',
    workingStation: data.workingStation || data.working_station || data.dutyStation || data.station || '',
    region: data.region || data.assignedRegion || '',
    district: data.district || data.assignedDistrict || '',
    ward: data.ward || data.wardName || '',
    physicalAddress: data.physicalAddress || data.physical_address || data.address || data.streetAddress || '',
    postalAddress: data.postalAddress || data.postal_address || data.postal || '',
    bloodGroup: data.bloodGroup || data.blood_group || data.blood || '',
    phone: data.phone || data.phoneNumber || data.phone_number || data.mobile || data.mobileNumber || '',
    phoneNumber: data.phoneNumber || data.phone_number || data.phone || data.mobile || '',
    mobileNumber: data.mobileNumber || data.mobile_number || data.mobile || '',
    photo: data.photo || data.photoUrl || data.photo_url || data.profilePicture || '',
    role: data.role || roles[0] || 'staff',
    roles,
    accountStatus: data.accountStatus || data.status || data.account_status || 'active',
    permissions: data.permissions || null,
  };
}

/* ── Demo helpers ── */

function employeeToUser(emp) {
  return {
    ...normalizeUser(emp),
    role: 'staff',
    roles: ['staff'],
    password: 'Uhamiaji@123',
  };
}

export const DEMO_USERS = DEMO_EMPLOYEES.map(employeeToUser);

export function isDemo() {
  return USE_DEMO;
}

export function getLoginTestUsers() {
  return USE_DEMO ? DEMO_USERS : [];
}

/* ── Fetch with auth header (used internally by authApi) ── */

async function fetchWithAuth(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const response = await fetch(url, { ...options, headers, credentials: 'include' });

  if (response.status === 401) {
    handleUnauthorized('Your session has expired. Please log in again.');
    throw new ApiError('Your session has expired. Please log in again.', 401, 'UNAUTHORIZED', true);
  }
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || `Request failed with status ${response.status}`);
  }
  return response;
}

function computeExpiry(data) {
  if (data.expiresAt || data.expires_at) {
    const ts = new Date(data.expiresAt || data.expires_at).getTime();
    return Number.isNaN(ts) ? Date.now() + SESSION_MAX_AGE : ts;
  }
  if (data.expiresIn || data.expires_in) {
    return Date.now() + (data.expiresIn || data.expires_in) * 1000;
  }
  return Date.now() + SESSION_MAX_AGE;
}

/* ── Public API ── */

export async function getCurrentUser() {
  if (USE_DEMO) {
    const session = getStoredSession();
    if (!session?.token) throw new Error('No active session.');
    return session.user || normalizeUser(DEMO_EMPLOYEES[0]);
  }
  const response = await fetchWithAuth(EMPLOYEE_ME_ENDPOINT, { method: 'GET' });
  const data = await response.json();
  return normalizeUser(data);
}

export async function getPermissionsFromApi(user) {
  if (USE_DEMO) {
    return derivePermissions(user);
  }
  try {
    const response = await fetchWithAuth(USER_PERMISSIONS_ENDPOINT, { method: 'GET' });
    const data = await response.json();
    return data?.permissions || data || derivePermissions(user);
  } catch {
    return derivePermissions(user);
  }
}

export async function login({ username, password, rememberMe = false }) {
  if (USE_DEMO) {
    const found = DEMO_USERS.find(
      (u) => u.username.toLowerCase() === String(username).toLowerCase()
    );
    if (!found || found.password !== password) {
      throw new Error('Invalid username or password');
    }
    const user = { ...normalizeUser(found) };
    const permissions = derivePermissions(user);
    const token = `demo-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const expiresAt = Date.now() + SESSION_MAX_AGE;
    saveSession({ token, user, permissions, expiresAt }, rememberMe);
    return { token, user, permissions, expiresAt };
  }

  const response = await fetch(`${API_BASE_URL}${AUTH_LOGIN_ENDPOINT}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Invalid username or password');
  }

  const data = await response.json();
  const token = data.accessToken || data.token || data.access_token;
  if (!token) throw new Error('Invalid authentication response from server.');

  const expiresAt = computeExpiry(data);
  setToken(token, rememberMe);

  const user = data.user ? normalizeUser(data.user) : await getCurrentUser();
  const permissions = await getPermissionsFromApi(user);

  saveSession({ token, user, permissions, expiresAt }, rememberMe);
  return { token, user, permissions, expiresAt };
}

export async function logout() {
  if (!USE_DEMO) {
    const token = getToken();
    if (token) {
      try {
        await fetch(`${API_BASE_URL}${AUTH_LOGOUT_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          credentials: 'include',
        });
      } catch (err) {
        // If the backend is unreachable, still clear the client-side session.
        // eslint-disable-next-line no-console
        if (process.env.NODE_ENV === 'development') console.warn('Logout API call failed:', err);
      }
    }
  }
  clearAuthStorage();
  notificationService.success('You have been logged out successfully.');
}

export async function refreshSession() {
  if (USE_DEMO) {
    const session = getStoredSession();
    if (!session?.token) throw new Error('No active session.');
    const expiresAt = Date.now() + SESSION_MAX_AGE;
    const remember = session.remember;
    saveSession({ ...session, expiresAt }, remember);
    return { token: session.token, expiresAt };
  }

  const token = getToken();
  if (!token) throw new Error('No active session.');

  const response = await fetch(`${API_BASE_URL}${AUTH_REFRESH_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: 'include',
  });

  if (!response.ok) {
    if (response.status === 401) {
      handleUnauthorized('Your session has expired. Please log in again.');
      throw new ApiError('Your session has expired. Please log in again.', 401, 'UNAUTHORIZED', true);
    }
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Session refresh failed.');
  }

  const data = await response.json();
  const newToken = data.accessToken || data.token || data.access_token || token;
  const expiresAt = computeExpiry(data);
  const remember = isLocalStorageActive();

  saveSession({ token: newToken, user: getStoredUser(), permissions: getStoredPermissions(), expiresAt }, remember);
  return { token: newToken, expiresAt };
}

/**
 * Verify an existing session on application start.
 * Returns the session object if valid, or null (with storage cleared) if the
 * session is missing, expired, or rejected by the backend.
 */
export async function verifySession() {
  const session = getStoredSession();
  if (!session || !session.token) {
    clearAuthStorage();
    return null;
  }
  if (session.expiresAt && session.expiresAt <= Date.now()) {
    clearAuthStorage();
    return null;
  }

  if (USE_DEMO) {
    return session;
  }

  try {
    const user = await getCurrentUser();
    const permissions = await getPermissionsFromApi(user);
    const expiresAt = session.expiresAt;
    saveSession({ token: session.token, user, permissions, expiresAt }, session.remember);
    return { token: session.token, user, permissions, expiresAt, remember: session.remember };
  } catch (err) {
    if (err?.code === 'UNAUTHORIZED' || err?.status === 401 || err?.status === 403) {
      clearAuthStorage();
      return null;
    }
    // Don't treat a network hiccup as an expired session on first load if the
    // token is still within its local expiry window.  Let the user try to
    // continue and fail later if the network really is down.
    if (session.expiresAt && session.expiresAt > Date.now()) {
      return { ...session, remember: session.remember };
    }
    clearAuthStorage();
    return null;
  }
}
