import { PublicInputs } from '../prover/inputs.js';
export interface ExecutionConstraints {
    maxFee: bigint;
    expiry: number;
    maxGas?: bigint;
    nonce?: bigint;
}
export interface ExecutionBundle {
    proof: {
        a: [string, string];
        b: [[string, string], [string, string]];
        c: [string, string];
    };
    publicInputs: PublicInputs;
    callData: string;
    constraints: ExecutionConstraints;
    signature?: string;
    timestamp: number;
    version: string;
}
export declare class ExecutionBundleBuilder {
    private version;
    /**
     * Build execution bundle for the executor
     */
    build(proof: any, publicInputs: PublicInputs, callData: string, constraints: ExecutionConstraints): ExecutionBundle;
    /**
     * Normalize proof format
     */
    private normalizeProof;
    /**
     * Serialize bundle for transmission
     */
    serialize(bundle: ExecutionBundle): string;
    /**
     * Deserialize bundle
     */
    deserialize(data: string): ExecutionBundle;
}
//# sourceMappingURL=bundle.d.ts.map