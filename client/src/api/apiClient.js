const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Small fetch wrapper for the IARE Connect API.
 * `credentials: 'include'` sends the httpOnly session cookie with every request.
 */
async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });
  } catch {
    const error = new Error('Unable to reach the server. Please check your connection and try again.');
    error.status = 0;
    throw error;
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error = new Error((data && data.message) || `Request failed with status ${res.status}.`);
    error.status = res.status;
    throw error;
  }
  return data;
}

export const apiClient = {
  get: (path) => request(path, { method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
};
