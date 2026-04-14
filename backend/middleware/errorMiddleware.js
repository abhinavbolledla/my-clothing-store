/**
 * notFound – Middleware to handle requests to undefined routes (404).
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * errorHandler – Global error handling middleware.
 * Catches all errors passed via next(error) throughout the app.
 */
const errorHandler = (err, req, res, next) => {
  // If status is still 200 (Express default), set it to 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  // Mongoose CastError (invalid ObjectId format)
  if (err.name === 'CastError') {
    return res.status(400).json({
      message: 'Invalid resource ID format',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // Mongoose duplicate key error (e.g., duplicate email)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      message: messages.join(', '),
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  }

  res.status(statusCode).json({
    message: err.message || 'Internal Server Error',
    // Only expose stack trace in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

module.exports = { notFound, errorHandler };
