/**
 * Shape a user for API responses.
 * passwordHash is dropped here as a second layer of protection — it is also
 * excluded at the schema level with `select: false`.
 */
const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  rollNumber: user.rollNumber || null,
  studentQrId: user.studentQrId || null,
  branch: user.branch || null,
  createdAt: user.createdAt,
});

module.exports = { sanitizeUser };
