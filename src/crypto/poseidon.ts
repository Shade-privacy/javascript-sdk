import { buildPoseidon } from 'circomlibjs';

export class PoseidonClient {
  private poseidon: any = null;
  
  constructor(serviceUrl?: string) {
    // Accept URL but ignore it (just log it for debugging)
    if (serviceUrl) {
      console.log(`🔧 Note: Using local Poseidon computation (ignoring provided URL: ${serviceUrl})`);
    }
    this.initializePoseidon();
  }
  
  /**
   * Initialize Poseidon hash function
   */
  private async initializePoseidon(): Promise<void> {
    if (!this.poseidon) {
      try {
        this.poseidon = await buildPoseidon();
        console.log("✅ Poseidon hash function loaded locally");
      } catch (error) {
        console.error("❌ Failed to load Poseidon:", error);
        throw new Error('Failed to initialize Poseidon hash function');
      }
    }
  }
  
  /**
   * Wait for Poseidon to be initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.poseidon) {
      await this.initializePoseidon();
    }
  }
  
  /**
   * Convert any input to BigInt
   */
  private parseInput(input: bigint | string | number): bigint {
    if (typeof input === 'bigint') {
      return input;
    }
    
    if (typeof input === 'string') {
      const cleanInput = input.trim();
      
      if (cleanInput.startsWith('0x')) {
        // Handle hex strings (0x...)
        return BigInt(cleanInput);
      } else if (cleanInput.includes('.')) {
        // Handle decimal numbers with decimal points
        throw new Error(`Floating point numbers not supported: ${cleanInput}`);
      } else {
        // Handle decimal strings
        return BigInt(cleanInput);
      }
    }
    
    if (typeof input === 'number') {
      // Handle JavaScript numbers
      if (!Number.isInteger(input)) {
        throw new Error(`Floating point numbers not supported: ${input}`);
      }
      return BigInt(input);
    }
    
    throw new Error(`Unsupported input type: ${typeof input}, value: ${input}`);
  }
  
  /**
   * Compute Poseidon hash of inputs locally
   */
  async hash(inputs: (bigint | string | number)[]): Promise<bigint> {
    try {
      await this.ensureInitialized();
      
      // Convert all inputs to BigInt first
      const bigIntInputs = inputs.map(input => this.parseInput(input));
      
      console.debug(`🔢 Poseidon inputs: ${bigIntInputs.map(b => b.toString()).join(', ')}`);
      
      // Compute hash locally
      const hashResult = this.poseidon(bigIntInputs);
      
      // Convert to BigInt (poseidon.F.toString gives decimal string)
      const result = BigInt(this.poseidon.F.toString(hashResult));
      
      console.debug(`🎯 Poseidon result: ${result}`);
      
      return result;
    } catch (error: any) {
      throw new Error(`Poseidon hash computation failed: ${error.message}`);
    }
  }
  
  /**
   * Test if Poseidon is ready (always true for local version)
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      return true;
    } catch {
      return false;
    }
  }
  
  /**
   * Alternative: Direct hash without async/await
   */
  hashSync(inputs: (bigint | string | number)[]): bigint {
    if (!this.poseidon) {
      throw new Error('Poseidon not initialized. Call await client.testConnection() first.');
    }
    
    const bigIntInputs = inputs.map(input => this.parseInput(input));
    const hashResult = this.poseidon(bigIntInputs);
    return BigInt(this.poseidon.F.toString(hashResult));
  }
}