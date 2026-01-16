export declare class PoseidonClient {
    private poseidon;
    constructor(serviceUrl?: string);
    private initializePoseidon;
    private ensureInitialized;
    private parseInput;
    private poseidonHash;
    hash(inputs: (bigint | string | number)[]): Promise<bigint>;
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=poseidon.d.ts.map