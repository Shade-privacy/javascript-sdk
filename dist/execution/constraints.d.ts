export interface GasConstraints {
    maxGas: bigint;
    maxFeePerGas: bigint;
    priorityFeePerGas: bigint;
}
export interface TimeConstraints {
    expiry: number;
    startTime?: number;
}
export interface ExecutionContext {
    chainId: bigint;
    contractAddress: string;
    entryPoint?: string;
}
export interface PrivacyConstraints {
    minAnonymitySet: number;
    maxLinkability?: number;
}
export declare class ConstraintsBuilder {
    /**
     * Build default constraints
     */
    static default(): {
        gas: GasConstraints;
        time: TimeConstraints;
        context: ExecutionContext;
    };
    /**
     * Validate constraints
     */
    static validate(constraints: any): void;
}
//# sourceMappingURL=constraints.d.ts.map