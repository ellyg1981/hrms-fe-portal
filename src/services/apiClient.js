/**
 * Centralized HTTP client.
 *
 * Automatically attaches the Bearer token to protected requests, handles
 * 401/403/500 responses, and dispatches a global unauthorized event when the
 * backend rejects the session.
 */

import { API_BASE_URL } from '../config/api';
import { getToken, handleUnauthorized, ApiError } from './authApi';

function buildUrl(endpoint, params = {}) {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

function getHeaders() {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function request(method, endpoint, data, params) {
  const url = buildUrl(endpoint, params);
  const options = {
    method,
    headers: getHeaders(),
    credentials: 'include',
  };

  if (data && method !== 'GET') {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);

    if (response.status === 401) {
      handleUnauthorized('Your session has expired. Please log in again.');
      throw new ApiError('Your session has expired. Please log in again.', 401, 'UNAUTHORIZED', true);
    }

    if (response.status === 403) {
      throw new ApiError(
        'Access denied. You do not have permission to perform this action.',
        403,
        'FORBIDDEN'
      );
    }

    if (!response.ok) {
      const text = await response.text().catch(() => 'An unexpected error occurred.');
      throw new ApiError(text || `Request failed with status ${response.status}`, response.status, 'HTTP_ERROR');
    }

    const contentType = response.headers.get('content-type') || '';
    return contentType.includes('application/json') ? response.json() : response.text();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.message || 'Network error. Please check your connection.', 0, 'NETWORK_ERROR');
  }
}

export const apiClient = {
  get: (endpoint, params) => request('GET', endpoint, undefined, params),
  post: (endpoint, data) => request('POST', endpoint, data),
  put: (endpoint, data) => request('PUT', endpoint, data),
  patch: (endpoint, data) => request('PATCH', endpoint, data),
  del: (endpoint) => request('DELETE', endpoint),
};
