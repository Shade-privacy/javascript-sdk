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
export const PROTOCOL_VERSION = 1n;
export const TREE_HEIGHT = 20; // 2^20 ≈ 1M deposits
export const MAX_BATCH_SIZE = 15; // For entropy gating
export const NULLIFIER_TTL = 86400 * 7; // 7 days
export var PoseidonDomain;
(function (PoseidonDomain) {
    PoseidonDomain[PoseidonDomain["NOTE_SECRET"] = 0] = "NOTE_SECRET";
    PoseidonDomain[PoseidonDomain["NULLIFIER"] = 1] = "NULLIFIER";
    PoseidonDomain[PoseidonDomain["COMMITMENT"] = 2] = "COMMITMENT";
    PoseidonDomain[PoseidonDomain["WITHDRAWAL"] = 3] = "WITHDRAWAL";
    PoseidonDomain[PoseidonDomain["RECOVERY"] = 4] = "RECOVERY";
    PoseidonDomain[PoseidonDomain["ENCRYPTION"] = 5] = "ENCRYPTION";
})(PoseidonDomain || (PoseidonDomain = {}));
export var ErrorCode;
(function (ErrorCode) {
    // Crypto errors
    ErrorCode[ErrorCode["CRYPTO_INVALID_INPUT"] = 1001] = "CRYPTO_INVALID_INPUT";
    ErrorCode[ErrorCode["CRYPTO_HASH_FAILED"] = 1002] = "CRYPTO_HASH_FAILED";
    ErrorCode[ErrorCode["CRYPTO_ENCRYPTION_FAILED"] = 1003] = "CRYPTO_ENCRYPTION_FAILED";
    ErrorCode[ErrorCode["CRYPTO_DECRYPTION_FAILED"] = 1004] = "CRYPTO_DECRYPTION_FAILED";
    // Storage errors
    ErrorCode[ErrorCode["STORAGE_NOT_INITIALIZED"] = 2001] = "STORAGE_NOT_INITIALIZED";
    ErrorCode[ErrorCode["STORAGE_QUOTA_EXCEEDED"] = 2002] = "STORAGE_QUOTA_EXCEEDED";
    ErrorCode[ErrorCode["STORAGE_CORRUPTED"] = 2003] = "STORAGE_CORRUPTED";
    // Network errors
    ErrorCode[ErrorCode["NETWORK_TIMEOUT"] = 3001] = "NETWORK_TIMEOUT";
    ErrorCode[ErrorCode["NETWORK_UNAVAILABLE"] = 3002] = "NETWORK_UNAVAILABLE";
    ErrorCode[ErrorCode["NETWORK_INVALID_RESPONSE"] = 3003] = "NETWORK_INVALID_RESPONSE";
    // Wallet errors
    ErrorCode[ErrorCode["WALLET_NOT_FOUND"] = 4001] = "WALLET_NOT_FOUND";
    ErrorCode[ErrorCode["WALLET_INVALID_SIGNATURE"] = 4002] = "WALLET_INVALID_SIGNATURE";
    ErrorCode[ErrorCode["WALLET_RECOVERY_FAILED"] = 4003] = "WALLET_RECOVERY_FAILED";
    // Note errors
    ErrorCode[ErrorCode["NOTE_NOT_FOUND"] = 5001] = "NOTE_NOT_FOUND";
    ErrorCode[ErrorCode["NOTE_ALREADY_SPENT"] = 5002] = "NOTE_ALREADY_SPENT";
    ErrorCode[ErrorCode["NOTE_INVALID_STATE"] = 5003] = "NOTE_INVALID_STATE";
    ErrorCode[ErrorCode["NOTE_MERKLE_PATH_INVALID"] = 5004] = "NOTE_MERKLE_PATH_INVALID";
    // Sync errors
    ErrorCode[ErrorCode["SYNC_FAILED"] = 6001] = "SYNC_FAILED";
    ErrorCode[ErrorCode["SYNC_OUT_OF_ORDER"] = 6002] = "SYNC_OUT_OF_ORDER";
    ErrorCode[ErrorCode["SYNC_CONFLICT"] = 6003] = "SYNC_CONFLICT";
    // Validation errors
    ErrorCode[ErrorCode["VALIDATION_INVALID_CONFIG"] = 7001] = "VALIDATION_INVALID_CONFIG";
    ErrorCode[ErrorCode["VALIDATION_INVALID_INPUT"] = 7002] = "VALIDATION_INVALID_INPUT";
    ErrorCode[ErrorCode["VALIDATION_INVALID_PROOF"] = 7003] = "VALIDATION_INVALID_PROOF";
})(ErrorCode || (ErrorCode = {}));
export class ShadeError extends Error {
    constructor(code, message, details) {
        super(message);
        this.code = code;
        this.details = details;
        this.name = 'ShadeError';
    }
}
//# sourceMappingURL=constants.js.map