import { Note } from './core/notes.js';
import { PublicInputs } from './prover/inputs.js';
import { ExecutionConstraints, ExecutionBundle } from './execution/bundle.js';
import { ProofInputs } from './prover/inputs.js';
import { AssetId } from './domain/constants.js';
export interface SDKConfig {
    walletSignature: string;
    poseidonUrl?: string;
    merkleUrl?: string;
    proverUrl?: string;
}
export declare class ShadeSDK {
    private config;
    private poseidonClient;
    private merkleClient;
    private commitmentBuilder;
    private noteEngine;
    private storage;
    private proofAssembler;
    private bundleBuilder;
    constructor(config: SDKConfig);
    initialize(): Promise<void>;
    createNote(assetId: AssetId, amount: bigint): Promise<{
        note: Note;
        commitment: bigint;
        bucketAmount: bigint;
    }>;
    getUnspentNotes(assetId?: AssetId): Promise<Note[]>;
    prepareSpendProof(commitment: string, options?: {
        relayerFee?: bigint;
        protocolFee?: bigint;
        recipient?: string;
    }): Promise<{
        note: Note;
        proofInputs: ProofInputs;
    }>;
    /**
     * Build execution bundle
     */
    buildExecutionBundle(proof: any, publicInputs: PublicInputs, callData: string, constraints: ExecutionConstraints): Promise<ExecutionBundle>;
    markNoteSpent(commitment: string): Promise<void>;
    getStatus(): {
        version: string;
        initialized: boolean;
        services: {
            poseidon: string;
            merkle: string;
        };
    };
}
//# sourceMappingURL=index.d.ts.map