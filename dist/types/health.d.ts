export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy';
export interface ServiceHealth {
    status: HealthStatus;
    timestamp: number;
    [key: string]: HealthStatus | number | any;
}
//# sourceMappingURL=health.d.ts.map