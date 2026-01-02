# Shade Intent Node.js SDK

[![npm version](https://img.shields.io/npm/v/veil-privacy.svg)](https://www.npmjs.com/package/veil-privacy)
[![npm downloads](https://img.shields.io/npm/dm/veil-privacy.svg)](https://www.npmjs.com/package/veil-privacy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Node.js SDK for private cross-chain transactions with ZK proofs.

## Installation

```bash
npm install veil-privacy
# or
yarn add veil-privacy



Quick Start

const { ZKIntentSDK } = require('veil-privacy');

const sdk = new ZKIntentSDK({
  apiKey: 'your_api_key',
  hmacSecret: 'your_hmac_secret'
});

// Create intent
const result = await sdk.createIntent({
  payload: {
    recipient: '0x...',
    amount: 1.5,
    token: 'ETH',
    walletType: 'starknet'
  },
  walletSignature: '0x...',
  metadata: { note: 'Private payment' }
});

console.log('Intent ID:', result.intentId);