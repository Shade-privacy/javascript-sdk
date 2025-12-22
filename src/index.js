import { KeyManager } from './KeyManager.js';
import { NoteEngine } from './NoteEngine.js';
import { StorageManager } from './StorageManager.js';
import { PoseidonClient } from './PoseidonClient.js';
import { MerkleClient } from './MerkleClient.js';
import { ProofInputs } from './ProofInputs.js';
import { ExecutionBundle } from './ExecutionBundle.js';

export class ShadeSDK {
  constructor(config) {
    if (!config.walletSignature) {
      throw new Error('walletSignature is required for encryption');
    }
    
    this.config = {
      poseidonUrl: config.poseidonUrl || 'http://localhost:3001',
      merkleUrl: config.merkleUrl || 'http://localhost:3002',
      proverUrl: config.proverUrl || 'http://localhost:3003',
      walletSignature: config.walletSignature,
      ...config
    };
    
    this.keyManager = new KeyManager();
    this.poseidonClient = new PoseidonClient(this.config.poseidonUrl);
    this.merkleClient = new MerkleClient(this.config.merkleUrl);
    this.noteEngine = new NoteEngine(this.poseidonClient);
    this.storageManager = new StorageManager(this.config.walletSignature);
    this.proofInputs = new ProofInputs(this.poseidonClient, this.merkleClient);
    this.executionBundle = new ExecutionBundle();
  }
  
  async initialize() {
    console.log('🔧 Initializing Shade SDK...');
    
    // Test Poseidon service
    const poseidonReady = await this.poseidonClient.testConnection();
    if (!poseidonReady) {
      throw new Error('Poseidon service not available');
    }
    
    // Initialize storage
    await this.storageManager.init();
    
    console.log('✅ Shade SDK initialized');
    return true;
  }
  
  /**
   * Create a new note with commitment
   * @param {bigint|string|number} assetId - The asset identifier
   * @param {bigint|string|number} amount - Exact amount (will be bucketed)
   * @returns {Promise<Object>} {note, commitment, bucketAmount}
   */
  async createNote(assetId, amount) {
    try {
      console.log(`📝 Creating note for asset ${assetId}, amount ${amount}`);
      
      // Generate secrets
      const secrets = this.keyManager.generateSecrets();
      console.log('🔐 Generated secrets');
      
      // Create note with commitment
      const noteResult = await this.noteEngine.createNote(
        secrets.secret,
        secrets.nullifier,
        assetId,
        amount
      );
      
      // Store note locally
      const storageId = await this.storageManager.storeNote({
        secrets: {
          secret: secrets.secret.toString(),
          nullifier: secrets.nullifier.toString(),
          noteId: secrets.noteId.toString()
        },
        metadata: {
          assetId: assetId.toString(),
          amount: amount.toString(),
          bucketAmount: noteResult.bucketAmount.toString(),
          timestamp: Date.now(),
          spent: false
        },
        commitment: noteResult.commitment.toString()
      });
      
      console.log(`💾 Note stored with ID: ${storageId}`);
      
      return {
        note: {
          secrets: secrets,
          metadata: {
            assetId: BigInt(assetId),
            amount: BigInt(amount),
            bucketAmount: noteResult.bucketAmount,
            timestamp: Date.now(),
            spent: false
          }
        },
        commitment: noteResult.commitment,
        bucketAmount: noteResult.bucketAmount,
        storageId
      };
    } catch (error) {
      console.error('❌ Error creating note:', error);
      throw error;
    }
  }
  
  /**
   * Prepare proof for spending a note
   * @param {string} commitment - Note commitment
   * @param {Object} options - Proof options
   * @returns {Promise<Object>} Proof inputs
   */
  async prepareProof(commitment, options = {}) {
    try {
      console.log(`🔍 Preparing proof for commitment: ${commitment}`);
      
      // Load note from storage
      const storedNote = await this.storageManager.getNote(commitment);
      if (!storedNote) {
        throw new Error(`Note not found for commitment: ${commitment}`);
      }
      
      if (storedNote.metadata.spent) {
        throw new Error('Note already spent');
      }
      
      // Get Merkle path from service
      const merklePath = await this.merkleClient.getMerklePath(commitment);
      console.log('🌳 Retrieved Merkle path');
      
      // Assemble proof inputs
      const inputs = await this.proofInputs.assemble(
        storedNote,
        merklePath,
        options.relayerFee || 0n,
        options.protocolFee || 0n
      );
      
      console.log('📊 Proof inputs assembled');
      return inputs;
    } catch (error) {
      console.error('❌ Error preparing proof:', error);
      throw error;
    }
  }
  
  /**
   * Generate proof using prover service
   * @param {Object} proofInputs - Assembled proof inputs
   * @returns {Promise<Object>} ZK proof
   */
  async generateProof(proofInputs) {
    try {
      console.log('⚡ Generating ZK proof...');
      
      // Send to prover service (you'll need to implement this)
      const response = await fetch(`${this.config.proverUrl}/generate-proof`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proofInputs)
      });
      
      if (!response.ok) {
        throw new Error(`Prover service error: ${response.statusText}`);
      }
      
      const proof = await response.json();
      console.log('✅ Proof generated');
      
      return proof;
    } catch (error) {
      console.error('❌ Error generating proof:', error);
      throw error;
    }
  }
  
  /**
   * Build execution bundle
   * @param {Object} proof - ZK proof
   * @param {Object} publicInputs - Public inputs
   * @param {Object} callData - Contract call data
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} Execution bundle
   */
  async buildExecutionBundle(proof, publicInputs, callData, options = {}) {
    try {
      console.log('📦 Building execution bundle...');
      
      const bundle = this.executionBundle.build({
        proof,
        publicInputs,
        callData,
        constraints: {
          maxFee: options.maxFee || 0n,
          expiry: options.expiry || Math.floor(Date.now() / 1000) + 3600,
          recipient: options.recipient
        }
      });
      
      console.log('✅ Execution bundle ready');
      return bundle;
    } catch (error) {
      console.error('❌ Error building execution bundle:', error);
      throw error;
    }
  }
  
  /**
   * Get all unspent notes
   * @returns {Promise<Array>} List of unspent notes
   */
  async getUnspentNotes() {
    return this.storageManager.getUnspentNotes();
  }
  
  /**
   * Mark note as spent
   * @param {string} commitment - Note commitment
   */
  async markNoteSpent(commitment) {
    await this.storageManager.markAsSpent(commitment);
    console.log(`🏷️ Marked note ${commitment} as spent`);
  }
}