const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { signToken, cookieOptions } = require('../utils/generateToken');
const { sanitizeUser } = require('../utils/sanitizeUser');

const EMAIL_RE = /^\S+@\S+\.\S+$/;
const VALID_ROLES = ['admin', 'faculty', 'student'];
const MIN_PASSWORD_LENGTH = 8;

/**
 * POST /api/auth/login  (Public)
 * Authenticate email + password against the database and start a JWT session
 * stored in an httpOnly cookie.
 *
 * An optional `role` field lets the client state which sign-in tab is active;
 * the account must then belong to that role, so a student credential cannot
 * be used from the Faculty tab (and so on). Checked only *after* the password
 * matches, so it adds no account-enumeration vector. Omitting `role` keeps
 * the original contract behaviour.
 */
const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are both required.' });
    }
    if (!EMAIL_RE.test(String(email).trim())) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const user = await User.findOne({ email: String(email).trim().toLowerCase() }).select('+passwordHash');

    // Same message for "no such user" and "wrong password" so accounts cannot
    // be enumerated by watching login responses.
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Case-insensitive passwords: the hash is stored over the LOWERCASED
    // password and the input is lowercased the same way, so any
    // capitalisation works (emails & roll numbers as passwords).
    const match = await bcrypt.compare(String(password).toLowerCase(), user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Role-tab guard — only reached with the correct password.
    if (role && VALID_ROLES.includes(role) && user.role !== role) {
      const tab = user.role.charAt(0).toUpperCase() + user.role.slice(1);
      return res.status(401).json({
        message: `This account belongs to the ${tab} tab. Please sign in from the ${tab} tab instead.`,
      });
    }

    const token = signToken(user);
    res.cookie('token', token, cookieOptions());

    res.json({
      message: 'Logged in successfully.',
      user: sanitizeUser(user),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout  (Authenticated)
 * Clears the session cookie.
 */
const logout = async (req, res, next) => {
  try {
    res.clearCookie('token', { ...cookieOptions(), maxAge: undefined });
    res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me  (Authenticated)
 * Returns the logged-in user's basic details, derived from the verified JWT.
 */
const me = async (req, res, next) => {
  try {
    res.json({ user: sanitizeUser(req.user) });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/change-password  (Authenticated — Faculty & Student only)
 * Change your own password after re-entering the current one.
 * The admin password is fixed by the assignment, so it is excluded here.
 */
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are both required.' });
    }
    if (String(newPassword).length < MIN_PASSWORD_LENGTH) {
      return res
        .status(400)
        .json({ message: `New password must be at least ${MIN_PASSWORD_LENGTH} characters long.` });
    }
    if (String(newPassword) === String(currentPassword)) {
      return res.status(400).json({ message: 'New password must be different from the current password.' });
    }

    // protect() stripped passwordHash, so re-fetch it just for this check.
    const user = await User.findById(req.user.id).select('+passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Account no longer exists. Please contact the Admin.' });
    }

    // Same case-insensitive policy as login: compare and store lowercased.
    const match = await bcrypt.compare(String(currentPassword).toLowerCase(), user.passwordHash);
    if (!match) {
      return res.status(401).json({ message: 'Current password is incorrect.' });
    }

    user.passwordHash = await bcrypt.hash(String(newPassword).toLowerCase(), 10);
    await user.save();

    res.json({ message: 'Password changed successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, me, changePassword };
