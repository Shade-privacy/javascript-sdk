import { SyncResult } from '../types/health';
export declare class ChainSync {
    fullSync(): Promise<SyncResult>;
    incrementalSync(): Promise<SyncResult>;
    private syncToLatest;
    private syncFromLastCheckpoint;
}
//# sourceMappingURL=chain_sync.d.ts.map