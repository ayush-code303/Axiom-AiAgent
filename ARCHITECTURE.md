# AXIOM AI Agent - Architecture Overview

This document explains the architecture and design decisions behind AXIOM.

## Architecture Philosophy

AXIOM is designed with three core principles:
1. **Modularity**: Each component has a single, well-defined responsibility
2. **Scalability**: Easy to extend with new features and integrate with external systems
3. **Blockchain-Ready**: Architecture prepared for future blockchain verification integration

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Web Apps, Mobile Apps, CLI Tools, Other Services)        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP/REST
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Express Server                           │
│                   (backend/server.js)                        │
├─────────────────────────────────────────────────────────────┤
│  Middleware Layer:                                          │
│  ├── Request Logger (requestLogger.js)                     │
│  ├── JSON Parser                                           │
│  └── Error Handler (errorHandler.js)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                     Routes Layer                             │
│                  (backend/routes/)                           │
│                                                              │
│  API Endpoints:                                             │
│  ├── POST /api/ai/summarize                                │
│  ├── POST /api/ai/extract-claims                           │
│  └── GET  /api/ai/health                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                  Controllers Layer                           │
│                (backend/controllers/)                        │
│                                                              │
│  Request Handlers:                                          │
│  ├── Input Validation                                       │
│  ├── Business Logic Orchestration                          │
│  └── Response Formatting                                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                   AI Agent Module                            │
│                (backend/ai-agent/)                           │
│                                                              │
│  Core AI Functions:                                         │
│  ├── Content Summarization                                 │
│  ├── Claim Extraction                                      │
│  ├── Content Validation                                    │
│  └── Response Parsing                                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │
┌────────────────────────▼────────────────────────────────────┐
│                Google Gemini API                             │
│              (External AI Service)                           │
└─────────────────────────────────────────────────────────────┘
```

## Component Breakdown

### 1. Server Layer (`backend/server.js`)

**Responsibilities:**
- Initialize Express application
- Configure middleware
- Register routes
- Handle server lifecycle (start/shutdown)

**Key Features:**
- Centralized configuration
- Graceful shutdown handling
- Informative startup logs
- Error boundary

### 2. Configuration (`backend/config/config.js`)

**Responsibilities:**
- Load environment variables
- Validate required configuration
- Provide configuration to other modules

**Security:**
- Never exposes sensitive data in logs
- Validates API key presence at startup
- Environment-specific settings

### 3. Routes Layer (`backend/routes/`)

**Responsibilities:**
- Define API endpoints
- Map URLs to controllers
- Document endpoint contracts

**Design Pattern:**
- RESTful API design
- Clear URL structure
- HTTP method conventions

### 4. Controllers Layer (`backend/controllers/`)

**Responsibilities:**
- Handle HTTP request/response
- Validate user input
- Call business logic (AI agent)
- Format responses

**Separation of Concerns:**
- No AI logic in controllers
- No HTTP logic in AI agent
- Clean interface between layers

### 5. AI Agent Module (`backend/ai-agent/geminiAgent.js`)

**Responsibilities:**
- Interface with Google Gemini API
- Process AI responses
- Provide AI capabilities as pure functions

**Design Principles:**
- **Stateless**: Functions are pure and don't maintain state
- **Testable**: Easy to unit test
- **Reusable**: Can be imported and used anywhere
- **Independent**: No dependencies on Express or HTTP

**Key Functions:**

```javascript
summarizeContent(content)
├── Input: String content
├── Process: Send to Gemini API
├── Parse: Extract summary from response
└── Output: Structured result object

extractFactualClaims(content)
├── Input: String content
├── Process: Send to Gemini API with claim extraction prompt
├── Parse: Extract and structure claims
└── Output: Array of claims with metadata

validateContent(content)
├── Input: String content
├── Check: Type, length, format
└── Output: Validation result
```

### 6. Middleware Layer (`backend/middleware/`)

**Request Logger:**
- Logs all incoming requests
- Provides debugging information
- Helps with monitoring

**Error Handler:**
- Catches all errors
- Provides consistent error responses
- Environment-aware (shows stack in dev)
- Handles 404s gracefully

## Data Flow

### Summarization Request Flow

```
1. Client sends POST /api/ai/summarize
   ↓
2. Request Logger logs the request
   ↓
3. Express parses JSON body
   ↓
4. Routes layer forwards to aiController.summarize
   ↓
5. Controller validates input using aiAgent.validateContent
   ↓
6. If valid, controller calls aiAgent.summarizeContent
   ↓
7. AI Agent sends request to Gemini API
   ↓
8. Gemini API processes and returns summary
   ↓
9. AI Agent parses and structures response
   ↓
10. Controller formats final response
    ↓
11. Express sends JSON response to client
    ↓
