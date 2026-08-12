/**
 * Centralized API configuration.
 *
 * Endpoint and feature flags are read from the environment so the same
 * client code works in demo/development mode and against the real backend
 * without modification.
 */

export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

export const USE_DEMO =
  process.env.REACT_APP_USE_DEMO_EMPLOYEES === 'true' || !API_BASE_URL;

export const AUTH_LOGIN_ENDPOINT =
  process.env.REACT_APP_AUTH_LOGIN_ENDPOINT || '/api/auth/login';
export const AUTH_LOGOUT_ENDPOINT =
  process.env.REACT_APP_AUTH_LOGOUT_ENDPOINT || '/api/auth/logout';
export const AUTH_REFRESH_ENDPOINT =
  process.env.REACT_APP_AUTH_REFRESH_ENDPOINT || '/api/auth/refresh';
export const AUTH_VERIFY_ENDPOINT =
  process.env.REACT_APP_AUTH_VERIFY_ENDPOINT || '/api/auth/verify';
export const USER_PERMISSIONS_ENDPOINT =
  process.env.REACT_APP_USER_PERMISSIONS_ENDPOINT || '/api/auth/permissions';

export const EMPLOYEE_ME_ENDPOINT =
  process.env.REACT_APP_EMPLOYEE_ME_ENDPOINT || '/api/employees/me';
export const EMPLOYEE_SEARCH_ENDPOINT =
  process.env.REACT_APP_EMPLOYEE_SEARCH_ENDPOINT || '/api/employees/search';

export const ANUAI_REQUESTS_ENDPOINT =
  process.env.REACT_APP_ANUAI_REQUESTS_ENDPOINT || '/api/anuai/requests';
export const ANUAI_REQUEST_ENDPOINT =
  process.env.REACT_APP_ANUAI_REQUEST_ENDPOINT || '/api/anuai/requests';

// Session lifetime values (client side)
export const SESSION_INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 30 minutes
export const SESSION_WARNING_TIME = 2 * 60 * 1000;        // 2 minutes
export const SESSION_MAX_AGE = 8 * 60 * 60 * 1000;        // 8 hours
