import { Note } from '../core/notes.js';
export declare class StorageManager {
    private db;
    private encryption;
    private storageKey;
    constructor();
    /**
     * Initialize storage with wallet signature
     */
    initialize(walletSignature: string): Promise<void>;
    /**
     * Store a note securely
     */
    storeNote(note: Note): Promise<string>;
    /**
     * Retrieve a note by commitment
     */
    getNote(commitment: string): Promise<Note | null>;
    /**
     * Get all unspent notes for an asset
     */
    getUnspentNotes(assetId?: bigint): Promise<Note[]>;
    /**
     * Mark note as spent
     */
    markAsSpent(commitment: string): Promise<void>;
    /**
     * Backup note to filesystem (Node.js only)
     */
    private backupToFilesystem;
}
//# sourceMappingURL=manager.d.ts.map