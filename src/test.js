// test.js
const ZKIntentSDK = require('./index');

(async () => {
  try {
    // Initialize SDK
    const sdk = new ZKIntentSDK({
      apiKey: 'ElepcaGxwmUc1KfgaCB1i1rTrZoaId5G',
      hmacSecret: '9f36107e82ab2382bdeb3fc655327fb1d732544e3e574c3f53f6ec42d8774de0',
      baseUrl: 'http://localhost:8000/api', // optional
    });

    // Example payload
    const payload = {
      recipient: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
      amount: 100.67,
      token: '1',
      walletType: 'ethereum',
      walletAddress: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
    };

    const walletSignature = '0xFakeWalletSignature';

    // Create an intent
    const intentResponse = await sdk.createIntent({ payload, walletSignature });
    console.log('Intent Response:', intentResponse);

    // Listen for proof via WebSocket (optional)
    sdk.listenProof(intentResponse.intentId, (proofData) => {
      console.log('Proof received:', proofData);
    });

    // Or poll for proof status
    const proofStatus = await sdk.pollProofStatus(intentResponse.intentId);
    console.log('Proof Status:', proofStatus);

  } catch (err) {
    console.error('Error:', err.message);
  }
})();
