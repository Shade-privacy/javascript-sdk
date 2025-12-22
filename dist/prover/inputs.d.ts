import { Note } from '../core/notes.js';
import { MerkleClient } from '../merkle/client.js';
import { CommitmentBuilder } from '../core/commitment_builder.js';
export interface PrivateInputs {
    secret: string;
    nullifier: string;
    amount: string;
    amount_decomposition: string[];
    merkle_path: string[];
    merkle_path_index: number;
}
export interface PublicInputs {
    merkle_root: string;
    nullifier_hash: string;
    asset_id: string;
    relayer_fee: string;
    protocol_fee: string;
    recipient?: string;
}
export interface ProofInputs {
    private: PrivateInputs;
    public: PublicInputs;
    circuit_id: string;
}
export declare class ProofInputsAssembler {
    private merkleClient;
    private commitmentBuilder;
    constructor(merkleClient: MerkleClient, commitmentBuilder: CommitmentBuilder);
    /**
     * Assemble all inputs for proof generation
     */
    assemble(note: Note, options?: {
        relayerFee?: bigint;
        protocolFee?: bigint;
        recipient?: string;
    }): Promise<ProofInputs>;
    /**
     * Decompose amount into bits for range proof
     */
    private decomposeAmount;
}
//# sourceMappingURL=inputs.d.ts.map