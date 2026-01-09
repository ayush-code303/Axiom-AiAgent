/**
 * Verification Controller
 * Handles HTTP requests for content verification
 */

import { verifyHash } from '../utils/verification.js';

/**
 * Verify Content Handler
 * POST endpoint to verify content integrity using SHA-256 hash
 * 
 * Expected request body:
 * {
 *   "content": "original content",
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "hash": "expected hash value"
 * }
 */
export async function verify(req, res) {
  try {
    const { content, timestamp, hash } = req.body;

    // Validate input
    if (!content || typeof content !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Content must be provided as a non-empty string'
      });
    }

    if (!timestamp || typeof timestamp !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Timestamp must be provided as an ISO string'
      });
    }

    if (!hash || typeof hash !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Hash must be provided for verification'
      });
    }

    // Perform verification
    console.log(`Processing verification request for content (${content.length} characters)`);
    const result = verifyHash(content, timestamp, hash);

    // Return response with appropriate status code
    const statusCode = result.verified ? 200 : 400;
    
    return res.status(statusCode).json({
      success: result.verified,
      ...result
    });

  } catch (error) {
    console.error('Error in verify controller:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to process verification request',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
}

export default { verify };
