import { ServiceHealth } from '../types/health';
export declare class HealthMonitor {
    private merkleClient;
    private poseidonClient;
    private storageClient;
    private rpcClient;
    private syncClient;
    constructor(merkleClient?: any, poseidonClient?: any, storageClient?: any, rpcClient?: any, syncClient?: any);
    checkAll(): Promise<ServiceHealth>;
    private checkStorage;
    private checkMerkle;
    private checkPoseidon;
    private checkRpc;
    private checkSync;
}
//# sourceMappingURL=monitor.d.ts.map