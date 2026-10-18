/** 404 handler for unknown routes. */
const notFound = (req, res, next) => {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
};

/**
 * Central error handler.
 * Turns Mongoose duplicate-key / validation errors into clean, useful API
 * messages instead of leaking raw database errors.
 */
const errorHandler = (err, req, res, next) => {
  // Duplicate key (unique index on email / rollNumber / studentQrId)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || { field: 'value' })[0];
    const readable = field === 'rollNumber' ? 'roll number' : field;
    return res.status(409).json({
      message: `An account with this ${readable} already exists.`,
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(', ');
    return res.status(400).json({ message });
  }

  // Invalid MongoDB ObjectId etc.
  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid identifier supplied.' });
  }

  console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    message: err.message || 'Something went wrong on the server. Please try again.',
  });
};

module.exports = { notFound, errorHandler };
