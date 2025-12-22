export class PoseidonClient {
  constructor(serviceUrl = 'http://localhost:3001') {
    this.serviceUrl = serviceUrl;
  }
  
  async hash(inputs) {
    // Convert all inputs to string
    const stringInputs = inputs.map(input => {
      if (typeof input === 'bigint') {
        return input.toString();
      }
      return String(input);
    });
    
    const response = await fetch(`${this.serviceUrl}/poseidon`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ inputs: stringInputs })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Poseidon service error (${response.status}): ${errorText}`);
    }
    
    const data = await response.json();
    return BigInt(data.hash);
  }
  
  async testConnection() {
    try {
      const response = await fetch(`${this.serviceUrl}/test`);
      return response.ok;
    } catch {
      return false;
    }
  }
}