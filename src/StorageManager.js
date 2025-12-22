import { openDB } from 'idb';
import { EncryptionService } from './EncryptionService.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class StorageManager {
  constructor(walletSignature) {
    this.walletSignature = walletSignature;
    this.encryption = new EncryptionService();
    this.storageKey = null;
  }
  
  async init() {
    // Derive encryption key from wallet signature
    this.storageKey = await this.deriveStorageKey(this.walletSignature);
    
    // Initialize IndexedDB
    this.db = await openDB('shade-notes', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          const store = db.createObjectStore('notes', { keyPath: 'commitment' });
          store.createIndex('spent', 'spent');
          store.createIndex('assetId', 'assetId');
          store.createIndex('timestamp', 'timestamp');
        }
      }
    });
    
    console.log('💾 Storage initialized');
  }
  
  async deriveStorageKey(walletSignature) {
    const encoder = new TextEncoder();
    const signatureBuffer = encoder.encode(walletSignature);
    
    // Use HKDF to derive key
    const baseKey = await crypto.subtle.importKey(
      'raw',
      signatureBuffer,
      { name: 'HKDF' },
      false,
      ['deriveKey']
    );
    
    return crypto.subtle.deriveKey(
      {
        name: 'HKDF',
        salt: encoder.encode('shade-storage-v1'),
        info: encoder.encode('note-encryption'),
        hash: 'SHA-256'
      },
      baseKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }
  
  async storeNote(noteData) {
    // Encrypt the note data
    const encrypted = await this.encryption.encrypt(
      this.storageKey,
      JSON.stringify(noteData.secrets)
    );
    
    const storedNote = {
      commitment: noteData.commitment,
      encryptedData: encrypted.ciphertext,
      iv: encrypted.iv,
      metadata: noteData.metadata,
      timestamp: Date.now(),
      spent: false
    };
    
    // Store in IndexedDB
    await this.db.put('notes', storedNote);
    
    // Also store in filesystem for backup (Node.js only)
    if (typeof window === 'undefined') {
      await this.storeToFilesystem(storedNote);
    }
    
    return noteData.commitment;
  }
  
  async storeToFilesystem(note) {
    try {
      const notesDir = path.join(process.env.HOME || process.env.USERPROFILE, '.shade', 'notes');
      
      // Create directory if it doesn't exist
      await fs.mkdir(notesDir, { recursive: true });
      
      const filename = `note_${note.commitment.slice(0, 16)}.json`;
      const filepath = path.join(notesDir, filename);
      
      await fs.writeFile(
        filepath,
        JSON.stringify(note, null, 2),
        'utf8'
      );
      
      console.log(`💾 Note backed up to filesystem: ${filepath}`);
    } catch (error) {
      console.warn('⚠️ Could not backup note to filesystem:', error.message);
    }
  }
  
  async getNote(commitment) {
    const stored = await this.db.get('notes', commitment);
    
    if (!stored) return null;
    
    // Decrypt the secrets
    const decryptedSecrets = await this.encryption.decrypt(
      this.storageKey,
      stored.encryptedData,
      stored.iv
    );
    
    return {
      secrets: JSON.parse(decryptedSecrets),
      metadata: stored.metadata,
      commitment: stored.commitment,
      spent: stored.spent
    };
  }
  
  async getUnspentNotes() {
    const allNotes = await this.db.getAll('notes');
    const unspent = allNotes.filter(note => !note.spent);
    
    const decryptedNotes = await Promise.all(
      unspent.map(async (stored) => {
        const decryptedSecrets = await this.encryption.decrypt(
          this.storageKey,
          stored.encryptedData,
          stored.iv
        );
        
        return {
          commitment: stored.commitment,
          secrets: JSON.parse(decryptedSecrets),
          metadata: stored.metadata,
          spent: stored.spent
        };
      })
    );
    
    return decryptedNotes;
  }
  
  async markAsSpent(commitment) {
    const tx = this.db.transaction('notes', 'readwrite');
    const store = tx.objectStore('notes');
    
    const note = await store.get(commitment);
    if (note) {
      note.spent = true;
      await store.put(note);
      await tx.done;
    }
  }
}