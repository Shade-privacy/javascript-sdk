import { ShadeSDK } from './sdk/index.js';

async function main() {
  try {
    // 1. Initialize SDK with wallet signature
    const sdk = new ShadeSDK({
      walletSignature: '0x123456...', // User's wallet signature
      poseidonUrl: 'http://localhost:3001',
      merkleUrl: 'http://localhost:3002',
      proverUrl: 'http://localhost:3003'
    });
    
    await sdk.initialize();
    
    // 2. Create a note (deposit)
    const assetId = 1n; // USDC = 1
    const amount = 150n; // $150
    
    const { commitment, bucketAmount } = await sdk.createNote(assetId, amount);
    console.log(`📝 Note created!`);
    console.log(`   Commitment: ${commitment}`);
    console.log(`   Bucket amount: ${bucketAmount}`);
    
    // 3. Get all unspent notes
    const unspentNotes = await sdk.getUnspentNotes();
    console.log(`📊 You have ${unspentNotes.length} unspent notes`);
    
    // 4. Prepare proof for spending
    const proofInputs = await sdk.prepareProof(commitment.toString(), {
      relayerFee: 1n,
      protocolFee: 0n
    });
    
    console.log(`🔍 Proof inputs prepared:`, proofInputs);
    
    // 5. Generate proof (requires prover service)
    const proof = await sdk.generateProof(proofInputs);
    
    // 6. Build execution bundle
    const bundle = await sdk.buildExecutionBundle(
      proof,
      proofInputs.public,
      {
        to: '0xContractAddress',
        data: '0x...',
        value: 0
      },
      {
        maxFee: 1000000n,
        expiry: Math.floor(Date.now() / 1000) + 3600,
        recipient: '0xRecipientAddress'
      }
    );
    
    console.log(`✅ Execution bundle ready:`, bundle);
    
    // 7. Mark note as spent after successful execution
    await sdk.markNoteSpent(commitment.toString());
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run if in Node.js
if (typeof window === 'undefined') {
  main();
}