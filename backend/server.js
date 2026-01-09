/**
 * AXIOM AI Agent - Main Server
 * 
 * A conversational AI agent built with Node.js and Express
 * that uses Google Gemini API to summarize and extract key factual
 * claims from user-provided content.
 * 
 * Architecture designed for future blockchain-based verification integration.
 * 
 * Author: AXIOM Team
 * Version: 1.0.0
 */

const express = require('express');
const config = require('./config/config');
const aiRoutes = require('./routes/aiRoutes');
const requestLogger = require('./middleware/requestLogger');
const { notFound, errorHandler } = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(requestLogger); // Log all requests

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to AXIOM AI Agent',
    description: 'A conversational AI agent for content summarization and factual claim extraction',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/ai/health',
      summarize: 'POST /api/ai/summarize',
      extractClaims: 'POST /api/ai/extract-claims'
    },
    documentation: 'See README.md for detailed API documentation'
  });
});

// API Routes
app.use('/api/ai', aiRoutes);

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 AXIOM AI Agent Server Started');
  console.log('='.repeat(50));
  console.log(`📡 Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
  console.log('='.repeat(50));
  console.log('\nAvailable endpoints:');
  console.log(`  GET  /                          - Welcome message`);
  console.log(`  GET  /api/ai/health             - Health check`);
  console.log(`  POST /api/ai/summarize          - Summarize content`);
  console.log(`  POST /api/ai/extract-claims     - Extract factual claims`);
  console.log('='.repeat(50));
  console.log('\n💡 Tip: Use tools like Postman or curl to test the API');
  console.log('📚 See README.md for detailed usage examples\n');
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⚠️  SIGTERM received, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n⚠️  SIGINT received, shutting down gracefully...');
  process.exit(0);
});
