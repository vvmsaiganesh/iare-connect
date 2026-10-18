const { sanitizeUser } = require('../utils/sanitizeUser');

/**
 * GET /api/profile/me  (Authenticated)
 * Returns the CURRENT user's own profile.
 * The user is resolved from the verified JWT — the backend never trusts a
 * user id or role supplied by the frontend, so one user can never see
 * another user's profile.
 */
const getMe = async (req, res, next) => {
  try {
    res.json({ profile: sanitizeUser(req.user) });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe };
