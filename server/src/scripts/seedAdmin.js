/**
 * Seed script — creates the initial Admin account.
 *
 * There is NO public Admin registration in this application. The very first
 * Admin is created by running:
 *
 *   cd server
 *   npm run seed:admin
 *
 * Reads SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD from server/.env so no real
 * credentials are ever committed to GitHub.
 */
require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

const run = async () => {
  const email = (process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || '';

  if (!email) {
    throw new Error('SEED_ADMIN_EMAIL is not set. Add it to server/.env (see server/.env.example).');
  }
  if (password.length < 8) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 8 characters long. Set it in server/.env.');
  }

  await connectDB();

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== 'admin') {
      throw new Error(`A non-admin account already uses ${email}. Use a different SEED_ADMIN_EMAIL.`);
    }
    console.log(`Admin already exists: ${email} — nothing to do.`);
    await mongoose.disconnect();
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ name: 'IARE Admin', email, passwordHash, role: 'admin' });

  console.log('✅ Initial Admin account created successfully.');
  console.log(`   Email:    ${email}`);
  console.log('   (Password is stored only as a bcrypt hash.)');

  await mongoose.disconnect();
};

run().catch(async (err) => {
  console.error(`❌ Seed failed: ${err.message}`);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
