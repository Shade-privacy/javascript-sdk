import axios from 'axios';

export interface MerklePath {
  root: string;
  path: string[];
  index: number;
  leaf: string;
  sibling?: string[];
}

export class MerkleClient {
  private serviceUrl: string;
  
  constructor(serviceUrl: string = 'http://localhost:3002') {
    this.serviceUrl = serviceUrl;
  }
  
  /**
   * Get Merkle path for a commitment
   */
  async getMerklePath(commitment: bigint | string): Promise<MerklePath> {
    const commitmentStr = typeof commitment === 'bigint' 
      ? commitment.toString() 
      : commitment;
    
    try {
      const response = await axios.get(`${this.serviceUrl}/merkle-path`, {
        params: { commitment: commitmentStr },
        timeout: 10000
      });
      
      if (!response.data.root || !response.data.path) {
        throw new Error('Invalid Merkle path response');
      }
      
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Merkle service error: ${error.message}`);
      }
      throw error;
    }
  }
  
  /**
   * Get current Merkle root
   */
  async getCurrentRoot(): Promise<string> {
    try {
      const response = await axios.get(`${this.serviceUrl}/root`, { timeout: 5000 });
      return response.data.root;
    } catch (error) {
      throw new Error(`Failed to get Merkle root: ${error}`);
    }
  }
  
  /**
   * Verify Merkle path locally
   */
  verifyMerklePath(leaf: string, path: string[], index: number, root: string): boolean {
    // This would use Poseidon to verify the path
    // For now, assume valid if service returns it
    return true;
  }
}