import { NoteEngine } from './core/notes.js';
import { CommitmentBuilder } from './core/commitment_builder.js';
import { PoseidonClient } from './crypto/poseidon.js';
import { StorageManager } from './storage/manager.js';
import { MerkleClient } from './merkle/client.js';
import { ProofInputsAssembler } from './prover/inputs.js';
import { ExecutionBundleBuilder } from './execution/bundle.js';
export class ShadeSDK {
    constructor(config) {
        // Validate config
        if (!config.walletSignature) {
            throw new Error('walletSignature is required');
        }
        this.config = config;
        // Initialize clients
        this.poseidonClient = new PoseidonClient(config.poseidonUrl);
        this.merkleClient = new MerkleClient(config.merkleUrl);
        // Initialize core components
        this.commitmentBuilder = new CommitmentBuilder(this.poseidonClient);
        this.noteEngine = new NoteEngine(this.commitmentBuilder);
        this.storage = new StorageManager();
        this.proofAssembler = new ProofInputsAssembler(this.merkleClient, this.commitmentBuilder);
        this.bundleBuilder = new ExecutionBundleBuilder();
    }
    /**
     * Initialize SDK (must be called first)
     */
    async initialize() {
        console.log('🔧 Initializing Shade SDK...');
        // Test Poseidon service
        const poseidonReady = await this.poseidonClient.testConnection();
        if (!poseidonReady) {
            throw new Error('Poseidon service not available');
        }
        // Initialize storage
        await this.storage.initialize(this.config.walletSignature);
        console.log('✅ Shade SDK initialized');
    }
    /**
     * Create a new note (deposit)
     */
    async createNote(assetId, amount) {
        console.log(`📝 Creating note: ${amount} of asset ${assetId}`);
        const note = await this.noteEngine.createNote(assetId, amount);
        const storageId = await this.storage.storeNote(note);
        console.log(`💾 Note stored with commitment: ${note.metadata.commitment}`);
        return {
            note,
            commitment: note.metadata.commitment,
            bucketAmount: note.metadata.bucketAmount
        };
    }
    /**
     * Get unspent notes (optionally filtered by asset)
     */
    async getUnspentNotes(assetId) {
        return this.storage.getUnspentNotes(assetId);
    }
    /**
     * Prepare proof for spending a note
     */
    async prepareSpendProof(commitment, options = {}) {
        console.log(`🔍 Preparing spend proof for: ${commitment}`);
        // Load note
        const note = await this.storage.getNote(commitment);
        if (!note) {
            throw new Error(`Note not found: ${commitment}`);
        }
        if (note.metadata.spent) {
            throw new Error('Note already spent');
        }
        // Prepare note for spending
        const preparedNote = await this.noteEngine.prepareForSpending(note);
        // Assemble proof inputs
        const proofInputs = await this.proofAssembler.assemble(preparedNote, options);
        console.log(`📊 Proof inputs assembled`);
        return {
            note: preparedNote,
            proofInputs
        };
    }
    /**
     * Build execution bundle
     */
    async buildExecutionBundle(proof, publicInputs, callData, constraints) {
        return this.bundleBuilder.build(proof, publicInputs, callData, constraints);
    }
    /**
     * Mark note as spent (call after successful execution)
     */
    async markNoteSpent(commitment) {
        await this.storage.markAsSpent(commitment);
        console.log(`🏷️ Note marked as spent: ${commitment}`);
    }
    /**
     * Get SDK version and status
     */
    getStatus() {
        return {
            version: '1.0.0',
            initialized: true,
            services: {
                poseidon: 'connected',
                merkle: 'connected'
            }
        };
    }
}
//# sourceMappingURL=index.js.map