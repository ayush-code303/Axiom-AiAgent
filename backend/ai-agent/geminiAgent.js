/**
 * AXIOM AI Agent Module
 * Handles interactions with Google Gemini API for content analysis
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';

/**
 * Get the Gemini model instance
 * Using gemini-pro for text-based tasks
 */
const getModel = () => {
  if (!config.geminiApiKey) {
    throw new Error('GEMINI_API_KEY is required to use Gemini features.');
  }
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  return genAI.getGenerativeModel({ model: 'gemini-pro' });
};

/**
 * Summarize Content
 * Takes user-provided content and generates a concise summary
 * 
 * @param {string} content - The text content to summarize
 * @returns {Promise<Object>} Object containing the summary and metadata
 */
export async function summarizeContent(content) {
  try {
    const model = getModel();
    
    // Create a clear prompt for summarization
    const prompt = `Please provide a clear and concise summary of the following content. 
Focus on the main ideas and key points. Keep the summary informative but brief.

Content to summarize:
${content}

Summary:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();
    
    return {
      success: true,
      summary: summary.trim(),
      originalLength: content.length,
      summaryLength: summary.length,
      timestamp: new Date().toISOString(),
      // Placeholder for future blockchain verification hash
      verificationHash: null
    };
  } catch (error) {
    console.error('Error in summarizeContent:', error.message);
    throw new Error(`Failed to summarize content: ${error.message}`);
  }
}

/**
 * Extract Factual Claims
 * Identifies and extracts key factual claims from the provided content
 * 
 * @param {string} content - The text content to analyze
 * @returns {Promise<Object>} Object containing extracted claims and metadata
 */
export async function extractFactualClaims(content) {
  try {
    const model = getModel();
    
    // Create a detailed prompt for claim extraction
    const prompt = `Analyze the following content and extract all key factual claims.
For each claim, identify:
1. The specific factual statement
2. The type of claim (statistical, historical, scientific, etc.)
3. Whether it appears to be verifiable

Present the claims in a clear, numbered list format.

Content to analyze:
${content}

Extracted Factual Claims:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const claimsText = response.text();
    
    // Parse the response to structure the claims
    const claimsArray = parseClaimsFromResponse(claimsText);
    
    return {
      success: true,
      claims: claimsArray,
      totalClaims: claimsArray.length,
      rawResponse: claimsText.trim(),
      timestamp: new Date().toISOString(),
      // Placeholder for future blockchain verification
      verificationHash: null,
      blockchainReady: true  // Flag indicating this data structure is ready for blockchain integration
    };
  } catch (error) {
    console.error('Error in extractFactualClaims:', error.message);
    throw new Error(`Failed to extract factual claims: ${error.message}`);
  }
}

/**
 * Helper function to parse claims from AI response
 * Converts the text response into a structured array
 * 
 * @param {string} claimsText - The raw text response from AI
 * @returns {Array} Array of parsed claims
 */
function parseClaimsFromResponse(claimsText) {
  // Minimum length for a claim to be considered substantial
  // Filters out headers, labels, and fragments that aren't actual claims
  const MIN_CLAIM_LENGTH = 20;
  
  const lines = claimsText.split('\n').filter(line => line.trim());
  const claims = [];
  
  lines.forEach(line => {
    // Match numbered items (1., 2., etc.) or bullet points
    const match = line.match(/^(\d+\.|\*|\-)\s*(.+)$/);
    if (match) {
      claims.push({
        claim: match[2].trim(),
        extracted: true
      });
    } else if (line.trim().length > MIN_CLAIM_LENGTH) {
      // Include substantial lines that aren't numbered
      claims.push({
        claim: line.trim(),
        extracted: true
      });
    }
  });
  
  return claims;
}

/**
 * Validate Content Input
 * Ensures the content meets basic requirements before processing
 * 
 * @param {string} content - The content to validate
 * @returns {Object} Validation result
 */
export function validateContent(content) {
  if (!content || typeof content !== 'string') {
    return {
      valid: false,
      error: 'Content must be a non-empty string'
    };
  }
  
  const trimmedContent = content.trim();
  
  if (trimmedContent.length < 10) {
    return {
      valid: false,
      error: 'Content must be at least 10 characters long'
    };
  }
  
  if (trimmedContent.length > 50000) {
    return {
      valid: false,
      error: 'Content exceeds maximum length of 50,000 characters'
    };
  }
  
  return { valid: true };
}

// Export the AI agent functions
export default {
  summarizeContent,
  extractFactualClaims,
  validateContent,
};
