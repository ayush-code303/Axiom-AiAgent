# AXIOM AI Agent 🤖

AXIOM is a conversational AI agent built with Node.js and Express that uses Google Gemini API to summarize and extract key factual claims from user-provided content. The architecture is designed to support future blockchain-based verification integration.

## 🌟 Features

- **Content Summarization**: Generate concise, accurate summaries of any text content
- **Factual Claims Extraction**: Identify and extract key factual statements from content
- **RESTful API**: Clean, well-documented API endpoints
- **Beginner-Friendly**: Well-commented, readable code structure
- **Blockchain-Ready**: Architecture designed for future blockchain verification integration
- **Error Handling**: Comprehensive error handling and validation

## 🏗️ Project Structure

```
Axiom-AiAgent/
├── backend/
│   ├── ai-agent/
│   │   └── geminiAgent.js      # Google Gemini API integration
│   ├── config/
│   │   └── config.js           # Environment configuration
│   ├── controllers/
│   │   └── aiController.js     # Request handlers
│   ├── middleware/
│   │   ├── errorHandler.js     # Error handling
│   │   └── requestLogger.js    # Request logging
│   ├── routes/
│   │   └── aiRoutes.js         # API routes definition
│   └── server.js               # Main server file
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Project dependencies
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayush-code303/Axiom-AiAgent.git
   cd Axiom-AiAgent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Google Gemini API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

## 📡 API Endpoints

### 1. Welcome Message
```
GET /
```
Returns welcome message and available endpoints.

### 2. Health Check
```
GET /api/ai/health
```
Check if the service is running.

**Response:**
```json
{
  "success": true,
  "message": "AXIOM AI Agent is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### 3. Summarize Content
```
POST /api/ai/summarize
```
Generate a concise summary of provided content.

**Request Body:**
```json
{
  "content": "Your long text content here that you want to summarize..."
}
```

**Response:**
```json
{
  "success": true,
  "summary": "Concise summary of the content...",
  "originalLength": 1000,
  "summaryLength": 150,
  "timestamp": "2024-01-01T00:00:00.000Z",
  "verificationHash": null
}
```

### 4. Extract Factual Claims
```
POST /api/ai/extract-claims
```
Extract key factual claims from provided content.

**Request Body:**
```json
{
  "content": "Your text content containing factual claims..."
}
```

**Response:**
```json
{
  "success": true,
  "claims": [
    {
      "claim": "First factual claim extracted",
      "extracted": true
    },
    {
      "claim": "Second factual claim extracted",
      "extracted": true
    }
  ],
  "totalClaims": 2,
  "rawResponse": "Full AI response...",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "verificationHash": null,
  "blockchainReady": true
}
```

## 💻 Usage Examples

### Using cURL

**Summarize Content:**
```bash
curl -X POST http://localhost:3000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals."
  }'
```

**Extract Claims:**
```bash
curl -X POST http://localhost:3000/api/ai/extract-claims \
  -H "Content-Type: application/json" \
  -d '{
    "content": "The Earth orbits the Sun once every 365.25 days. Water boils at 100 degrees Celsius at sea level. The speed of light in vacuum is approximately 299,792,458 meters per second."
  }'
```

### Using JavaScript (Fetch API)

```javascript
// Summarize content
const summarizeContent = async (text) => {
  const response = await fetch('http://localhost:3000/api/ai/summarize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: text })
  });
  
  const data = await response.json();
  console.log(data.summary);
};

// Extract claims
const extractClaims = async (text) => {
  const response = await fetch('http://localhost:3000/api/ai/extract-claims', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content: text })
  });
  
  const data = await response.json();
  console.log(data.claims);
};
```

## 🔐 Security Notes

- Never commit your `.env` file or expose your API keys
- The `.env.example` file is provided as a template
- API keys should be kept secure and rotated regularly
- Input validation is implemented to prevent malicious requests

## 🔮 Future Blockchain Integration

The AXIOM architecture is designed with blockchain integration in mind:

- **Verification Hashes**: Response objects include `verificationHash` fields (currently null)
- **Blockchain-Ready Flag**: Claims responses include `blockchainReady: true`
- **Modular Design**: The AI agent module is independent and can easily interface with blockchain smart contracts
- **Timestamping**: All responses include ISO timestamps for audit trails

Future enhancements will include:
- Hash generation for content integrity verification
- Smart contract integration for claim verification
- Decentralized storage of summaries and claims
- Verification badges for authenticated content

## 🛠️ Development

### Project Philosophy
This project is built with beginners in mind:
- **Clear Code Structure**: Organized into logical folders
- **Extensive Comments**: Every function and module is documented
- **Readable Code**: Descriptive variable names and clean formatting
- **Error Messages**: Helpful error messages for debugging

### Adding New Features
The modular architecture makes it easy to extend:

1. **New AI Capabilities**: Add functions to `backend/ai-agent/geminiAgent.js`
2. **New Endpoints**: Add routes to `backend/routes/aiRoutes.js`
3. **New Controllers**: Add handlers to `backend/controllers/aiController.js`

## 📝 License

MIT License - feel free to use this project for your hackathon or learning purposes!

## 🤝 Contributing

This is a hackathon project, but contributions and improvements are welcome!

## 🐛 Troubleshooting

**Issue: "GEMINI_API_KEY is not set"**
- Make sure you've created a `.env` file based on `.env.example`
- Verify your API key is correct and active

**Issue: "Failed to summarize content"**
- Check your internet connection
- Verify your Gemini API key is valid
- Ensure the content length is within limits (10-50,000 characters)

**Issue: Server won't start**
- Check if port 3000 is already in use
- Try changing the PORT in your `.env` file

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ for hackathons and learning**
