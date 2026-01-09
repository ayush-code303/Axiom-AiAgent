# Blockchain Integration for AXIOM

## Overview
AXIOM now integrates with the Ethereum blockchain (Sepolia testnet) via ethers.js to anchor proof hashes on the **AxiomProofStore** smart contract. This enables immutable, verifiable proof-of-existence for AI-generated summaries and claims.

## Environment Setup

Create a `.env` file in the project root with:

```env
# Existing variables
PORT=3000
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key

# Blockchain configuration (Sepolia testnet)
BLOCKCHAIN_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
BLOCKCHAIN_PRIVATE_KEY=your_wallet_private_key
BLOCKCHAIN_CONTRACT_ADDRESS=0x... # Address of deployed AxiomProofStore
BLOCKCHAIN_CONTRACT_ABI=[...]      # JSON array of contract ABI
```

### Getting Sepolia RPC URL
- **Infura**: https://infura.io → Create project → Copy Sepolia endpoint
- **Alchemy**: https://www.alchemy.com → Create app → Copy Sepolia endpoint

### Contract ABI
Export from the AxiomProofStore contract (can be stringified or full JSON):

```bash
cat contracts/AxiomProofStore.sol # Copy function signatures
# Or use: npx hardhat flatten contracts/AxiomProofStore.sol
```

## Blockchain Service API

### `anchorProof(proofHash)`
Stores a proof hash on the blockchain.

**Parameters:**
- `proofHash` - SHA-256 hash (64 hex chars with or without `0x` prefix)

**Returns:**
```javascript
{
  success: true,
  transactionHash: "0x...",
  blockNumber: 12345,
  gasUsed: "50000",
  status: "confirmed",
  contractAddress: "0x...",
  proofHash: "0xabc123...",
  timestamp: "2024-01-10T00:00:00.000Z"
}
```

**Example:**
```javascript
import { anchorProof } from './services/blockchainService.js';

const result = await anchorProof('abc123....');
console.log(result.transactionHash);
```

### `getProofInfo(proofHash)`
Retrieves proof timestamp and existence status from blockchain.

**Returns:**
```javascript
{
  success: true,
  proofHash: "0xabc123...",
  timestamp: 1234567890,
  exists: true,
  timestamp_iso: "2024-01-10T00:00:00.000Z"
}
```

### `proofExists(proofHash)`
Checks if a proof exists (returns boolean).

## HTTP Endpoints

### POST `/api/blockchain/anchor`
Anchor a proof hash to the blockchain.

**Request:**
```json
{
  "proofHash": "abc123... or 0xabc123..."
}
```

**Response:**
```json
{
  "success": true,
  "transactionHash": "0x...",
  "blockNumber": 12345,
  "gasUsed": "50000",
  "status": "confirmed",
  "contractAddress": "0x...",
  "proofHash": "0xabc123...",
  "timestamp": "2024-01-10T00:00:00.000Z"
}
```

### GET `/api/blockchain/info?hash=abc123...`
Retrieve proof info from blockchain.

**Response:**
```json
{
  "success": true,
  "proofHash": "0xabc123...",
  "timestamp": 1234567890,
  "exists": true,
  "timestamp_iso": "2024-01-10T00:00:00.000Z"
}
```

### GET `/api/blockchain/check?hash=abc123...`
Check if proof exists.

**Response:**
```json
{
  "success": true,
  "proofHash": "abc123...",
  "exists": true,
  "message": "Proof found on blockchain"
}
```

## Complete Workflow

1. **Generate Summary**
   ```bash
   POST /api/ai/summarize
   {"content": "..."}
   ```
   Returns: `{ bullets, verificationHash, ... }`

2. **Verify Hash (Optional)**
   ```bash
   POST /api/verify
   {"content": "...", "timestamp": "...", "hash": "..."}
   ```
   Returns: `{ verified: true/false, ... }`

3. **Anchor to Blockchain**
   ```bash
   POST /api/blockchain/anchor
   {"proofHash": "verificationHash from step 1"}
   ```
   Returns: `{ transactionHash, blockNumber, ... }`

4. **Check Proof on Blockchain**
   ```bash
   GET /api/blockchain/check?hash=verificationHash
   ```
   Returns: `{ exists: true, message: "Proof found on blockchain" }`

## Deployment on Sepolia

### Prerequisites
- Sepolia testnet funds (get free from [faucet.sepolia.dev](https://faucet.sepolia.dev))
- Wallet private key (from MetaMask or similar)
- Deployed AxiomProofStore contract address

### Setup
1. Fund your wallet with Sepolia ETH
2. Deploy AxiomProofStore contract to Sepolia (via Remix or Hardhat)
3. Copy contract address and ABI to `.env`
4. Run: `npm install` (to install ethers.js)
5. Start backend: `npm run start`

## Error Handling

If blockchain config is incomplete:
```
⚠️  Blockchain configuration incomplete; contract anchoring will be unavailable.
```

Call to `anchorProof` will return:
```json
{
  "success": false,
  "error": "Blockchain configuration incomplete...",
  "timestamp": "..."
}
```

## Security Notes

- **Private Key**: Store in `.env` file (never commit)
- **RPC URL**: Use environment variable (consider using private endpoints for production)
- **Contract ABI**: Can be public, but validate it matches your contract
- **Gas Limits**: Current implementation uses default gas estimation

---

For more details, see [SMART_CONTRACT.md](SMART_CONTRACT.md)
