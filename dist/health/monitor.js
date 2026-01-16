export class HealthMonitor {
    async checkAll() {
        return {
            storage: await this.checkStorage(),
            merkle: await this.checkMerkle(),
            poseidon: await this.checkPoseidon(),
            rpc: await this.checkRpc(),
            sync: await this.checkSync()
        };
    }
    async checkMerkle() {
        try {
            const root = await this.merkleClient.getLatestRoot();
            return root ? 'healthy' : 'degraded';
        }
        catch {
            return 'unavailable';
        }
    }
}
//# sourceMappingURL=monitor.js.map