export class ChainSyncManager {
    async fullSync() {
        // 1. Scan all deposit events
        // 2. Reconstruct notes for each wallet
        // 3. Update merkle paths
        // 4. Check nullifier registry for spent notes
    }
    async incrementalSync() {
        // Sync only new blocks
    }
    async syncWallet(address) {
        // Sync specific wallet
    }
}
//# sourceMappingURL=chain_sync.js.map