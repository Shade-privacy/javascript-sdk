export interface EncryptedData {
    ciphertext: string;
    iv: string;
    tag?: string;
}
export declare class EncryptionService {
    /**
     * Derive storage key from wallet signature
     */
    deriveStorageKey(walletSignature: string): Promise<CryptoKey>;
    /**
     * Encrypt data with AES-GCM
     */
    encrypt(key: CryptoKey, data: string): Promise<EncryptedData>;
    /**
     * Decrypt data
     */
    decrypt(key: CryptoKey, encrypted: EncryptedData): Promise<string>;
    /**
     * Convert ArrayBuffer to base64 string
     */
    private arrayBufferToBase64;
    /**
     * Convert base64 string to ArrayBuffer
     */
    private base64ToArrayBuffer;
    /**
     * Concatenate two ArrayBuffers
     */
    private concatBuffers;
    /**
     * Simple encryption for testing (no key derivation)
     */
    simpleEncrypt(data: string, password: string): Promise<EncryptedData>;
    /**
     * Generate a random encryption key
     */
    generateRandomKey(): Promise<CryptoKey>;
    /**
     * Export key to base64 for storage
     */
    exportKey(key: CryptoKey): Promise<string>;
    /**
     * Import key from base64 string
     */
    importKey(base64Key: string): Promise<CryptoKey>;
}
//# sourceMappingURL=encryption.d.ts.map