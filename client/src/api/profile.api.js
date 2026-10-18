import { apiClient } from './apiClient';

export const profileApi = {
  // GET /api/profile/me — returns the CURRENT user's own profile only
  getProfile: () => apiClient.get('/profile/me'),
};
