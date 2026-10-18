const express = require('express');
const {
  createFaculty,
  listFaculty,
  createStudent,
  listStudents,
  resetPassword,
} = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// Every /api/admin/* route requires authentication AND the admin role.
router.use(protect, authorize('admin'));

// POST /api/admin/faculty  — Create a Faculty account
router.post('/faculty', createFaculty);

// GET  /api/admin/faculty  — List Faculty accounts
router.get('/faculty', listFaculty);

// POST /api/admin/students — Create a Student account
router.post('/students', createStudent);

// GET  /api/admin/students — List Student accounts
router.get('/students', listStudents);

// PUT  /api/admin/users/:userId/reset-password — Reset a Faculty/Student password
router.put('/users/:userId/reset-password', resetPassword);

module.exports = router;