12. Error Handler catches any errors along the way
```

## Future Blockchain Integration

The architecture is designed for easy blockchain integration:

### Current Blockchain-Ready Features

1. **Verification Hash Placeholders**
   ```javascript
   {
     verificationHash: null  // Ready for blockchain hash
   }
   ```

2. **Blockchain Ready Flag**
   ```javascript
   {
     blockchainReady: true  // Indicates data structure is ready
   }
   ```

3. **Timestamping**
   ```javascript
   {
     timestamp: "2024-01-08T20:00:00.000Z"  // For audit trails
   }
   ```

4. **Independent AI Agent**
   - Can be called from smart contracts
   - Pure functions, easy to integrate
   - Structured output ready for on-chain storage

### Future Blockchain Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AXIOM AI Agent                           │
│                  (Current Implementation)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ├─────────────────────┐
                         │                     │
                         ▼                     ▼
┌────────────────────────────────┐  ┌────────────────────────┐
│    Blockchain Verification      │  │   Traditional Storage  │
│         Module (Future)          │  │     (Database)        │
├────────────────────────────────┤  └────────────────────────┘
│ - Hash Generation               │
│ - Smart Contract Interaction    │
│ - IPFS Storage                  │
│ - Verification Proofs           │
│ - Claim Attestation             │
└────────────────────────────────┘
```

### Planned Blockchain Features

1. **Content Hashing**
   - SHA-256 hash of original content
   - SHA-256 hash of summaries/claims
   - Merkle tree for multiple claims

2. **Smart Contract Integration**
   - Store verification hashes on-chain
   - Timestamp anchoring
   - Claim attestation system
   - Reputation system for verified claims

3. **Decentralized Storage**
   - IPFS for content storage
   - On-chain hash references
   - Permanent, verifiable records

4. **Verification API**
   ```javascript
   // Future endpoint
   POST /api/blockchain/verify
   {
     "contentHash": "abc123...",
     "claimHash": "def456..."
   }
   
   Response:
   {
     "verified": true,
     "blockNumber": 12345,
     "timestamp": "2024-01-08T20:00:00.000Z",
     "transactionHash": "0x..."
   }
   ```

## Scalability Considerations

### Current Architecture Supports

1. **Horizontal Scaling**
   - Stateless design
   - Can run multiple instances behind load balancer
   - No session management

2. **Async Processing**
   - AI operations are async
   - Non-blocking I/O
   - Can handle multiple concurrent requests

3. **Module Independence**
   - AI agent can be extracted to microservice
   - Easy to add caching layer
   - Simple to add message queue

### Future Enhancements

1. **Caching Layer**
   ```
   Client → API → Redis Cache → AI Agent → Gemini
   ```

2. **Queue System**
   ```
   Client → API → Message Queue → Worker Pool → AI Agent
   ```

3. **Microservices**
   ```
   API Gateway
   ├── Auth Service
   ├── AI Service (Current AI Agent)
   ├── Blockchain Service
   └── Storage Service
   ```

## Security Considerations

### Current Implementation

1. **API Key Protection**
   - Stored in environment variables
   - Never logged or exposed
   - Validated at startup

2. **Input Validation**
   - Type checking
   - Length limits
   - Content sanitization

3. **Error Handling**
   - No sensitive data in error messages
   - Stack traces only in development
   - Consistent error format

### Best Practices

1. **Environment Variables**
   - Never commit .env files
   - Use .env.example as template
   - Rotate API keys regularly

2. **Rate Limiting** (Not implemented, recommended for production)
   ```javascript
   // Future enhancement
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

3. **CORS** (Not implemented, add if needed)
   ```javascript
   // If serving from different domain
   const cors = require('cors');
   app.use(cors({
     origin: 'https://yourdomain.com'
   }));
   ```

## Code Style and Conventions

### File Organization
- One module per file
- Clear file naming (descriptive, lowercase)
- Group related files in folders

### Code Style
- Comprehensive comments
- Descriptive variable names
- Consistent formatting
- JSDoc for functions

### Error Handling Pattern
```javascript
try {
  // Operation
  const result = await operation();
  return { success: true, data: result };
} catch (error) {
  console.error('Context:', error.message);
  throw new Error('User-friendly message');
}
```

### Response Format
```javascript
// Success
{
  success: true,
  ...data
}

// Error
{
  success: false,
  error: "message"
}
```

## Testing Strategy (For Future Implementation)

### Unit Tests
- Test AI agent functions
- Test validation logic
- Test response parsing

### Integration Tests
- Test API endpoints
- Test error handling
- Test middleware

### Example Test Structure
```javascript
// tests/aiAgent.test.js
describe('AI Agent', () => {
  describe('validateContent', () => {
    it('should reject content that is too short', () => {
      const result = validateContent('short');
      expect(result.valid).toBe(false);
    });
    
    it('should accept valid content', () => {
      const result = validateContent('This is valid content that is long enough');
      expect(result.valid).toBe(true);
    });
  });
});
```

## Performance Considerations

### Current Performance
- Fast startup time
- Minimal memory footprint
- Async operations don't block

### Optimization Opportunities
1. Response caching for identical requests
2. Connection pooling for API calls
3. Compression for large responses
4. CDN for static assets (if added)

## Monitoring and Logging

### Current Logging
- Request logging (all requests)
- Error logging (all errors)
- Server status logging

### Production Logging (Recommended)
```javascript
// Use production logging library
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Conclusion

AXIOM's architecture is:
- ✅ **Clean**: Clear separation of concerns
- ✅ **Modular**: Easy to understand and modify
- ✅ **Scalable**: Ready for growth
- ✅ **Secure**: Following security best practices
- ✅ **Blockchain-Ready**: Prepared for future integration
- ✅ **Beginner-Friendly**: Well-documented and readable

This architecture provides a solid foundation for a hackathon project while being extensible enough for production use with additional hardening and features.
