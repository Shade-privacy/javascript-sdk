import { KeyManager } from './keys.js';
export class NoteEngine {
    constructor(commitmentBuilder) {
        this.commitmentBuilder = commitmentBuilder;
    }
    /**
     * Create a complete note with commitment
     */
    async createNote(assetId, amount) {
        // Generate secrets
        const secrets = KeyManager.generateSecrets();
        // Build commitment
        const { commitment, bucketAmount } = await this.commitmentBuilder.buildCommitment(secrets.secret, secrets.nullifier, assetId, amount);
        // Create metadata
        const metadata = {
            assetId,
            amount,
            bucketAmount,
            timestamp: Date.now(),
            spent: false,
            commitment
        };
        return { secrets, metadata };
    }
    /**
     * Prepare note for spending
     */
    async prepareForSpending(note) {
        const nullifierHash = await this.commitmentBuilder.calculateNullifierHash(note.secrets.nullifier, note.secrets.secret);
        return {
            ...note,
            metadata: {
                ...note.metadata,
                nullifierHash
            }
        };
    }
}
//# sourceMappingURL=notes.js.map