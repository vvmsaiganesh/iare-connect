const jwt = require('jsonwebtoken');

/** Convert durations like "1d", "12h", "30m" to milliseconds (default: 1 day). */
const durationToMs = (value) => {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/i.exec(String(value || '1d').trim());
  if (!match) return 24 * 60 * 60 * 1000;
  const amount = Number(match[1]);
  const unit = (match[2] || 'd').toLowerCase();
  const factor = { ms: 1, s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 }[unit];
  return amount * factor;
};

const getExpiresIn = () => process.env.JWT_EXPIRES_IN || '1d';

/** Sign a JWT containing only the user id and role. */
const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: getExpiresIn(),
  });

/**
 * Cookie options for the session cookie.
 * httpOnly → the token is never readable from JavaScript (XSS-safe storage).
 */
const cookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  maxAge: durationToMs(getExpiresIn()),
});

module.exports = { signToken, cookieOptions };
