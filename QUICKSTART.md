# AXIOM AI Agent - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Get Your API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Setup
```bash
# Clone the repository
git clone https://github.com/ayush-code303/Axiom-AiAgent.git
cd Axiom-AiAgent

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and paste your API key
```

### Step 3: Run
```bash
npm start
```

Server starts at `http://localhost:3000`

### Step 4: Test
```bash
# Test health check
curl http://localhost:3000/api/ai/health

# Test summarization
curl -X POST http://localhost:3000/api/ai/summarize \
  -H "Content-Type: application/json" \
  -d '{"content": "Your long text here to summarize..."}'

# Test claim extraction
curl -X POST http://localhost:3000/api/ai/extract-claims \
  -H "Content-Type: application/json" \
  -d '{"content": "Your text with factual claims..."}'
```

## 📚 Documentation

- **[README.md](README.md)** - Full project documentation
- **[API_EXAMPLES.md](API_EXAMPLES.md)** - Detailed API examples in cURL, JavaScript, and Python
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - Architecture overview and design decisions

## 💻 Examples

Run the included example clients:

```bash
# Node.js example
node examples/client-example.js

# Python example (requires: pip install requests)
python examples/client-example.py
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message |
| GET | `/api/ai/health` | Health check |
| POST | `/api/ai/summarize` | Summarize content |
| POST | `/api/ai/extract-claims` | Extract factual claims |

## 📝 Example Request

```javascript
const response = await fetch('http://localhost:3000/api/ai/summarize', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    content: 'Your text content here...'
  })
});

const data = await response.json();
console.log(data.summary);
```

## 🛠️ Troubleshooting

**Server won't start?**
- Check that you've created `.env` file
- Verify your API key is set in `.env`
- Make sure port 3000 is not in use

**API returns errors?**
- Verify your Gemini API key is valid
- Check that content is between 10-50,000 characters
- Look at server logs for detailed error messages

## 🎯 Hackathon Tips

1. **Start Simple**: Test with the health endpoint first
2. **Use Examples**: Run the example clients to see it in action
3. **Build On It**: The modular architecture makes it easy to add features
4. **Go Blockchain**: The architecture is ready for blockchain integration

## 🔮 Future Features

- Blockchain-based verification
- Hash generation for content integrity
- Smart contract integration
- Decentralized storage (IPFS)
- Verification badges

## 📧 Need Help?

Check the full [README.md](README.md) or open an issue on GitHub.

---

**Happy Hacking! 🚀**
