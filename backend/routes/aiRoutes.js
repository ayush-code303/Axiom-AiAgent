/**
 * AI Agent Routes
 * Defines the API endpoints for AXIOM AI Agent
 * 
 * Available endpoints:
 * - POST /api/ai/summarize - Summarize content
 * - POST /api/ai/extract-claims - Extract factual claims
 * - GET /api/ai/health - Health check
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

/**
 * POST /api/ai/summarize
 * Generate a concise summary of the provided content
 * 
 * Request body:
 * {
 *   "content": "Your text content here..."
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "summary": "Generated summary...",
 *   "originalLength": 1000,
 *   "summaryLength": 200,
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 */
router.post('/summarize', aiController.summarize);

/**
 * POST /api/ai/extract-claims
 * Extract key factual claims from the provided content
 * 
 * Request body:
 * {
 *   "content": "Your text content here..."
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "claims": [...],
 *   "totalClaims": 5,
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 */
router.post('/extract-claims', aiController.extractClaims);

/**
 * GET /api/ai/health
 * Check if the AI agent service is running
 * 
 * Response:
 * {
 *   "success": true,
 *   "message": "AXIOM AI Agent is running",
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 */
router.get('/health', aiController.healthCheck);

module.exports = router;
