const express = require('express');
const { getMe } = require('../controllers/profile.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// GET /api/profile/me — Authenticated (the current user's own profile only)
router.get('/me', protect, getMe);

module.exports = router;
