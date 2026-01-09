/**
 * Blockchain Controller
 * Handles HTTP requests for blockchain operations
 */

import { anchorProof, getProofInfo, proofExists } from '../services/blockchainService.js';

/**
 * Anchor Proof Handler
 * POST endpoint to store a proof hash on the blockchain
 * 
 * Expected request body:
 * {
 *   "proofHash": "abc123... (64 hex characters)"
 * }
 */
export async function anchor(req, res) {
  try {
    const { proofHash } = req.body;

    if (!proofHash || typeof proofHash !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Proof hash must be provided as a string'
      });
    }

    console.log(`Processing anchor request for hash: ${proofHash}`);
    const result = await anchorProof(proofHash);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(500).json(result);
    }

  } catch (error) {
    console.error('Error in anchor controller:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to process anchor request',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
}

/**
 * Get Proof Info Handler
 * GET endpoint to retrieve proof info from blockchain
 */
export async function getInfo(req, res) {
  try {
    const { hash } = req.query;

    if (!hash || typeof hash !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Proof hash must be provided as query parameter'
      });
    }

    console.log(`Retrieving proof info for hash: ${hash}`);
    const result = await getProofInfo(hash);

    if (result.success) {
      return res.status(200).json(result);
    } else {
      return res.status(404).json(result);
    }

  } catch (error) {
    console.error('Error in getInfo controller:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to retrieve proof info',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
}

/**
 * Check Proof Existence Handler
 * GET endpoint to check if a proof exists on blockchain
 */
export async function check(req, res) {
  try {
    const { hash } = req.query;

    if (!hash || typeof hash !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Proof hash must be provided as query parameter'
      });
    }

    console.log(`Checking proof existence for hash: ${hash}`);
    const exists = await proofExists(hash);

    return res.status(200).json({
      success: true,
      proofHash: hash,
      exists,
      message: exists ? 'Proof found on blockchain' : 'Proof not found on blockchain'
    });

  } catch (error) {
    console.error('Error in check controller:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to check proof',
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
}

export default {
  anchor,
  getInfo,
  check,
};
