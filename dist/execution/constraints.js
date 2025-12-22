export class ConstraintsBuilder {
    /**
     * Build default constraints
     */
    static default() {
        return {
            gas: {
                maxGas: 1000000n,
                maxFeePerGas: 1000000000n, // 1 gwei
                priorityFeePerGas: 100000000n // 0.1 gwei
            },
            time: {
                expiry: Math.floor(Date.now() / 1000) + 3600, // 1 hour
                startTime: Math.floor(Date.now() / 1000)
            },
            context: {
                chainId: 1n, // Mainnet
                contractAddress: '0xShadeContract',
                entryPoint: '0xEntryPoint'
            }
        };
    }
    /**
     * Validate constraints
     */
    static validate(constraints) {
        const now = Math.floor(Date.now() / 1000);
        if (constraints.time.expiry <= now) {
            throw new Error('Expiry must be in the future');
        }
        if (constraints.gas.maxGas <= 0n) {
            throw new Error('Max gas must be positive');
        }
        if (constraints.gas.maxFeePerGas <= 0n) {
            throw new Error('Max fee per gas must be positive');
        }
    }
}
//# sourceMappingURL=constraints.js.map