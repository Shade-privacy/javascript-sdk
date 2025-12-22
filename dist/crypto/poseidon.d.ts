export declare class PoseidonClient {
    private serviceUrl;
    constructor(serviceUrl?: string);
    /**
     * Compute Poseidon hash of inputs
     */
    hash(inputs: (bigint | string | number)[]): Promise<bigint>;
    /**
     * Test connection to Poseidon service
     */
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=poseidon.d.ts.map