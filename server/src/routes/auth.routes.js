const express = require('express');
const { login, logout, me, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { authorize } = require('../middleware/role.middleware');

const router = express.Router();

// POST /api/auth/login  — Public
router.post('/login', login);

// POST /api/auth/logout — Authenticated (clears the session cookie)
router.post('/logout', protect, logout);

// GET  /api/auth/me     — Authenticated (logged-in user's basic details)
router.get('/me', protect, me);

// PUT  /api/auth/change-password — Authenticated, Faculty & Student only
// (the admin password is fixed by the assignment)
router.put('/change-password', protect, authorize('faculty', 'student'), changePassword);

module.exports = router;
