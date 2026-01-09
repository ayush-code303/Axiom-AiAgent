/**
 * Request Logger Middleware
 * Logs incoming requests for debugging and monitoring
 */

function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  
  // Log request body for POST requests (but hide sensitive data)
  if (req.method === 'POST' && req.body) {
    const bodyPreview = req.body.content 
      ? `Content length: ${req.body.content.length} characters`
      : JSON.stringify(req.body);
    console.log(`  Body: ${bodyPreview}`);
  }
  
  next();
}

module.exports = requestLogger;
