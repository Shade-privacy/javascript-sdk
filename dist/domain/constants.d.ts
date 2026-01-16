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
export declare const PROTOCOL_VERSION = 1n;
export declare const TREE_HEIGHT = 20;
export declare const MAX_BATCH_SIZE = 15;
export declare const NULLIFIER_TTL: number;
export declare enum PoseidonDomain {
    NOTE_SECRET = 0,
    NULLIFIER = 1,
    COMMITMENT = 2,
    WITHDRAWAL = 3,
    RECOVERY = 4,
    ENCRYPTION = 5
}
export declare enum ErrorCode {
    CRYPTO_INVALID_INPUT = 1001,
    CRYPTO_HASH_FAILED = 1002,
    CRYPTO_ENCRYPTION_FAILED = 1003,
    CRYPTO_DECRYPTION_FAILED = 1004,
    STORAGE_NOT_INITIALIZED = 2001,
    STORAGE_QUOTA_EXCEEDED = 2002,
    STORAGE_CORRUPTED = 2003,
    NETWORK_TIMEOUT = 3001,
    NETWORK_UNAVAILABLE = 3002,
    NETWORK_INVALID_RESPONSE = 3003,
    WALLET_NOT_FOUND = 4001,
    WALLET_INVALID_SIGNATURE = 4002,
    WALLET_RECOVERY_FAILED = 4003,
    NOTE_NOT_FOUND = 5001,
    NOTE_ALREADY_SPENT = 5002,
    NOTE_INVALID_STATE = 5003,
    NOTE_MERKLE_PATH_INVALID = 5004,
    SYNC_FAILED = 6001,
    SYNC_OUT_OF_ORDER = 6002,
    SYNC_CONFLICT = 6003,
    VALIDATION_INVALID_CONFIG = 7001,
    VALIDATION_INVALID_INPUT = 7002,
    VALIDATION_INVALID_PROOF = 7003
}
export declare class ShadeError extends Error {
    code: ErrorCode;
    details?: any | undefined;
    constructor(code: ErrorCode, message: string, details?: any | undefined);
}
export type AssetId = typeof SHADE_DOMAIN.ASSETS[keyof typeof SHADE_DOMAIN.ASSETS];
//# sourceMappingURL=constants.d.ts.map