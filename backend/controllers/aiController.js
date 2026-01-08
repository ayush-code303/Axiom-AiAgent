/**
 * AI Agent Controller
 * Handles HTTP requests for AI-powered content analysis
 * 
 * This controller acts as the bridge between the Express routes
 * and the AI agent module, handling request validation and response formatting
 */

const aiAgent = require('../ai-agent/geminiAgent');

/**
 * Summarize Content Handler
 * POST endpoint to generate a summary of user-provided content
 * 
 * Expected request body:
 * {
 *   "content": "text to summarize..."
 * }
 */
async function summarize(req, res) {
  try {
    const { content } = req.body;
    
    // Validate input
    const validation = aiAgent.validateContent(content);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }
    
    // Process the content
    console.log(`Processing summarization request (${content.length} characters)`);
    const result = await aiAgent.summarizeContent(content);
    
    // Return successful response
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error in summarize controller:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to process summarization request',
      details: error.message
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
async function extractClaims(req, res) {
  try {
    const { content } = req.body;
    
    // Validate input
    const validation = aiAgent.validateContent(content);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        error: validation.error
      });
    }
    
    // Process the content
    console.log(`Processing claim extraction request (${content.length} characters)`);
    const result = await aiAgent.extractFactualClaims(content);
    
    // Return successful response
    return res.status(200).json(result);
    
  } catch (error) {
    console.error('Error in extractClaims controller:', error.message);
    return res.status(500).json({
      success: false,
      error: 'Failed to process claim extraction request',
      details: error.message
    });
  }
}

/**
 * Health Check Handler
 * GET endpoint to verify the AI agent service is running
 */
function healthCheck(req, res) {
  return res.status(200).json({
    success: true,
    message: 'AXIOM AI Agent is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
}

module.exports = {
  summarize,
  extractClaims,
  healthCheck
};
