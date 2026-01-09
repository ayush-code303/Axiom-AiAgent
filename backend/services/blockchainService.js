/**
 * Blockchain Service for AXIOM
 * Handles interaction with AxiomProofStore contract on Sepolia testnet
 * Uses ethers.js to connect, sign transactions, and anchor proofs
 */

import { ethers } from 'ethers';
import config from '../config/config.js';

let provider = null;
let signer = null;
let contract = null;

/**
 * Initialize the blockchain connection
 * Sets up provider, signer, and contract instance
 * 
 * @throws {Error} If blockchain configuration is incomplete
 */
function initializeBlockchain() {
  if (provider && signer && contract) {
    return; // Already initialized
  }

  const { rpcUrl, privateKey, contractAddress, contractAbi } = config.blockchain;

  // Validate configuration
  if (!rpcUrl || !privateKey || !contractAddress) {
    throw new Error(
      'Blockchain configuration incomplete. Ensure BLOCKCHAIN_RPC_URL, BLOCKCHAIN_PRIVATE_KEY, and BLOCKCHAIN_CONTRACT_ADDRESS are set.'
    );
  }

  if (!contractAbi || contractAbi.length === 0) {
    throw new Error('BLOCKCHAIN_CONTRACT_ABI must be a valid JSON array');
  }

  try {
    // Create provider for Sepolia testnet
    provider = new ethers.providers.JsonRpcProvider(rpcUrl);

    // Create signer from private key
    signer = new ethers.Wallet(privateKey, provider);

    // Create contract instance
    contract = new ethers.Contract(contractAddress, contractAbi, signer);

    console.log(`✅ Blockchain service initialized for ${contractAddress} on Sepolia`);
  } catch (error) {
    throw new Error(`Failed to initialize blockchain service: ${error.message}`);
  }
}

/**
 * Anchor a proof hash to the blockchain
 * Calls storeProof(bytes32) on AxiomProofStore contract
 * 
 * @param {string} proofHash - The SHA-256 hash to store (hex string or bytes32)
 * @returns {Promise<Object>} Transaction result with hash and details
 * 
 * @throws {Error} If blockchain is not initialized or transaction fails
 */
export async function anchorProof(proofHash) {
  try {
    initializeBlockchain();

    // Ensure hash is in bytes32 format
    let hashBytes32 = proofHash;
    if (typeof proofHash === 'string' && proofHash.length === 64) {
      // Hex string without 0x prefix
      hashBytes32 = '0x' + proofHash;
    } else if (typeof proofHash === 'string' && !proofHash.startsWith('0x')) {
      hashBytes32 = '0x' + proofHash;
    }

    // Validate hash format
    if (!ethers.utils.isHexString(hashBytes32, 32)) {
      throw new Error('Proof hash must be 32 bytes (64 hex characters)');
    }

    console.log(`📦 Anchoring proof ${hashBytes32} to blockchain...`);

    // Call storeProof on the contract
    const tx = await contract.storeProof(hashBytes32);

    console.log(`✅ Transaction sent: ${tx.hash}`);

    // Wait for transaction to be mined
    const receipt = await tx.wait();

    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

    return {
      success: true,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      status: receipt.status === 1 ? 'confirmed' : 'failed',
      contractAddress: contract.address,
      proofHash: hashBytes32,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error anchoring proof:', error.message);
    return {
      success: false,
      error: error.message,
      proofHash: proofHash || null,
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Get the proof timestamp from the contract
 * Calls getProofTimestamp(bytes32) on AxiomProofStore contract
 * 
 * @param {string} proofHash - The SHA-256 hash to look up
 * @returns {Promise<Object>} Timestamp and existence status
 */
export async function getProofInfo(proofHash) {
  try {
    initializeBlockchain();

    // Ensure hash is in bytes32 format
    let hashBytes32 = proofHash;
    if (typeof proofHash === 'string' && proofHash.length === 64) {
      hashBytes32 = '0x' + proofHash;
    } else if (typeof proofHash === 'string' && !proofHash.startsWith('0x')) {
      hashBytes32 = '0x' + proofHash;
    }

    const timestamp = await contract.getProofTimestamp(hashBytes32);
    const exists = await contract.proofExists(hashBytes32);

    return {
      success: true,
      proofHash: hashBytes32,
      timestamp: timestamp.toNumber(),
      exists,
      timestamp_iso: timestamp.toNumber() > 0 ? new Date(timestamp.toNumber() * 1000).toISOString() : null,
    };
  } catch (error) {
    console.error('Error retrieving proof info:', error.message);
    return {
      success: false,
      error: error.message,
      proofHash: proofHash || null,
    };
  }
}

/**
 * Check if a proof exists on the blockchain
 * 
 * @param {string} proofHash - The SHA-256 hash to check
 * @returns {Promise<boolean>} True if proof exists, false otherwise
 */
export async function proofExists(proofHash) {
  try {
    initializeBlockchain();

    let hashBytes32 = proofHash;
    if (typeof proofHash === 'string' && proofHash.length === 64) {
      hashBytes32 = '0x' + proofHash;
    } else if (typeof proofHash === 'string' && !proofHash.startsWith('0x')) {
      hashBytes32 = '0x' + proofHash;
    }

    return await contract.proofExists(hashBytes32);
  } catch (error) {
    console.error('Error checking proof existence:', error.message);
    return false;
  }
}

export default {
  anchorProof,
  getProofInfo,
  proofExists,
};
