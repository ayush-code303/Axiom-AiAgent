/**
 * Simple Node.js Example Client for AXIOM AI Agent
 * 
 * This example demonstrates how to interact with the AXIOM API
 * using Node.js's built-in fetch (Node 18+) or you can use axios
 * 
 * Run with: node examples/client-example.js
 */

// Configuration
const BASE_URL = 'http://localhost:3000';

/**
 * Check if the AXIOM service is running
 */
async function checkHealth() {
  console.log('🔍 Checking service health...\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai/health`);
    const data = await response.json();
    
    if (data.success) {
      console.log('✅ Service is running!');
      console.log(`   Version: ${data.version}`);
      console.log(`   Message: ${data.message}\n`);
      return true;
    }
  } catch (error) {
    console.error('❌ Service is not running!');
    console.error('   Please start the server with: npm start\n');
    return false;
  }
}

/**
 * Summarize content using AXIOM
 */
async function demonstrateSummarization() {
  console.log('📝 SUMMARIZATION DEMO\n');
  console.log('='.repeat(60));
  
  const longArticle = `
    Climate change represents one of the most significant challenges facing 
    humanity in the 21st century. The scientific consensus is clear: global 
    temperatures are rising due to increased greenhouse gas emissions from 
    human activities, primarily the burning of fossil fuels and deforestation.
    
    The effects of climate change are already visible worldwide. We're seeing 
    more frequent and intense heat waves, changing precipitation patterns, 
    melting ice caps, and rising sea levels. These changes pose serious risks 
    to ecosystems, human health, food security, and economic stability.
    
    Addressing climate change requires coordinated global action. The Paris 
    Agreement, signed by nearly 200 countries, aims to limit global warming 
    to well below 2 degrees Celsius above pre-industrial levels. Achieving 
    this goal will require significant reductions in greenhouse gas emissions, 
    transition to renewable energy sources, and adaptation strategies to cope 
    with unavoidable climate impacts.
  `;
  
  console.log('Original Article:');
  console.log(longArticle.trim());
  console.log('\n' + '-'.repeat(60) + '\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai/summarize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: longArticle })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Summary Generated:');
      console.log(data.summary);
      console.log('\n' + '-'.repeat(60));
      console.log(`📊 Compression: ${data.originalLength} → ${data.summaryLength} characters`);
      console.log(`   Reduction: ${((1 - data.summaryLength / data.originalLength) * 100).toFixed(1)}%`);
      console.log('='.repeat(60) + '\n');
    } else {
      console.error('❌ Summarization failed:', data.error);
      console.log('='.repeat(60) + '\n');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * Extract factual claims using AXIOM
 */
async function demonstrateClaimExtraction() {
  console.log('🔬 CLAIM EXTRACTION DEMO\n');
  console.log('='.repeat(60));
  
  const scientificText = `
    Water is composed of two hydrogen atoms and one oxygen atom (H2O). 
    Pure water freezes at 0 degrees Celsius (32 degrees Fahrenheit) and 
    boils at 100 degrees Celsius (212 degrees Fahrenheit) at standard 
    atmospheric pressure.
    
    The human body is approximately 60% water. An adult human needs to 
    consume about 2 to 3 liters of water per day to maintain proper hydration.
    
    The Pacific Ocean is the largest ocean on Earth, covering more than 
    63 million square miles. It contains more than half of the world's 
    free water and is deeper than the Atlantic Ocean.
  `;
  
  console.log('Text to Analyze:');
  console.log(scientificText.trim());
  console.log('\n' + '-'.repeat(60) + '\n');
  
  try {
    const response = await fetch(`${BASE_URL}/api/ai/extract-claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: scientificText })
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log(`Extracted ${data.totalClaims} factual claims:\n`);
      
      data.claims.forEach((claim, index) => {
        console.log(`${index + 1}. ${claim.claim}`);
      });
      
      console.log('\n' + '-'.repeat(60));
      console.log(`📋 Total Claims: ${data.totalClaims}`);
      console.log(`🔗 Blockchain Ready: ${data.blockchainReady ? 'Yes' : 'No'}`);
      console.log('='.repeat(60) + '\n');
    } else {
      console.error('❌ Claim extraction failed:', data.error);
      console.log('='.repeat(60) + '\n');
    }
  } catch (error) {
    console.error('❌ Request failed:', error.message);
    console.log('='.repeat(60) + '\n');
  }
}

/**
 * Demonstrate error handling
 */
async function demonstrateErrorHandling() {
  console.log('⚠️  ERROR HANDLING DEMO\n');
  console.log('='.repeat(60));
  
  // Test 1: Content too short
  console.log('Test 1: Content too short');
  try {
    const response = await fetch(`${BASE_URL}/api/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'Short' })
    });
    
    const data = await response.json();
    console.log(`Response: ${data.error}\n`);
  } catch (error) {
    console.error('Request failed:', error.message);
  }
  
  // Test 2: Missing content
  console.log('Test 2: Missing content field');
  try {
    const response = await fetch(`${BASE_URL}/api/ai/summarize`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    
    const data = await response.json();
    console.log(`Response: ${data.error}\n`);
  } catch (error) {
    console.error('Request failed:', error.message);
  }
  
  // Test 3: Invalid endpoint
  console.log('Test 3: Invalid endpoint (404)');
  try {
    const response = await fetch(`${BASE_URL}/api/ai/invalid`);
    const data = await response.json();
    console.log(`Response: ${data.error}\n`);
  } catch (error) {
    console.error('Request failed:', error.message);
  }
  
  console.log('='.repeat(60) + '\n');
}

/**
 * Main function - run all demonstrations
 */
async function main() {
  console.log('\n');
  console.log('🤖 AXIOM AI Agent - Client Demo');
  console.log('='.repeat(60));
  console.log('\n');
  
  // Check if service is running
  const isHealthy = await checkHealth();
  
  if (!isHealthy) {
    console.log('Please start the AXIOM server first:');
    console.log('  1. Make sure your .env file is configured');
    console.log('  2. Run: npm start');
    console.log('  3. Then run this demo again\n');
    return;
  }
  
  // Run demonstrations
  await demonstrateSummarization();
  await demonstrateClaimExtraction();
  await demonstrateErrorHandling();
  
  console.log('✨ Demo complete!\n');
  console.log('Next steps:');
  console.log('  - Try with your own content');
  console.log('  - Build a web interface');
  console.log('  - Integrate with your application');
  console.log('  - Add blockchain verification (future feature)\n');
}

// Run the demo
main().catch(error => {
  console.error('Demo failed:', error);
  process.exit(1);
});
