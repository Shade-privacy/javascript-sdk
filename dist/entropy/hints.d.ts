export interface EntropyHint {
    type: 'timestamp' | 'block' | 'random' | 'oracle';
    value: string;
    weight: number;
    source?: string;
}
export interface EntropyProof {
    hints: EntropyHint[];
    combinedEntropy: string;
    timestamp: number;
    signature?: string;
}
export declare class EntropyManager {
    /**
     * Generate entropy hints for private execution
     */
    static generateHints(): EntropyHint[];
    /**
     * Combine entropy hints
     */
    static combineHints(hints: EntropyHint[]): string;
    private static hashHint;
    /**
     * Verify entropy proof
     */
    static verifyProof(proof: EntropyProof): boolean;
}
//# sourceMappingURL=hints.d.ts.map