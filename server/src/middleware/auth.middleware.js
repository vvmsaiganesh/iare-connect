const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Authentication middleware.
 * Reads the JWT from the httpOnly session cookie, verifies its signature and
 * loads the current user from the database. The user's identity and role are
 * ALWAYS derived from the verified token — never from anything the frontend sends.
 */
const protect = async (req, res, next) => {
  try {
    const token = req.cookies && req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: 'Not authenticated. Please log in.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Session is invalid or has expired. Please log in again.' });
    }

    // passwordHash is excluded from every request (select: false + explicit '-').
    const user = await User.findById(decoded.id).select('-passwordHash');
    if (!user) {
      return res.status(401).json({ message: 'Account no longer exists. Please contact the Admin.' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

module.exports = { protect };
