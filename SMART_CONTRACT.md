# AXIOM Smart Contract

## Overview
The **AxiomProofStore** contract is a simple, immutable proof-of-existence storage system built with Solidity ^0.8.0. It enables AXIOM to anchor cryptographic hashes of AI-generated summaries and claims on the blockchain for future verification.

## Contract Details

### State Variables
- `mapping(bytes32 => uint256) proofTimestamps` - Maps proof hashes to storage timestamps
- `bytes32[] proofHashes` - Tracks all stored proof hashes for enumeration
- `address owner` - Contract owner (set on deployment)

### Main Functions

#### `storeProof(bytes32 proofHash)`
Stores a cryptographic proof hash with the current block timestamp.

**Parameters:**
- `proofHash` - SHA-256 hash of the content (e.g., from AXIOM backend `/api/verify`)

**Events:**
- `ProofStored(bytes32 indexed proofHash, uint256 timestamp, address indexed storer)`

**Example:**
```solidity
bytes32 contentHash = 0xabc123...;
axiomProofStore.storeProof(contentHash);
```

#### `getProofTimestamp(bytes32 proofHash)`
Retrieves the timestamp when a proof hash was stored.

**Parameters:**
- `proofHash` - The hash to look up

**Returns:**
- `uint256` - Unix timestamp (0 if not found)

**Events:**
- `ProofRetrieved(bytes32 indexed proofHash, uint256 timestamp, bool exists)`

#### `proofExists(bytes32 proofHash)`
Checks if a proof hash exists in storage (view function, no gas cost).

**Parameters:**
- `proofHash` - The hash to check

**Returns:**
- `bool` - True if stored, false otherwise

#### `getProofCount()`
Returns the total number of stored proofs.

**Returns:**
- `uint256` - Total count of unique hashes

#### `getProofHashByIndex(uint256 index)`
Retrieves a proof hash by its index in the array.

**Parameters:**
- `index` - Array index (0-based)

**Returns:**
- `bytes32` - The hash at that index

## Integration with AXIOM Backend

1. **AI generates summary** → Hashed via `/api/ai/summarize` → Returns `verificationHash`
2. **Verify hash** → POST to `/api/verify` with `content`, `timestamp`, `hash`
3. **Store on blockchain** → Call `storeProof(hash)` with returned hash
4. **Proof of existence** → Query contract to verify timestamp

## Deployment

### Using Hardhat
```bash
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network <network-name>
```

### Using Remix IDE
1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new file: `AxiomProofStore.sol`
3. Copy contract code
4. Compile with ^0.8.0
5. Deploy to testnet

## License
MIT

## Future Enhancements
- Access control (owner-only functions)
- Proof metadata storage (content type, source)
- Proof verification workflow integration
- Gas optimization for batch operations
