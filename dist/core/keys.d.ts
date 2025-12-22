export interface NoteSecrets {
    secret: bigint;
    nullifier: bigint;
    noteId: bigint;
}
export declare class KeyManager {
    /**
     * Generate cryptographically secure note secrets
     */
    static generateSecrets(): NoteSecrets;
    /**
     * Generate a random bigint of specified bit length
     */
    private static generateRandomBigInt;
    /**
     * Temporary hash for noteId - will be replaced with Poseidon service
     */
    private static hashNoteId;
    private static simpleDeterministicHash;
}
//# sourceMappingURL=keys.d.ts.map