import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export class PoseidonClient {
  private poseidon: ((inputs: bigint[]) => bigint) | null = null;

  constructor(serviceUrl?: string) {
    if (serviceUrl) {
      console.log(`🔧 Using local Poseidon (ignoring URL: ${serviceUrl})`);
    }
    this.initializePoseidon();
  }

  // ─────────────────────────────────────────────
  // Initialization
  // ─────────────────────────────────────────────

  private initializePoseidon(): void {
    if (this.poseidon) return;

    try {
      const circomlibjs = require("circomlibjs");

      /**
       * Your installed circomlibjs exports poseidon directly:
       *   circomlibjs.poseidon(inputs) -> bigint
       */
      if (typeof circomlibjs.poseidon !== "function") {
        throw new Error("poseidon function not found on circomlibjs");
      }

      this.poseidon = circomlibjs.poseidon;
      console.log("✅ Poseidon loaded (direct export)");
    } catch (err: any) {
      console.error("❌ Failed to load Poseidon:", err);
      throw new Error("Failed to initialize Poseidon hash function");
    }
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.poseidon) {
      this.initializePoseidon();
    }
  }

  // ─────────────────────────────────────────────
  // Input parsing (matches your Express logic)
  // ─────────────────────────────────────────────

  private parseInput(input: any): bigint {
    if (typeof input === "bigint") {
      return input;
    }

    if (typeof input === "number") {
      return BigInt(Math.floor(input));
    }

    if (typeof input === "string") {
      const clean = input.trim();

      if (clean.startsWith("0x")) {
        return BigInt(clean);
      }

      if (!/^-?\d+$/.test(clean)) {
        throw new Error(`Invalid decimal string: ${clean}`);
      }

      return BigInt(clean);
    }

    throw new Error(
      `Unsupported input type: ${typeof input}, value: ${JSON.stringify(input)}`
    );
  }

  // ─────────────────────────────────────────────
  // Poseidon hash (FIXED)
  // ─────────────────────────────────────────────

  private poseidonHash(inputs: any[]): string {
    if (!this.poseidon) {
      throw new Error("Poseidon not initialized");
    }

    const bigIntInputs = inputs.map((i) => this.parseInput(i));

    /**
     * Direct-export Poseidon returns a bigint
     * NOT a field element object
     */
    const result: bigint = this.poseidon(bigIntInputs);

    return result.toString();
  }

  // ─────────────────────────────────────────────
  // Public API
  // ─────────────────────────────────────────────

  async hash(inputs: (bigint | string | number)[]): Promise<bigint> {
    await this.ensureInitialized();

    if (!Array.isArray(inputs)) {
      throw new Error("inputs must be an array");
    }

    return BigInt(this.poseidonHash(inputs));
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.ensureInitialized();
      return this.poseidon !== null;
    } catch {
      return false;
    }
  }
}
