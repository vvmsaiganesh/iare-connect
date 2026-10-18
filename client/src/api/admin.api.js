import { apiClient } from './apiClient';

// Every route below is Admin only — enforced by the backend.
export const adminApi = {
  // POST /api/admin/faculty
  createFaculty: (payload) => apiClient.post('/admin/faculty', payload),
  // GET /api/admin/faculty
  listFaculty: () => apiClient.get('/admin/faculty'),
  // POST /api/admin/students
  createStudent: (payload) => apiClient.post('/admin/students', payload),
  // GET /api/admin/students
  listStudents: () => apiClient.get('/admin/students'),
  // PUT  /api/admin/users/:userId/reset-password — password becomes the account's email
  resetPassword: (userId) => apiClient.put(`/admin/users/${userId}/reset-password`),
};
