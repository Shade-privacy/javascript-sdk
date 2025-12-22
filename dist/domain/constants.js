export const SHADE_DOMAIN = {
    // Bucket sizes for amount hiding (powers of 2)
    AMOUNT_BUCKETS: [
        1n, 2n, 4n, 8n, 16n, 32n, 64n, 128n, 256n, 512n,
        1024n, 2048n, 4096n, 8192n, 16384n, 32768n,
        65536n, 131072n, 262144n, 524288n,
        1048576n, 2097152n, 4194304n, 8388608n,
        16777216n, 33554432n, 67108864n, 134217728n,
        268435456n, 536870912n, 1073741824n, 2147483648n
    ],
    // Asset IDs
    ASSETS: {
        ETH: 0n,
        USDC: 1n,
        USDT: 2n,
        DAI: 3n
    },
    // Maximum values
    MAX_AMOUNT: 2n ** 64n - 1n,
    MAX_NULLIFIER: 2n ** 256n - 1n,
    // Circuit parameters
    MERKLE_TREE_HEIGHT: 32,
    AMOUNT_DECOMPOSITION_BITS: 64,
    // Storage
    STORAGE_KEY_DERIVATION_SALT: 'shade-sdk-storage-key-v1',
    ENCRYPTION_ALGORITHM: 'AES-GCM'
};
//# sourceMappingURL=constants.js.map