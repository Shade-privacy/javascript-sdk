export interface SyncResult {
    success: boolean;
    blockNumber?: number;
    error?: string;
    timestamp: number;
    details?: Record<string, any>;
    newLeaves?: number;
    lastBlockSynced?: number;
}
export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';
export interface ServiceHealth {
    status: HealthStatus;
    timestamp: number;
    [key: string]: HealthStatus | number | any;
}
//# sourceMappingURL=health.d.ts.map