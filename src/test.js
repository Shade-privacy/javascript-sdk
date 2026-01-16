// quick-test.js
import { ShadeSDK } from './dist/index.js';
import { SHADE_DOMAIN } from './dist/domain/constants.js';

async function quickTest() {
  console.log('🚀 Quick Shade SDK Test\n');
  
  try {
    // 1. Create SDK
    const sdk = new ShadeSDK({
      walletSignature: 'test-' + Date.now(),
      merkleUrl: 'http://localhost:3002'
    });
    
    console.log('✅ SDK created');
    
    // 2. Initialize
    await sdk.initialize();
    console.log('✅ SDK initialized');
    
    // 3. Create a note
    const result = await sdk.createNote(SHADE_DOMAIN.ASSETS.USDC, 103n);
    console.log('✅ Note created:');
    console.log(`   Commitment: 0x${result.commitment.toString(16).slice(0, 16)}...`);
    console.log(`   Amount: 103 USDC`);
    console.log(`   Bucket: ${result.bucketAmount} USDC`);
    
    // 4. Get unspent notes
    const notes = await sdk.getUnspentNotes();
    console.log(`\n💰 Unspent notes: ${notes.length}`);
    
    // 5. SDK status
    if (sdk.getStatus) {
      console.log('\n📊 SDK Status:', sdk.getStatus());
    }
    
    console.log('\n🎉 SDK is working perfectly!\n');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    
    if (error.message.includes('Poseidon')) {
      console.log('\n💡 Start services: npm run services:all');
    }
  }
}

quickTest();