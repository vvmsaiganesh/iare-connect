import { apiClient } from './apiClient';

export const authApi = {
  // POST /api/auth/login — Public (role = active sign-in tab)
  login: (email, password, role) => apiClient.post('/auth/login', { email, password, role }),
  // POST /api/auth/logout — Authenticated
  logout: () => apiClient.post('/auth/logout'),
  // GET /api/auth/me — Authenticated
  me: () => apiClient.get('/auth/me'),
  // PUT /api/auth/change-password — Authenticated, Faculty & Student only
  changePassword: (currentPassword, newPassword) =>
    apiClient.put('/auth/change-password', { currentPassword, newPassword }),
};
