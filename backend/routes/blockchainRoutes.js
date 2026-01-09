/**
 * Blockchain Routes
 * Defines the API endpoints for blockchain operations
 */

import express from 'express';
import { anchor, check, getInfo } from '../controllers/blockchainController.js';

const router = express.Router();

/**
 * POST /api/blockchain/anchor
 * Store a proof hash on the blockchain via AxiomProofStore contract
 * 
 * Request body:
 * {
 *   "proofHash": "abc123... (64 hex characters or with 0x prefix)"
 * }
 * 
 * Response (success):
 * {
 *   "success": true,
 *   "transactionHash": "0x...",
 *   "blockNumber": 12345,
 *   "gasUsed": "50000",
 *   "status": "confirmed",
 *   "contractAddress": "0x...",
 *   "proofHash": "0xabc123...",
 *   "timestamp": "2024-01-10T00:00:00.000Z"
 * }
 * 
 * Response (error):
 * {
 *   "success": false,
 *   "error": "Error message",
 *   "proofHash": "0xabc123...",
 *   "timestamp": "2024-01-10T00:00:00.000Z"
 * }
 */
router.post('/anchor', anchor);

/**
 * GET /api/blockchain/info?hash=abc123...
 * Retrieve proof timestamp and existence status from blockchain
 * 
 * Query parameters:
 * - hash: The proof hash to look up (64 hex characters)
 * 
 * Response:
 * {
 *   "success": true,
 *   "proofHash": "0xabc123...",
 *   "timestamp": 1234567890,
 *   "exists": true,
 *   "timestamp_iso": "2024-01-10T00:00:00.000Z"
 * }
 */
router.get('/info', getInfo);

/**
 * GET /api/blockchain/check?hash=abc123...
 * Check if a proof exists on the blockchain
 * 
 * Query parameters:
 * - hash: The proof hash to check
 * 
 * Response:
 * {
 *   "success": true,
 *   "proofHash": "abc123...",
 *   "exists": true,
 *   "message": "Proof found on blockchain"
 * }
 */
router.get('/check', check);

export default router;
