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
};

if (!config.geminiApiKey) {
  console.warn('GEMINI_API_KEY is not set; AI features will be unavailable.');
}

export default config;
