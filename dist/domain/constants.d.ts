export declare const SHADE_DOMAIN: {
    readonly AMOUNT_BUCKETS: readonly [1n, 2n, 4n, 8n, 16n, 32n, 64n, 128n, 256n, 512n, 1024n, 2048n, 4096n, 8192n, 16384n, 32768n, 65536n, 131072n, 262144n, 524288n, 1048576n, 2097152n, 4194304n, 8388608n, 16777216n, 33554432n, 67108864n, 134217728n, 268435456n, 536870912n, 1073741824n, 2147483648n];
    readonly ASSETS: {
        readonly ETH: 0n;
        readonly USDC: 1n;
        readonly USDT: 2n;
        readonly DAI: 3n;
    };
    readonly MAX_AMOUNT: bigint;
    readonly MAX_NULLIFIER: bigint;
    readonly MERKLE_TREE_HEIGHT: 32;
    readonly AMOUNT_DECOMPOSITION_BITS: 64;
    readonly STORAGE_KEY_DERIVATION_SALT: "shade-sdk-storage-key-v1";
    readonly ENCRYPTION_ALGORITHM: "AES-GCM";
};
export type AssetId = typeof SHADE_DOMAIN.ASSETS[keyof typeof SHADE_DOMAIN.ASSETS];
//# sourceMappingURL=constants.d.ts.map