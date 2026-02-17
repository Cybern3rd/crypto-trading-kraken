#!/usr/bin/env node
/**
 * Kraken API Client - Authenticated Requests
 * Node.js implementation for crypto trading
 */

const crypto = require('crypto');
const https = require('https');
const querystring = require('querystring');

// Load credentials
// Load from environment or credentials file (DO NOT HARDCODE)
const API_KEY = process.env.KRAKEN_API_KEY || require('fs').readFileSync('./credentials/kraken-api.env', 'utf8').split('\n').find(l => l.startsWith('KRAKEN_API_KEY=')).split('=')[1];
const PRIVATE_KEY = process.env.KRAKEN_PRIVATE_KEY || require('fs').readFileSync('./credentials/kraken-api.env', 'utf8').split('\n').find(l => l.startsWith('KRAKEN_PRIVATE_KEY=')).split('=')[1];

/**
 * Generate Kraken API signature
 */
function getKrakenSignature(path, data, secret) {
  const message = querystring.stringify(data);
  const secret_buffer = Buffer.from(secret, 'base64');
  const hash = crypto.createHash('sha256');
  const hmac = crypto.createHmac('sha512', secret_buffer);
  const hash_digest = hash.update(data.nonce + message).digest();
  const hmac_digest = hmac.update(path + hash_digest, 'binary').digest('base64');
  return hmac_digest;
}

/**
 * Make authenticated Kraken API request
 */
function krakenRequest(endpoint, data = {}) {
  return new Promise((resolve, reject) => {
    // Add nonce (timestamp in milliseconds)
    data.nonce = Date.now() * 1000;
    
    const path = `/0/private/${endpoint}`;
    const postData = querystring.stringify(data);
    const signature = getKrakenSignature(path, data, PRIVATE_KEY);
    
    const options = {
      hostname: 'api.kraken.com',
      path: path,
      method: 'POST',
      headers: {
        'API-Key': API_KEY,
        'API-Sign': signature,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': postData.length
      }
    };
    
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.error && response.error.length > 0) {
            reject(new Error(`Kraken API Error: ${response.error.join(', ')}`));
          } else {
            resolve(response.result);
          }
        } catch (err) {
          reject(err);
        }
      });
    });
    
    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Get public ticker data (no auth required)
 */
function getPublicTicker(pair = 'XBTUSD') {
  return new Promise((resolve, reject) => {
    https.get(`https://api.kraken.com/0/public/Ticker?pair=${pair}`, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (response.error && response.error.length > 0) {
            reject(new Error(`Kraken API Error: ${response.error.join(', ')}`));
          } else {
            resolve(response.result);
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Test suite
 */
async function runTests() {
  console.log('\n🪙 KRAKEN API CLIENT TEST\n');
  console.log('=' .repeat(60));
  
  try {
    // Test 1: Public API (Server Time)
    console.log('\n📡 Test 1: Public API (no auth)');
    const btcPrice = await getPublicTicker('XBTUSD');
    console.log('✅ BTC/USD Price:', Object.values(btcPrice)[0].c[0]);
    
    // Test 2: Account Balance
    console.log('\n💰 Test 2: Account Balance (authenticated)');
    const balance = await krakenRequest('Balance');
    console.log('✅ Account Balance:');
    console.log(JSON.stringify(balance, null, 2));
    
    // Test 3: Trade Balance
    console.log('\n📊 Test 3: Trade Balance');
    const tradeBalance = await krakenRequest('TradeBalance');
    console.log('✅ Trade Balance:');
    console.log(`   Equivalent Balance: ${tradeBalance.eb} USD`);
    console.log(`   Trade Balance: ${tradeBalance.tb} USD`);
    console.log(`   Free Margin: ${tradeBalance.m} USD`);
    console.log(`   P&L: ${tradeBalance.n} USD`);
    
    // Test 4: Open Orders
    console.log('\n📋 Test 4: Open Orders');
    const openOrders = await krakenRequest('OpenOrders');
    const orderCount = Object.keys(openOrders.open || {}).length;
    console.log(`✅ Open Orders: ${orderCount}`);
    
    // Test 5: Get Tradable Asset Pairs
    console.log('\n💱 Test 5: Available Trading Pairs (BTC, ETH)');
    const ethPrice = await getPublicTicker('ETHUSD');
    console.log('✅ ETH/USD Price:', Object.values(ethPrice)[0].c[0]);
    
    console.log('\n' + '=' .repeat(60));
    console.log('✅ ALL TESTS PASSED');
    console.log('=' .repeat(60));
    console.log('\n✨ Kraken API authentication successful!');
    console.log('📈 Ready to implement trading strategy\n');
    
  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
    process.exit(1);
  }
}

// Export functions for use in other modules
module.exports = {
  krakenRequest,
  getPublicTicker,
  getKrakenSignature
};

// Run tests if executed directly
if (require.main === module) {
  runTests();
}
