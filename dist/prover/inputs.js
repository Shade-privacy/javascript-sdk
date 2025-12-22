import { SHADE_DOMAIN } from '../domain/constants.ts';
export class ProofInputsAssembler {
    constructor(merkleClient, commitmentBuilder) {
        this.merkleClient = merkleClient;
        this.commitmentBuilder = commitmentBuilder;
    }
    /**
     * Assemble all inputs for proof generation
     */
    async assemble(note, options = {}) {
        // Get Merkle path
        const merklePath = await this.merkleClient.getMerklePath(note.metadata.commitment);
        // Calculate nullifier hash
        const nullifierHash = await this.commitmentBuilder.calculateNullifierHash(note.secrets.nullifier, note.secrets.secret);
        // Decompose amount for range proof
        const amountDecomposition = this.decomposeAmount(note.metadata.amount);
        // Assemble private inputs
        const privateInputs = {
            secret: note.secrets.secret.toString(),
            nullifier: note.secrets.nullifier.toString(),
            amount: note.metadata.amount.toString(),
            amount_decomposition: amountDecomposition.map(a => a.toString()),
            merkle_path: merklePath.path,
            merkle_path_index: merklePath.index
        };
        // Assemble public inputs
        const publicInputs = {
            merkle_root: merklePath.root,
            nullifier_hash: nullifierHash.toString(),
            asset_id: note.metadata.assetId.toString(),
            relayer_fee: (options.relayerFee || 0n).toString(),
            protocol_fee: (options.protocolFee || 0n).toString(),
            recipient: options.recipient
        };
        return {
            private: privateInputs,
            public: publicInputs,
            circuit_id: 'shade_transfer_v1'
        };
    }
    /**
     * Decompose amount into bits for range proof
     */
    decomposeAmount(amount) {
        const decomposition = [];
        for (let i = 0; i < SHADE_DOMAIN.AMOUNT_DECOMPOSITION_BITS; i++) {
            decomposition.push((amount >> BigInt(i)) & 1n);
        }
        return decomposition;
    }
}
//# sourceMappingURL=inputs.js.map