/**
 * Environment Configuration
 * Loads and validates environment variables for the AXIOM AI Agent
 */

import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  geminiApiKey: process.env.GEMINI_API_KEY,
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL,
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
    contractAddress: process.env.BLOCKCHAIN_CONTRACT_ADDRESS,
    contractAbi: process.env.BLOCKCHAIN_CONTRACT_ABI ? JSON.parse(process.env.BLOCKCHAIN_CONTRACT_ABI) : null,
  },
};

if (!config.geminiApiKey) {
  console.warn('GEMINI_API_KEY is not set; AI features will be unavailable.');
}

if (!config.blockchain.rpcUrl || !config.blockchain.privateKey || !config.blockchain.contractAddress) {
  console.warn('Blockchain configuration incomplete; contract anchoring will be unavailable.');
}

export default config;
