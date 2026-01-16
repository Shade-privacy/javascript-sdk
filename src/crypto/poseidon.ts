import axios from 'axios';

export class PoseidonClient {
  private serviceUrl: string;
  
  constructor(serviceUrl?: string) {
    // Remove the hardcoded default and require explicit URL
    if (!serviceUrl) {
      throw new Error('serviceUrl is required. Please provide the URL of your Poseidon service.');
    }
    this.serviceUrl = serviceUrl;
  }
  
  /**
   * Compute Poseidon hash of inputs
   */
  async hash(inputs: (bigint | string | number)[]): Promise<bigint> {
    try {
      // Convert all inputs to decimal strings
      const stringInputs = inputs.map(input => {
        if (typeof input === 'bigint') {
          return input.toString();
        }
        if (typeof input === 'string' && input.startsWith('0x')) {
          return BigInt(input).toString();
        }
        return String(input);
      });
      
      console.debug(`🔢 Poseidon inputs: ${stringInputs.join(', ')}`);
      
      const response = await axios.post(`${this.serviceUrl}/poseidon`, {
        inputs: stringInputs
      }, {
        timeout: 10000,
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.data.hash) {
        throw new Error('Invalid response from Poseidon service');
      }
      
      const result = BigInt(response.data.hash);
      console.debug(`🎯 Poseidon result: ${result}`);
      
      return result;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(`Poseidon service error: ${error.message} - ${error.response?.data?.error || 'No details'}`);
      }
      throw error;
    }
  }
  
  /**
   * Test connection to Poseidon service
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.serviceUrl}/test`, { timeout: 5000 });
      return response.status === 200;
    } catch {
      return false;
    }
  }
}