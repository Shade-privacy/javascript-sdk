export class ExecutionBundleBuilder {
    constructor() {
        this.version = '1.0.0';
    }
    /**
     * Build execution bundle for the executor
     */
    build(proof, publicInputs, callData, constraints) {
        // Validate constraints
        if (constraints.expiry <= Math.floor(Date.now() / 1000)) {
            throw new Error('Expiry must be in the future');
        }
        if (constraints.maxFee < 0n) {
            throw new Error('Max fee must be non-negative');
        }
        return {
            proof: this.normalizeProof(proof),
            publicInputs,
            callData,
            constraints,
            timestamp: Date.now(),
            version: this.version
        };
    }
    /**
     * Normalize proof format
     */
    normalizeProof(proof) {
        // Ensure proof is in the correct format
        return {
            a: Array.isArray(proof.a) ? proof.a : [proof.a[0], proof.a[1]],
            b: [
                [proof.b[0][0], proof.b[0][1]],
                [proof.b[1][0], proof.b[1][1]]
            ],
            c: [proof.c[0], proof.c[1]]
        };
    }
    /**
     * Serialize bundle for transmission
     */
    serialize(bundle) {
        return JSON.stringify(bundle, (key, value) => {
            if (typeof value === 'bigint') {
                return value.toString();
            }
            return value;
        });
    }
    /**
     * Deserialize bundle
     */
    deserialize(data) {
        const parsed = JSON.parse(data);
        // Convert string numbers back to bigint where needed
        return {
            ...parsed,
            constraints: {
                ...parsed.constraints,
                maxFee: BigInt(parsed.constraints.maxFee),
                maxGas: parsed.constraints.maxGas ? BigInt(parsed.constraints.maxGas) : undefined,
                nonce: parsed.constraints.nonce ? BigInt(parsed.constraints.nonce) : undefined
            }
        };
    }
}
//# sourceMappingURL=bundle.js.map