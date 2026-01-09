// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * AXIOM Smart Contract
 * Stores and verifies cryptographic proof hashes with timestamps
 * 
 * Purpose: Enable immutable, verifiable storage of content hashes
 * for future blockchain-based verification integration
 */

contract AxiomProofStore {
    
    // Mapping to store proof hashes with their timestamps
    mapping(bytes32 => uint256) public proofTimestamps;
    
    // Track all stored proof hashes for enumeration
    bytes32[] public proofHashes;
    
    // Owner of the contract
    address public owner;
    
    /**
     * Event emitted when a new proof is stored
     * @param proofHash The SHA-256 hash of the content
     * @param timestamp Unix timestamp when proof was stored
     * @param storer Address of the account that stored the proof
     */
    event ProofStored(bytes32 indexed proofHash, uint256 timestamp, address indexed storer);
    
    /**
     * Event emitted when a proof is retrieved
     * @param proofHash The SHA-256 hash that was queried
     * @param timestamp The stored timestamp for that hash
     * @param exists Whether the proof exists in the store
     */
    event ProofRetrieved(bytes32 indexed proofHash, uint256 timestamp, bool exists);
    
    /**
     * Constructor - Sets the contract owner
     */
    constructor() {
        owner = msg.sender;
    }
    
    /**
     * Store a proof hash with current block timestamp
     * 
     * @param proofHash The cryptographic hash (typically SHA-256) to store
     * 
     * Emits ProofStored event on success
     * Prevents storing duplicate hashes (overwrites old timestamp)
     */
    function storeProof(bytes32 proofHash) public {
        require(proofHash != bytes32(0), "Proof hash cannot be empty");
        
        // Only add to array if this is a new hash
        if (proofTimestamps[proofHash] == 0) {
            proofHashes.push(proofHash);
        }
        
        // Store the block timestamp
        uint256 blockTimestamp = block.timestamp;
        proofTimestamps[proofHash] = blockTimestamp;
        
        emit ProofStored(proofHash, blockTimestamp, msg.sender);
    }
    
    /**
     * Retrieve the timestamp for a stored proof hash
     * 
     * @param proofHash The cryptographic hash to look up
     * @return timestamp The Unix timestamp when the proof was stored (0 if not found)
     * 
     * Emits ProofRetrieved event with result
     */
    function getProofTimestamp(bytes32 proofHash) public returns (uint256) {
        uint256 timestamp = proofTimestamps[proofHash];
        bool exists = timestamp != 0;
        
        emit ProofRetrieved(proofHash, timestamp, exists);
        
        return timestamp;
    }
    
    /**
     * Check if a proof exists in the store
     * 
     * @param proofHash The cryptographic hash to check
     * @return exists True if the proof hash is stored, false otherwise
     */
    function proofExists(bytes32 proofHash) public view returns (bool) {
        return proofTimestamps[proofHash] != 0;
    }
    
    /**
     * Get the total number of stored proof hashes
     * 
     * @return count The total count of unique proofs stored
     */
    function getProofCount() public view returns (uint256) {
        return proofHashes.length;
    }
    
    /**
     * Get a proof hash by index
     * 
     * @param index The index in the proofs array
     * @return proofHash The hash at the given index
     */
    function getProofHashByIndex(uint256 index) public view returns (bytes32) {
        require(index < proofHashes.length, "Index out of bounds");
        return proofHashes[index];
    }
}
