/**
 * Environment Configuration
 * Loads and validates environment variables for the AXIOM AI Agent
 */

require('dotenv').config();

const config = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Google Gemini API configuration
  geminiApiKey: process.env.GEMINI_API_KEY,
};

// Validate required configuration
if (!config.geminiApiKey) {
  console.error('ERROR: GEMINI_API_KEY is not set in environment variables');
  console.error('Please create a .env file based on .env.example');
  process.exit(1);
}

module.exports = config;
