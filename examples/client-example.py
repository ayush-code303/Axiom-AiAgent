"""
AXIOM AI Agent - Python Client Example

This example demonstrates how to interact with the AXIOM API using Python.
Requires: requests library (pip install requests)

Run with: python examples/client-example.py
"""

import requests
import json
from typing import Dict, Any, Optional

# Configuration
BASE_URL = 'http://localhost:3000'


class AxiomClient:
    """Simple client for interacting with AXIOM AI Agent API"""
    
    def __init__(self, base_url: str = BASE_URL):
        self.base_url = base_url.rstrip('/')
        
    def check_health(self) -> Dict[str, Any]:
        """Check if the AXIOM service is running"""
        try:
            response = requests.get(f'{self.base_url}/api/ai/health')
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': str(e)}
    
    def summarize(self, content: str) -> Dict[str, Any]:
        """
        Summarize text content
        
        Args:
            content: The text to summarize
            
        Returns:
            Dictionary containing the summary and metadata
        """
        try:
            response = requests.post(
                f'{self.base_url}/api/ai/summarize',
                json={'content': content},
                headers={'Content-Type': 'application/json'}
            )
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': str(e)}
    
    def extract_claims(self, content: str) -> Dict[str, Any]:
        """
        Extract factual claims from text
        
        Args:
            content: The text to analyze
            
        Returns:
            Dictionary containing extracted claims and metadata
        """
        try:
            response = requests.post(
                f'{self.base_url}/api/ai/extract-claims',
                json={'content': content},
                headers={'Content-Type': 'application/json'}
            )
            return response.json()
        except requests.exceptions.RequestException as e:
            return {'success': False, 'error': str(e)}


def print_separator(char='=', length=60):
    """Print a separator line"""
    print(char * length)


def demonstrate_health_check():
    """Demonstrate health check"""
    print('\n🔍 Checking service health...\n')
    
    client = AxiomClient()
    result = client.check_health()
    
    if result.get('success'):
        print('✅ Service is running!')
        print(f"   Version: {result.get('version')}")
        print(f"   Message: {result.get('message')}\n")
        return True
    else:
        print('❌ Service is not running!')
        print('   Please start the server with: npm start\n')
        return False


def demonstrate_summarization():
    """Demonstrate content summarization"""
    print('\n📝 SUMMARIZATION DEMO\n')
    print_separator()
    
    # Using triple quotes without indentation to avoid leading whitespace
    long_article = """Artificial Intelligence (AI) has become one of the most transformative technologies of the 21st century. From virtual assistants like Siri and Alexa to advanced machine learning systems that can diagnose diseases, AI is revolutionizing how we live and work.

Modern AI systems use neural networks, inspired by the human brain, to learn patterns from vast amounts of data. These systems can now perform tasks that once required human intelligence, such as recognizing images, understanding natural language, and making complex decisions.

However, the rise of AI also raises important ethical questions. Issues like algorithmic bias, job displacement, and privacy concerns need to be addressed as AI becomes more integrated into society. Ensuring that AI is developed and deployed responsibly is crucial for its long-term success."""
    
    print('Original Article:')
    print(long_article.strip())
    print('\n' + '-' * 60 + '\n')
    
    client = AxiomClient()
    result = client.summarize(long_article)
    
    if result.get('success'):
        print('Summary Generated:')
        print(result['summary'])
        print('\n' + '-' * 60)
        
        original_len = result['originalLength']
        summary_len = result['summaryLength']
        reduction = (1 - summary_len / original_len) * 100
        
        print(f"📊 Compression: {original_len} → {summary_len} characters")
        print(f"   Reduction: {reduction:.1f}%")
    else:
        print(f"❌ Summarization failed: {result.get('error')}")
    
    print_separator()
    print()


def demonstrate_claim_extraction():
    """Demonstrate factual claim extraction"""
    print('\n🔬 CLAIM EXTRACTION DEMO\n')
    print_separator()
    
    # Using triple quotes without indentation to avoid leading whitespace
    scientific_text = """The speed of light in a vacuum is approximately 299,792,458 meters per second, often denoted as 'c'. This is a fundamental constant in physics.

Albert Einstein's theory of special relativity, published in 1905, revolutionized our understanding of space and time. The theory states that the laws of physics are the same for all non-accelerating observers.

The equation E=mc² shows the equivalence of energy (E) and mass (m), with c² representing the speed of light squared. This famous equation demonstrates that a small amount of mass can be converted into a large amount of energy.

The theory of general relativity, published in 1915, extends special relativity to include gravity. It describes gravity not as a force, but as a curvature of spacetime caused by mass and energy."""
    
    print('Text to Analyze:')
    print(scientific_text.strip())
    print('\n' + '-' * 60 + '\n')
    
    client = AxiomClient()
    result = client.extract_claims(scientific_text)
    
    if result.get('success'):
        print(f"Extracted {result['totalClaims']} factual claims:\n")
        
        for i, claim in enumerate(result['claims'], 1):
            print(f"{i}. {claim['claim']}")
        
        print('\n' + '-' * 60)
        print(f"📋 Total Claims: {result['totalClaims']}")
        print(f"🔗 Blockchain Ready: {'Yes' if result.get('blockchainReady') else 'No'}")
    else:
        print(f"❌ Claim extraction failed: {result.get('error')}")
    
    print_separator()
    print()


def demonstrate_error_handling():
    """Demonstrate error handling"""
    print('\n⚠️  ERROR HANDLING DEMO\n')
    print_separator()
    
    client = AxiomClient()
    
    # Test 1: Content too short
    print('Test 1: Content too short')
    result = client.summarize('Short')
    print(f"Response: {result.get('error')}\n")
    
    # Test 2: Missing content
    print('Test 2: Empty content')
    result = client.summarize('')
    print(f"Response: {result.get('error')}\n")
    
    # Test 3: Invalid request
    print('Test 3: Very long content simulation')
    result = client.summarize('Valid content that is long enough to pass validation.')
    if result.get('success'):
        print('✅ Request would succeed with valid API key')
    else:
        print(f"Response: {result.get('error')}")
    
    print()
    print_separator()
    print()


def main():
    """Main function - run all demonstrations"""
    print('\n')
    print('🤖 AXIOM AI Agent - Python Client Demo')
    print_separator()
    print()
    
    # Check if service is running
    if not demonstrate_health_check():
        print('Please start the AXIOM server first:')
        print('  1. Make sure your .env file is configured')
        print('  2. Run: npm start')
        print('  3. Then run this demo again\n')
        return
    
    # Run demonstrations
    demonstrate_summarization()
    demonstrate_claim_extraction()
    demonstrate_error_handling()
    
    print('✨ Demo complete!\n')
    print('Next steps:')
    print('  - Try with your own content')
    print('  - Build a web interface')
    print('  - Integrate with your application')
    print('  - Add blockchain verification (future feature)\n')


if __name__ == '__main__':
    try:
        main()
    except KeyboardInterrupt:
        print('\n\nDemo interrupted by user')
    except Exception as e:
        print(f'\n❌ Demo failed: {e}')
        import traceback
        traceback.print_exc()
