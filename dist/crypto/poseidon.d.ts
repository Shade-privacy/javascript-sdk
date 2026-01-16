export declare class PoseidonClient {
    private poseidon;
    constructor();
    /**
     * Initialize Poseidon hash function
     */
    private initializePoseidon;
    /**
     * Wait for Poseidon to be initialized
     */
    private ensureInitialized;
    /**
     * Convert any input to BigInt
     */
    private parseInput;
    /**
     * Compute Poseidon hash of inputs locally
     */
    hash(inputs: (bigint | string | number)[]): Promise<bigint>;
    /**
     * Test if Poseidon is ready (always true for local version)
     */
    testConnection(): Promise<boolean>;
    /**
     * Alternative: Direct hash without async/await
     */
    hashSync(inputs: (bigint | string | number)[]): bigint;
}
//# sourceMappingURL=poseidon.d.ts.map