const crypto = require('crypto');
const mongoose = require('mongoose');

/**
 * A single User model with a `role` field covers all three roles:
 * admin, faculty and student (as required by the assignment).
 *
 * - email         → unique for every account
 * - passwordHash  → bcrypt hash only; a plaintext password is NEVER stored
 * - rollNumber    → required for students, unique across students
 * - studentQrId   → unique, non-sensitive identifier that is encoded in the
 *                   student's QR code (never a password or auth token)
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // never returned in API responses by default
    },
    role: {
      type: String,
      enum: {
        values: ['admin', 'faculty', 'student'],
        message: 'Role must be admin, faculty or student',
      },
      required: [true, 'Role is required'],
    },
    rollNumber: {
      type: String,
      trim: true,
      unique: true,
      sparse: true, // only students have a roll number
    },
    studentQrId: {
      type: String,
      unique: true,
      sparse: true, // only students have a QR identifier
    },
    branch: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Students must always have a unique roll number and a QR identifier.
userSchema.pre('validate', function () {
  if (this.role === 'student') {
    if (!this.rollNumber) {
      this.invalidate('rollNumber', 'Roll number is required for students');
    }
    if (!this.studentQrId) {
      // Non-sensitive random identifier: contains no password and no auth token.
      this.studentQrId = `IARE-STU-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;
    }
  }
});

module.exports = mongoose.model('User', userSchema);
