/**
 * AI Agent Controller
 * Handles HTTP requests for AI-powered content analysis
 */

import aiAgent, { extractFactualClaims as extractClaimsFromAgent, summarizeContent as summarizeWithAgent, validateContent } from '../ai-agent/geminiAgent.js';

/**
 * Summarize Content Handler
 * POST endpoint to generate a summary of user-provided content
 * 
 * Expected request body:
 * {
 *   "content": "text to summarize..."
 * }
 */
export async function summarize(req, res) {
  try {
    const { content } = req.body;
    
    // Validate input
    const validation = validateContent(content);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }
    
    // Process the content
    console.log(`Processing summarization request (${content.length} characters)`);
    const result = await summarizeWithAgent(content);
    
    // Return successful response
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error in summarize controller:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to process summarization request',
      // Only include error details in development mode
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
}

/**
 * Extract Factual Claims Handler
 * POST endpoint to extract key factual claims from user-provided content
 * 
 * Expected request body:
 * {
 *   "content": "text to analyze..."
 * }
 */
export async function extractClaims(req, res) {
  try {
    const { content } = req.body;
    
    // Validate input
    const validation = validateContent(content);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }
    
    // Process the content
    console.log(`Processing claim extraction request (${content.length} characters)`);
    const result = await extractClaimsFromAgent(content);
    
    // Return successful response
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error in extractClaims controller:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to process claim extraction request',
      // Only include error details in development mode
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
}

/**
 * Health Check Handler
 * GET endpoint to verify the AI agent service is running
 */
export function healthCheck(req, res) {
  return res.status(200).json({
    success: true,
    message: 'AXIOM AI Agent is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

export default {
  summarize,
  extractClaims,
  healthCheck,
};
