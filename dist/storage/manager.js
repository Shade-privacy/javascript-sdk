import { EncryptionService } from '../crypto/encryption.js';
// Node.js file-based storage adapter
class NodeStorageAdapter {
    constructor(walletSignature) {
        this.data = new Map();
        const fs = require('fs');
        const path = require('path');
        const os = require('os');
        const notesDir = path.join(os.homedir(), '.shade', 'notes');
        if (!fs.existsSync(notesDir)) {
            fs.mkdirSync(notesDir, { recursive: true });
        }
        this.filePath = path.join(notesDir, `${walletSignature.slice(0, 16)}.json`);
        this.loadFromFile();
    }
    loadFromFile() {
        const fs = require('fs');
        try {
            if (fs.existsSync(this.filePath)) {
                const content = fs.readFileSync(this.filePath, 'utf8');
                const data = JSON.parse(content);
                this.data = new Map(Object.entries(data));
            }
        }
        catch (error) {
            console.warn('⚠️ Could not load notes from file:', error);
            this.data = new Map();
        }
    }
    saveToFile() {
        const fs = require('fs');
        try {
            const data = Object.fromEntries(this.data);
            fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf8');
        }
        catch (error) {
            console.warn('⚠️ Could not save notes to file:', error);
        }
    }
    async get(key) {
        return this.data.get(key) || null;
    }
    async getAll() {
        return Array.from(this.data.values());
    }
    async put(key, value) {
        this.data.set(key, value);
        this.saveToFile();
    }
    async delete(key) {
        this.data.delete(key);
        this.saveToFile();
    }
    async clear() {
        this.data.clear();
        this.saveToFile();
    }
    async getAllByIndex(indexName, value) {
        const allNotes = await this.getAll();
        switch (indexName) {
            case 'spent':
                return allNotes.filter(note => note.spent === value);
            case 'assetId':
                return allNotes.filter(note => note.metadata.assetId === value.toString());
            case 'spent_asset':
                const [spent, assetId] = value;
                return allNotes.filter(note => note.spent === spent && note.metadata.assetId === assetId.toString());
            default:
                return allNotes;
        }
    }
}
// Browser IndexedDB storage adapter
class BrowserStorageAdapter {
    constructor() {
        this.db = null;
        // Will be initialized in initialize()
    }
    async initialize() {
        const { openDB } = await import('idb');
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
    }
    async get(key) {
        return this.db.get('notes', key);
    }
    async getAll() {
        return this.db.getAll('notes');
    }
    async put(key, value) {
        await this.db.put('notes', value);
    }
    async delete(key) {
        await this.db.delete('notes', key);
    }
    async clear() {
        await this.db.clear('notes');
    }
    async getAllByIndex(indexName, value) {
        if (indexName === 'spent_asset') {
            return this.db.getAllFromIndex('notes', 'spent_asset', IDBKeyRange.bound([value[0], value[1]], [value[0], value[1]]));
        }
        else {
            return this.db.getAllFromIndex('notes', indexName, IDBKeyRange.only(value));
        }
    }
}
export class StorageManager {
    constructor() {
        this.adapter = null;
        this.storageKey = null;
        this.encryption = new EncryptionService();
        this.isNode = typeof window === 'undefined' && typeof process !== 'undefined';
    }
    async initialize(walletSignature) {
        // Derive storage key
        this.storageKey = await this.encryption.deriveStorageKey(walletSignature);
        // Initialize appropriate storage adapter
        if (this.isNode) {
            this.adapter = new NodeStorageAdapter(walletSignature);
            console.log('💾 Node.js storage initialized');
        }
        else {
            const browserAdapter = new BrowserStorageAdapter();
            await browserAdapter.initialize();
            this.adapter = browserAdapter;
            console.log('💾 Browser storage initialized');
        }
    }
    getStorageKey() {
        if (!this.storageKey) {
            throw new Error('Storage key not initialized. Call initialize() first.');
        }
        return this.storageKey;
    }
    getAdapter() {
        if (!this.adapter) {
            throw new Error('Storage adapter not initialized. Call initialize() first.');
        }
        return this.adapter;
    }
    async storeNote(note) {
        const adapter = this.getAdapter();
        const key = this.getStorageKey();
        // Convert secrets to JSON and encrypt
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
        await adapter.put(storedNote.commitment, storedNote);
        // In Node.js, also create backup
        if (this.isNode) {
            await this.backupToFilesystem(storedNote);
        }
        return storedNote.commitment;
    }
    async getNote(commitment) {
        const adapter = this.getAdapter();
        const key = this.getStorageKey();
        const stored = await adapter.get(commitment);
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
        const adapter = this.getAdapter();
        const key = this.getStorageKey();
        let storedNotes;
        if (assetId !== undefined) {
            storedNotes = await adapter.getAllByIndex('spent_asset', [false, assetId.toString()]);
        }
        else {
            storedNotes = await adapter.getAllByIndex('spent', false);
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
        const adapter = this.getAdapter();
        const stored = await adapter.get(commitment);
        if (stored) {
            stored.spent = true;
            stored.updatedAt = Date.now();
            await adapter.put(commitment, stored);
        }
    }
    async getAllNotes() {
        const adapter = this.getAdapter();
        return adapter.getAll();
    }
    async clearAll() {
        const adapter = this.getAdapter();
        await adapter.clear();
    }
    async backupToFilesystem(note) {
        try {
            const fs = require('fs/promises');
            const path = require('path');
            const os = require('os');
            const notesDir = path.join(os.homedir(), '.shade', 'backups');
            await fs.mkdir(notesDir, { recursive: true });
            const filename = `note_${note.commitment.slice(0, 16)}_${Date.now()}.json`;
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
            initialized: !!this.adapter && !!this.storageKey,
            environment: this.isNode ? 'node' : 'browser',
            hasKey: !!this.storageKey,
            hasAdapter: !!this.adapter
        };
    }
}
//# sourceMappingURL=manager.js.map