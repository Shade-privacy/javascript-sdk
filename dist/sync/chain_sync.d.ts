export declare class ChainSyncManager {
    fullSync(): Promise<SyncResult>;
    incrementalSync(): Promise<SyncResult>;
    syncWallet(address: string): Promise<void>;
}
//# sourceMappingURL=chain_sync.d.ts.map