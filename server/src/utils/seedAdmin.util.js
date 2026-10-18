const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Idempotently ensure the env-defined admin account exists.
 *
 * Used at server startup so cloud deploys (e.g. Render, where the free tier
 * has no shell) create the admin automatically from SEED_ADMIN_EMAIL /
 * SEED_ADMIN_PASSWORD on the first boot. Safe to run on every boot:
 * - nothing configured -> no-op
 * - admin already exists -> no-op (the stored password is NEVER changed)
 * The standalone `npm run seed:admin` script behaves the same way.
 */
const ensureAdmin = async () => {
  const email = (process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || '';

  if (!email || !password) return null; // not configured — nothing to do
  if (password.length < 8) {
    console.warn('SEED_ADMIN_PASSWORD must be at least 8 characters — admin NOT seeded.');
    return null;
  }

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      console.warn(`Admin seeding skipped: ${email} already belongs to a non-admin account.`);
      return null;
    }
    return existing; // already present — never resets an existing password
  }

  const passwordHash = await bcrypt.hash(password.toLowerCase(), 10);
  const admin = await User.create({ name: 'IARE Admin', email, passwordHash, role: 'admin' });
  console.log(`Admin created: ${email}`);
  return admin;
};

module.exports = { ensureAdmin };
