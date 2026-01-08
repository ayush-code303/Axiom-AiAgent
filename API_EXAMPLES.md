# API Usage Examples

This document provides practical examples for using the AXIOM AI Agent API.

## Table of Contents
- [Basic Examples](#basic-examples)
- [JavaScript Examples](#javascript-examples)
- [Python Examples](#python-examples)
- [Error Handling](#error-handling)

## Basic Examples

### 1. Health Check

**Request:**
```bash
curl http://localhost:3000/api/ai/health
```

**Response:**
```json
{
  "success": true,
  "message": "AXIOM AI Agent is running",
  "timestamp": "2024-01-08T20:00:00.000Z",
  "version": "1.0.0"
}
```

### 2. Summarize Content

**Request:**
```bash
curl -X POST http://localhost:3000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals. The term artificial intelligence is often used to describe machines that mimic cognitive functions that humans associate with the human mind, such as learning and problem solving."
  }'
```

**Response:**
```json
{
  "success": true,
  "summary": "AI is machine intelligence used in systems that perceive and act to achieve goals, mimicking human cognitive functions like learning and problem solving.",
  "originalLength": 489,
  "summaryLength": 145,
  "timestamp": "2024-01-08T20:00:00.000Z",
  "verificationHash": null
}
```

### 3. Extract Factual Claims

**Request:**
```bash
curl -X POST http://localhost:3000/api/ai/extract-claims \
  -H "Content-Type: application/json" \
  -d '{
    "content": "The Earth orbits the Sun once every 365.25 days, which is why we have leap years every four years. Water boils at 100 degrees Celsius at sea level atmospheric pressure. The speed of light in vacuum is approximately 299,792,458 meters per second. Mount Everest is 8,848 meters tall, making it the highest mountain on Earth."
  }'
```

**Response:**
```json
{
  "success": true,
  "claims": [
    {
      "claim": "The Earth orbits the Sun once every 365.25 days",
      "extracted": true
    },
    {
      "claim": "Water boils at 100 degrees Celsius at sea level atmospheric pressure",
      "extracted": true
    },
    {
      "claim": "The speed of light in vacuum is approximately 299,792,458 meters per second",
      "extracted": true
    },
    {
      "claim": "Mount Everest is 8,848 meters tall",
      "extracted": true
    }
  ],
  "totalClaims": 4,
  "timestamp": "2024-01-08T20:00:00.000Z",
  "verificationHash": null,
  "blockchainReady": true
}
```

## JavaScript Examples

### Using Fetch API (Browser or Node.js 18+)

```javascript
// Configuration
const BASE_URL = 'http://localhost:3000';

// 1. Check Service Health
async function checkHealth() {
  try {
    const response = await fetch(`${BASE_URL}/api/ai/health`);
    const data = await response.json();
    console.log('Service Status:', data);
    return data;
  } catch (error) {
    console.error('Health check failed:', error);
  }
}

// 2. Summarize Content
async function summarizeContent(text) {
  try {
    const response = await fetch(`${BASE_URL}/api/ai/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Summary:', data.summary);
      console.log(`Compression: ${data.originalLength} → ${data.summaryLength} chars`);
      return data;
    } else {
      console.error('Summarization failed:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// 3. Extract Claims
async function extractClaims(text) {
  try {
    const response = await fetch(`${BASE_URL}/api/ai/extract-claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: text })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`Found ${data.totalClaims} claims:`);
      data.claims.forEach((claim, index) => {
        console.log(`${index + 1}. ${claim.claim}`);
      });
      return data;
    } else {
      console.error('Claim extraction failed:', data.error);
    }
  } catch (error) {
    console.error('Request failed:', error);
  }
}

// Example usage
async function main() {
  await checkHealth();
  
  const article = `
    Climate change is one of the most pressing issues of our time. 
    Global temperatures have risen by approximately 1.1°C since the pre-industrial era. 
    The Paris Agreement aims to limit global warming to well below 2°C above pre-industrial levels.
  `;
  
  await summarizeContent(article);
  await extractClaims(article);
}

main();
```

### Using Axios (Node.js)

```javascript
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Summarize with error handling
async function summarize(content) {
  try {
    const response = await axios.post(
      `${BASE_URL}/api/ai/summarize`,
      { content },
      { headers: { 'Content-Type': 'application/json' } }
    );
    
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      console.error('Server error:', error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('No response from server');
    } else {
      // Error setting up request
      console.error('Request error:', error.message);
    }
    throw error;
  }
}
```

## Python Examples

### Using requests library

```python
import requests
import json

BASE_URL = 'http://localhost:3000'

def check_health():
    """Check if the service is running"""
    response = requests.get(f'{BASE_URL}/api/ai/health')
    return response.json()

def summarize_content(text):
    """Summarize text content"""
    response = requests.post(
        f'{BASE_URL}/api/ai/summarize',
        json={'content': text},
        headers={'Content-Type': 'application/json'}
    )
    return response.json()

def extract_claims(text):
    """Extract factual claims from text"""
    response = requests.post(
        f'{BASE_URL}/api/ai/extract-claims',
        json={'content': text},
        headers={'Content-Type': 'application/json'}
    )
    return response.json()

# Example usage
if __name__ == '__main__':
    # Check health
    health = check_health()
    print(f"Service status: {health['message']}")
    
    # Test content
    article = """
    The human brain contains approximately 86 billion neurons. 
    These neurons communicate through synapses, with each neuron 
    connected to thousands of other neurons. The brain consumes 
    about 20% of the body's energy despite being only 2% of body weight.
    """
    
    # Summarize
    summary_result = summarize_content(article)
    if summary_result['success']:
        print(f"\nSummary: {summary_result['summary']}")
        print(f"Compression: {summary_result['originalLength']} → {summary_result['summaryLength']} chars")
    
    # Extract claims
    claims_result = extract_claims(article)
    if claims_result['success']:
        print(f"\nFound {claims_result['totalClaims']} claims:")
        for i, claim in enumerate(claims_result['claims'], 1):
            print(f"{i}. {claim['claim']}")
```

## Error Handling

### Common Error Responses

**1. Missing Content**
```json
{
  "success": false,
  "error": "Content must be a non-empty string"
}
```

**2. Content Too Short**
```json
{
  "success": false,
  "error": "Content must be at least 10 characters long"
}
```

**3. Content Too Long**
```json
{
  "success": false,
  "error": "Content exceeds maximum length of 50,000 characters"
}
```

**4. API Key Not Set**
- Server will not start
- Check console for: "ERROR: GEMINI_API_KEY is not set in environment variables"

**5. Invalid API Key**
```json
{
  "success": false,
  "error": "Failed to process summarization request",
  "details": "Failed to summarize content: [API error details]"
}
```

### Best Practices for Error Handling

```javascript
async function robustApiCall(content) {
  // Validate locally before sending
  if (!content || content.length < 10) {
    console.error('Content is too short');
    return null;
  }
  
  if (content.length > 50000) {
    console.error('Content is too long');
    return null;
  }
  
  try {
    const response = await fetch('http://localhost:3000/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error(`HTTP ${response.status}:`, data.error);
      return null;
    }
    
    if (!data.success) {
      console.error('API Error:', data.error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Network Error:', error.message);
    return null;
  }
}
```

## Rate Limiting Considerations

While this version doesn't implement rate limiting, be mindful of:
- Google Gemini API rate limits
- Network bandwidth
- Processing time for large content

For production use, consider:
- Implementing request queuing
- Adding rate limiting middleware
- Caching frequently requested summaries
- Using async processing for large content

## Testing Tips

1. **Start with the health check** to ensure the service is running
2. **Test with small content first** to verify your API key works
3. **Gradually increase content size** to understand processing time
4. **Handle errors gracefully** in your application
5. **Log responses** during development for debugging

## Need Help?

- Check the main README.md for setup instructions
- Ensure your .env file is properly configured
- Verify your Gemini API key is valid
- Check server logs for detailed error messages
