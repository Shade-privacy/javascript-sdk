export interface MerklePath {
    root: string;
    path: string[];
    index: number;
    leaf: string;
    sibling?: string[];
}
export declare class MerkleClient {
    private serviceUrl;
    constructor(serviceUrl?: string);
    /**
     * Get Merkle path for a commitment
     */
    getMerklePath(commitment: bigint | string): Promise<MerklePath>;
    /**
     * Get current Merkle root
     */
    getCurrentRoot(): Promise<string>;
    /**
     * Verify Merkle path locally
     */
    verifyMerklePath(leaf: string, path: string[], index: number, root: string): boolean;
}
//# sourceMappingURL=client.d.ts.map