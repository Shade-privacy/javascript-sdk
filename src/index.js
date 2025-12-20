// index.js
const axios = require('axios');
const { encryptPayload } = require('./utils/encrypt');
const { signPayload } = require('./utils/sign');
const { connectWebSocket } = require('./utils/websockets');

class ZKIntentSDK {
  constructor({ apiKey, hmacSecret, baseUrl = 'http://localhost:8000/api' }) {
    if (!apiKey || !hmacSecret) {
      throw new Error('apiKey and hmacSecret are required');
    }
    this.apiKey = apiKey;
    this.hmacSecret = hmacSecret;
    this.baseUrl = baseUrl;
  }

  /**
   * Validate amount string for blockchain compatibility
   * - Must have ≤ 18 digits before decimal point (uint256 max)
   * - Must be a positive number
   * @param {string|number} amount - Amount to validate
   * @returns {string} Validated amount as string
   * @throws {Error} If amount is invalid
   */
  validateAmount(amount) {
    if (typeof amount !== 'string' && typeof amount !== 'number') {
      throw new Error('amount must be a string or number');
    }
    
    const amountStr = amount.toString().trim();
    
    // Remove any commas or spaces
    const cleanAmount = amountStr.replace(/,/g, '').replace(/\s/g, '');
    
    // Check if it's a valid number
    if (isNaN(parseFloat(cleanAmount))) {
      throw new Error('amount must be a valid number');
    }
    
    // Check if positive
    const amountNum = parseFloat(cleanAmount);
    if (amountNum <= 0) {
      throw new Error('amount must be a positive number');
    }
    
    // Split into integer and decimal parts
    const [integerPart, decimalPart = ''] = cleanAmount.split('.');
    
    // Check max 18 digits before decimal point (uint256 max with 18 decimals)
    if (integerPart.length > 18) {
      throw new Error(`amount cannot have more than 18 digits before the decimal point (got ${integerPart.length} digits: ${integerPart})`);
    }
    
    // Check that integer part only contains digits
    if (!/^\d+$/.test(integerPart)) {
      throw new Error('amount integer part must contain only digits');
    }
    
    // Check that decimal part only contains digits (if present)
    if (decimalPart && !/^\d*$/.test(decimalPart)) {
      throw new Error('amount decimal part must contain only digits');
    }
    
    // Return the cleaned amount as string
    return cleanAmount;
  }

  /**
   * Create a new ZK intent
   * @param {Object} options
   * @param {Object} options.payload - Transaction payload {recipient, amount, token, walletType, walletAddress}
   * @param {string} options.walletSignature - Wallet signature of the payload
   * @param {Object} [options.metadata] - Optional metadata {note, priority, ...}
   * @returns {Promise<Object>} Backend response
   */
  async createIntent({ payload, walletSignature, metadata = {} }) {
    // 1️⃣ Validate input
    if (!payload || typeof payload !== 'object') {
      throw new Error('payload must be a non-empty object');
    }
    if (!walletSignature || typeof walletSignature !== 'string') {
      throw new Error('walletSignature is required and must be a string');
    }

    const requiredFields = ['recipient', 'amount', 'token', 'walletType'];
    const missingFields = requiredFields.filter((f) => !(f in payload));
    if (missingFields.length > 0) {
      throw new Error(`Missing required payload fields: ${missingFields.join(', ')}`);
    }

    // Validate and normalize amount
    const validatedAmount = this.validateAmount(payload.amount);
    
    // Create a copy of payload with validated amount
    const validatedPayload = {
      ...payload,
      amount: validatedAmount
    };

    // Ensure walletAddress is provided
    if (!validatedPayload.walletAddress) {
      console.warn('walletAddress not provided, using default placeholder');
      validatedPayload.walletAddress = '0xDEFAULTADDRESS';
    }

    // 2️⃣ Combine payload and wallet signature
    const combinedData = { ...validatedPayload, walletSignature };

    // 3️⃣ Encrypt combined data
    const { ciphertext, iv, tag } = encryptPayload(combinedData, this.hmacSecret);

    // 4️⃣ Format encrypted data with ciphertext field
    const encryptedData = {
      ciphertext: ciphertext,
      iv: iv,
      tag: tag,
      algorithm: 'AES-256-GCM'
    };

    // 5️⃣ Generate HMAC signature for request
    const timestamp = new Date().toISOString();
    const signature = signPayload(encryptedData.ciphertext, this.hmacSecret, timestamp);

    // 6️⃣ Send request to backend
    try {
      const response = await axios.post(
        `${this.baseUrl}/intents/`,
        {
          intent: { 
            payload: {
              ...validatedPayload,
              intent_id: payload.intent_id || `intent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
            }
          },
          encryptedData: encryptedData,
          metadata: metadata,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'x-signature': signature,
            'x-timestamp': timestamp,
          },
        }
      );
      
      console.log('✅ Intent submitted successfully:', {
        intentId: response.data.intentId,
        status: response.data.status,
        nullifier: response.data.nullifier,
        websocket_channel: response.data.websocket_channel || `proof_${response.data.intentId}`
      });
      
      return response.data;
    } catch (err) {
      console.error('❌ Failed to submit intent:', {
        error: err.message,
        response: err.response?.data,
        status: err.response?.status
      });
      throw err;
    }
  }

  /**
   * Listen for proof ready event over WebSocket
   * @param {string} intentId - ID of the intent
   * @param {function} callback - Function called with proof data
   * @returns {WebSocket} WebSocket instance
   */
  listenProof(intentId, callback) {
    if (!intentId) throw new Error('intentId is required');

    const wsUrl = `${this.baseUrl.replace(/^http/, 'ws')}/ws/proofs/${intentId}/`;
    return connectWebSocket(wsUrl, callback);
  }

  /**
   * Poll for proof status (alternative to WebSocket)
   * @param {string} intentId - ID of the intent
   * @param {number} [interval=2000] - Polling interval in ms
   * @param {number} [timeout=60000] - Timeout in ms
   * @returns {Promise<Object>} Proof result
   */
  async pollProofStatus(intentId, interval = 2000, timeout = 60000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const poll = async () => {
        try {
          const response = await axios.get(
            `${this.baseUrl}/intents/status/${intentId}/`,
            {
              headers: {
                'x-api-key': this.apiKey,
              },
            }
          );
          
          if (response.data.status === 'completed' || response.data.status === 'failed') {
            resolve(response.data);
          } else if (Date.now() - startTime > timeout) {
            reject(new Error(`Polling timeout after ${timeout}ms`));
          } else {
            setTimeout(poll, interval);
          }
        } catch (err) {
          reject(err);
        }
      };
      
      poll();
    });
  }
}

module.exports = ZKIntentSDK;