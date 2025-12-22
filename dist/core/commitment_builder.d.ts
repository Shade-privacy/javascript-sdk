import { PoseidonClient } from '../crypto/poseidon.ts';
export interface CommitmentResult {
    commitment: bigint;
    bucketAmount: bigint;
    rawInputs: {
        secret: bigint;
        nullifier: bigint;
        assetId: bigint;
        amount: bigint;
    };
}
export declare class CommitmentBuilder {
    private poseidon;
    constructor(poseidonClient: PoseidonClient);
    /**
     * Build commitment: Poseidon(secret, nullifier, assetId, bucketAmount)
     * This is the core cryptographic primitive of the system
     */
    buildCommitment(secret: bigint, nullifier: bigint, assetId: bigint, amount: bigint): Promise<CommitmentResult>;
    /**
     * Calculate nullifier hash for spending: Poseidon(nullifier, secret)
     * This prevents double-spending while maintaining privacy
     */
    calculateNullifierHash(nullifier: bigint, secret: bigint): Promise<bigint>;
    /**
     * Find the smallest bucket that can hold the amount
     * Buckets provide privacy by hiding exact amounts
     */
    private findBucket;
    /**
     * Validate input parameters
     */
    private validateInputs;
    /**
     * Validate nullifier hash inputs
     */
    private validateNullifierInputs;
    /**
     * Reconstruct commitment from components (for verification)
     */
    reconstructCommitment(secret: bigint, nullifier: bigint, assetId: bigint, bucketAmount: bigint): Promise<bigint>;
    /**
     * Decompose amount into buckets for circuit constraints
     */
    decomposeToBuckets(amount: bigint): {
        buckets: bigint[];
        remainder: bigint;
    };
    /**
     * Check if a commitment is valid (for debugging/verification)
     */
    verifyCommitment(commitment: bigint, secret: bigint, nullifier: bigint, assetId: bigint, amount: bigint): Promise<boolean>;
}
//# sourceMappingURL=commitment_builder.d.ts.map