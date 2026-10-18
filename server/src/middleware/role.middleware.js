/**
 * Role-based authorization middleware.
 * Enforced in Express (the backend), not just by hiding buttons in React.
 *
 * Usage: router.post('/faculty', protect, authorize('admin'), createFaculty)
 */
const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      message: 'Access denied. You do not have permission to perform this action.',
    });
  }
  next();
};

module.exports = { authorize };
