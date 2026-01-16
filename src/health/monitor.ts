import { HealthStatus, ServiceHealth } from '../types/health';

export class HealthMonitor {
  private merkleClient: any;
  private poseidonClient: any;
  private storageClient: any;
  private rpcClient: any;
  private syncClient: any;

  // Add constructor to initialize clients
  constructor(
    merkleClient?: any,
    poseidonClient?: any,
    storageClient?: any,
    rpcClient?: any,
    syncClient?: any
  ) {
    this.merkleClient = merkleClient;
    this.poseidonClient = poseidonClient;
    this.storageClient = storageClient;
    this.rpcClient = rpcClient;
    this.syncClient = syncClient;
  }

  async checkAll(): Promise<ServiceHealth> {
    return {
      status: 'healthy', // Add required status field
      timestamp: Date.now(),
      storage: await this.checkStorage(),
      merkle: await this.checkMerkle(),
      poseidon: await this.checkPoseidon(),
      rpc: await this.checkRpc(),
      sync: await this.checkSync()
    };
  }
  
  private async checkStorage(): Promise<HealthStatus> {
    try {
      // Add actual storage check logic
      return 'healthy';
    } catch {
      return 'unhealthy';
    }
  }

  private async checkMerkle(): Promise<HealthStatus> {
    try {
      const root = await this.merkleClient.getLatestRoot();
      return root ? 'healthy' : 'degraded';
    } catch {
      return 'unhealthy'; // Changed from 'unavailable' to match HealthStatus type
    }
  }

  private async checkPoseidon(): Promise<HealthStatus> {
    try {
      // Add actual poseidon check logic
      return 'healthy';
    } catch {
      return 'unhealthy';
    }
  }

  private async checkRpc(): Promise<HealthStatus> {
    try {
      // Add actual RPC check logic
      return 'healthy';
    } catch {
      return 'unhealthy';
    }
  }

  private async checkSync(): Promise<HealthStatus> {
    try {
      // Add actual sync check logic
      return 'healthy';
    } catch {
      return 'unhealthy';
    }
  }
}