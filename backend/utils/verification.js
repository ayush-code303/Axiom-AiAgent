/**
 * Verification Utility for AXIOM
 * Handles SHA-256 hash generation and verification for content integrity
 */

import crypto from 'crypto';

/**
 * Generate SHA-256 hash from content and timestamp
 * 
 * @param {string} content - The content to hash
 * @param {string} timestamp - ISO timestamp string
 * @returns {string} Hex-encoded SHA-256 hash
 */
export function generateHash(content, timestamp) {
  if (!content || typeof content !== 'string') {
    throw new Error('Content must be a non-empty string');
  }
  if (!timestamp || typeof timestamp !== 'string') {
    throw new Error('Timestamp must be a valid ISO string');
  }

  const data = `${content}|${timestamp}`;
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex');
}

/**
 * Verify content integrity by comparing hashes
 * 
 * @param {string} content - The content to verify
 * @param {string} timestamp - Original timestamp used in hash generation
 * @param {string} expectedHash - The hash to verify against
 * @returns {Object} Verification result with status and details
 */
export function verifyHash(content, timestamp, expectedHash) {
  try {
    if (!expectedHash || typeof expectedHash !== 'string') {
      return {
        verified: false,
        status: 'invalid',
        message: 'Expected hash is missing or invalid',
        expectedHash: null,
        computedHash: null,
      };
    }

    const computedHash = generateHash(content, timestamp);
    const verified = computedHash === expectedHash;

    return {
      verified,
      status: verified ? 'verified' : 'tampered',
      message: verified 
        ? 'Content integrity verified - data has not been tampered'
        : 'Content verification failed - data may have been tampered or modified',
      expectedHash,
      computedHash,
      timestamp,
    };
  } catch (error) {
    return {
      verified: false,
      status: 'error',
      message: `Verification error: ${error.message}`,
      expectedHash,
      computedHash: null,
      error: error.message,
    };
  }
}

/**
 * Create a verifiable data package with hash
 * 
 * @param {string} content - The content to package
 * @param {Object} metadata - Additional metadata
 * @returns {Object} Data package with hash
 */
export function createVerifiablePackage(content, metadata = {}) {
  const timestamp = new Date().toISOString();
  const hash = generateHash(content, timestamp);

  return {
    content,
    timestamp,
    verificationHash: hash,
    metadata,
    blockchainReady: true,
  };
}

export default {
  generateHash,
  verifyHash,
  createVerifiablePackage,
};
