import { EncryptedData } from '../crypto/encryption.js';
import { Note, NoteMetadata } from '../core/notes.js';
interface StoredNote {
    commitment: string;
    encryptedSecrets: EncryptedData;
    metadata: NoteMetadata;
    spent: boolean;
    createdAt: number;
    updatedAt: number;
}
export declare class StorageManager {
    private db;
    private encryption;
    private storageKey;
    constructor();
    initialize(walletSignature: string): Promise<void>;
    private getStorageKey;
    private getDB;
    storeNote(note: Note): Promise<string>;
    getNote(commitment: string): Promise<Note | null>;
    getUnspentNotes(assetId?: bigint): Promise<Note[]>;
    getUnspentNotesWithRange(assetId?: bigint): Promise<Note[]>;
    markAsSpent(commitment: string): Promise<void>;
    getAllNotes(): Promise<StoredNote[]>;
    clearAll(): Promise<void>;
    private backupToFilesystem;
    getStatus(): {
        initialized: boolean;
        hasKey: boolean;
        hasDB: boolean;
    };
}
export {};
//# sourceMappingURL=manager.d.ts.map