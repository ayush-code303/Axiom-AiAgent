/**
 * AXIOM Smart Contract Test Suite
 * Tests for AxiomProofStore contract
 */

const { expect } = require("chai");

describe("AxiomProofStore", function () {
  let axiomProofStore;
  let owner;
  let addr1;
  
  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    
    const AxiomProofStore = await ethers.getContractFactory("AxiomProofStore");
    axiomProofStore = await AxiomProofStore.deploy();
    await axiomProofStore.deployed();
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await axiomProofStore.owner()).to.equal(owner.address);
    });
    
    it("Should start with zero proofs", async function () {
      expect(await axiomProofStore.getProofCount()).to.equal(0);
    });
  });
  
  describe("Storing Proofs", function () {
    it("Should store a proof hash", async function () {
      const testHash = ethers.utils.id("test content");
      
      await expect(axiomProofStore.storeProof(testHash))
        .to.emit(axiomProofStore, "ProofStored")
        .withArgs(testHash, await getBlockTimestamp(), owner.address);
      
      expect(await axiomProofStore.proofExists(testHash)).to.be.true;
    });
    
    it("Should reject empty hash", async function () {
      const emptyHash = ethers.constants.HashZero;
      
      await expect(axiomProofStore.storeProof(emptyHash))
        .to.be.revertedWith("Proof hash cannot be empty");
    });
    
    it("Should increment proof count", async function () {
      const hash1 = ethers.utils.id("content 1");
      const hash2 = ethers.utils.id("content 2");
      
      await axiomProofStore.storeProof(hash1);
      expect(await axiomProofStore.getProofCount()).to.equal(1);
      
      await axiomProofStore.storeProof(hash2);
      expect(await axiomProofStore.getProofCount()).to.equal(2);
    });
  });
  
  describe("Retrieving Proofs", function () {
    it("Should retrieve stored proof timestamp", async function () {
      const testHash = ethers.utils.id("test content");
      await axiomProofStore.storeProof(testHash);
      
      const timestamp = await axiomProofStore.getProofTimestamp(testHash);
      expect(timestamp).to.be.greaterThan(0);
    });
    
    it("Should return 0 for non-existent proof", async function () {
      const nonExistentHash = ethers.utils.id("non existent");
      
      const timestamp = await axiomProofStore.getProofTimestamp(nonExistentHash);
      expect(timestamp).to.equal(0);
    });
  });
  
  describe("Proof Enumeration", function () {
    it("Should retrieve proof by index", async function () {
      const hash1 = ethers.utils.id("content 1");
      const hash2 = ethers.utils.id("content 2");
      
      await axiomProofStore.storeProof(hash1);
      await axiomProofStore.storeProof(hash2);
      
      expect(await axiomProofStore.getProofHashByIndex(0)).to.equal(hash1);
      expect(await axiomProofStore.getProofHashByIndex(1)).to.equal(hash2);
    });
    
    it("Should reject out of bounds index", async function () {
      await expect(axiomProofStore.getProofHashByIndex(0))
        .to.be.revertedWith("Index out of bounds");
    });
  });
  
  // Helper function
  async function getBlockTimestamp() {
    const block = await ethers.provider.getBlock("latest");
    return block.timestamp;
  }
});
