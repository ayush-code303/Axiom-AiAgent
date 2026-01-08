/**
 * Error Handling Middleware
 * Centralized error handling for the AXIOM AI Agent
 */

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 */
function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

/**
 * General Error Handler
 * Catches all errors and returns a consistent error response
 */
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    error: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = {
  notFound,
  errorHandler
};
