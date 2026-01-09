/**
 * Verification Routes
 * Defines the API endpoints for content verification
 */

import express from 'express';
import { verify } from '../controllers/verificationController.js';

const router = express.Router();

/**
 * POST /api/verify
 * Verify content integrity using SHA-256 hash comparison
 * 
 * Request body:
 * {
 *   "content": "original content",
 *   "timestamp": "2024-01-01T00:00:00.000Z",
 *   "hash": "expected hash value"
 * }
 * 
 * Response (verified):
 * {
 *   "success": true,
 *   "verified": true,
 *   "status": "verified",
 *   "message": "Content integrity verified - data has not been tampered",
 *   "expectedHash": "...",
 *   "computedHash": "...",
 *   "timestamp": "..."
 * }
 * 
 * Response (tampered):
 * {
 *   "success": false,
 *   "verified": false,
 *   "status": "tampered",
 *   "message": "Content verification failed - data may have been tampered or modified",
 *   "expectedHash": "...",
 *   "computedHash": "...",
 *   "timestamp": "..."
 * }
 */
router.post('/', verify);

export default router;
