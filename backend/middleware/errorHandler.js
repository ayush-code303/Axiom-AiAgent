/**
 * Error Handling Middleware
 * Centralized error handling for the AXIOM AI Agent
 */

export function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  res.status(statusCode).json({
    success: false,
    error: err.message,
    // Only show stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}
