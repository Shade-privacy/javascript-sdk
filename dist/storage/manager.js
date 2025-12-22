import { openDB } from 'idb';
import { EncryptionService } from '../crypto/encryption.js';
export class StorageManager {
    constructor() {
        this.db = null;
        this.storageKey = null;
        this.encryption = new EncryptionService();
    }
    async initialize(walletSignature) {
        this.storageKey = await this.encryption.deriveStorageKey(walletSignature);
        this.db = await openDB('shade-notes', 2, {
            upgrade(db, oldVersion, newVersion, transaction) {
                if (!db.objectStoreNames.contains('notes')) {
                    const store = db.createObjectStore('notes', { keyPath: 'commitment' });
                    store.createIndex('spent', 'spent');
                    store.createIndex('assetId', 'metadata.assetId');
                    store.createIndex('createdAt', 'createdAt');
                }
                if (oldVersion < 2) {
                    const store = transaction.objectStore('notes');
                    if (!store.indexNames.contains('spent_asset')) {
                        store.createIndex('spent_asset', ['spent', 'metadata.assetId']);
                    }
                }
            },
        });
        console.log('💾 Storage initialized');
    }
    getStorageKey() {
        if (!this.storageKey) {
            throw new Error('Storage key not initialized. Call initialize() first.');
        }
        return this.storageKey;
    }
    getDB() {
        if (!this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
    }
    async storeNote(note) {
        const db = this.getDB();
        const key = this.getStorageKey();
        const secretsJson = JSON.stringify({
            secret: note.secrets.secret.toString(),
            nullifier: note.secrets.nullifier.toString(),
            noteId: note.secrets.noteId.toString()
        });
        const encryptedSecrets = await this.encryption.encrypt(key, secretsJson);
        const storedNote = {
            commitment: note.metadata.commitment.toString(),
            encryptedSecrets,
            metadata: note.metadata,
            spent: false,
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        await db.put('notes', storedNote);
        await this.backupToFilesystem(storedNote);
        return note.metadata.commitment.toString();
    }
    async getNote(commitment) {
        const db = this.getDB();
        const key = this.getStorageKey();
        const stored = await db.get('notes', commitment);
        if (!stored)
            return null;
        const secretsJson = await this.encryption.decrypt(key, stored.encryptedSecrets);
        const secretsData = JSON.parse(secretsJson);
        const secrets = {
            secret: BigInt(secretsData.secret),
            nullifier: BigInt(secretsData.nullifier),
            noteId: BigInt(secretsData.noteId)
        };
        return {
            secrets,
            metadata: stored.metadata
        };
    }
    async getUnspentNotes(assetId) {
        const db = this.getDB();
        const key = this.getStorageKey();
        let storedNotes = [];
        if (assetId !== undefined) {
            // Method 1: Using getAll and filter (simpler)
            const allNotes = await db.getAll('notes');
            storedNotes = allNotes.filter((note) => !note.spent && note.metadata.assetId === assetId.toString());
        }
        else {
            // Method 2: Get all notes and filter for unspent
            const allNotes = await db.getAll('notes');
            storedNotes = allNotes.filter((note) => !note.spent);
            // OR Method 3: If you want to use the index:
            // storedNotes = await db.getAllFromIndex('notes', 'spent', IDBKeyRange.only(false));
        }
        // Decrypt all notes
        const notes = await Promise.all(storedNotes.map(async (stored) => {
            const secretsJson = await this.encryption.decrypt(key, stored.encryptedSecrets);
            const secretsData = JSON.parse(secretsJson);
            const secrets = {
                secret: BigInt(secretsData.secret),
                nullifier: BigInt(secretsData.nullifier),
                noteId: BigInt(secretsData.noteId)
            };
            return {
                secrets,
                metadata: stored.metadata
            };
        }));
        return notes;
    }
    // Alternative: Using IDBKeyRange correctly
    async getUnspentNotesWithRange(assetId) {
        const db = this.getDB();
        const key = this.getStorageKey();
        let storedNotes = [];
        if (assetId !== undefined) {
            // For composite index, use IDBKeyRange
            const assetIdStr = assetId.toString();
            storedNotes = await db.getAllFromIndex('notes', 'spent_asset', IDBKeyRange.bound([false, assetIdStr], [false, assetIdStr]));
        }
        else {
            // For simple index, use IDBKeyRange.only()
            storedNotes = await db.getAllFromIndex('notes', 'spent', IDBKeyRange.only(false));
        }
        // Decrypt all notes
        const notes = await Promise.all(storedNotes.map(async (stored) => {
            const secretsJson = await this.encryption.decrypt(key, stored.encryptedSecrets);
            const secretsData = JSON.parse(secretsJson);
            const secrets = {
                secret: BigInt(secretsData.secret),
                nullifier: BigInt(secretsData.nullifier),
                noteId: BigInt(secretsData.noteId)
            };
            return {
                secrets,
                metadata: stored.metadata
            };
        }));
        return notes;
    }
    async markAsSpent(commitment) {
        const db = this.getDB();
        const note = await db.get('notes', commitment);
        if (note) {
            note.spent = true;
            note.updatedAt = Date.now();
            await db.put('notes', note);
        }
    }
    async getAllNotes() {
        const db = this.getDB();
        return db.getAll('notes');
    }
    async clearAll() {
        const db = this.getDB();
        await db.clear('notes');
    }
    async backupToFilesystem(note) {
        if (typeof window !== 'undefined')
            return;
        try {
            const fs = await import('fs/promises');
            const path = await import('path');
            const { homedir } = await import('os');
            const notesDir = path.join(homedir(), '.shade', 'notes');
            await fs.mkdir(notesDir, { recursive: true });
            const filename = `note_${note.commitment.slice(0, 16)}.json`;
            const filepath = path.join(notesDir, filename);
            await fs.writeFile(filepath, JSON.stringify(note, null, 2), 'utf8');
            console.log(`💾 Note backed up to: ${filepath}`);
        }
        catch (error) {
            console.warn('⚠️ Filesystem backup failed:', error);
        }
    }
    getStatus() {
        return {
            initialized: !!this.db && !!this.storageKey,
            hasKey: !!this.storageKey,
            hasDB: !!this.db
        };
    }
}
//# sourceMappingURL=manager.js.map