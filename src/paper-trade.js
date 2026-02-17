#!/usr/bin/env node
/**
 * Paper Trading Mode - Simulated Trading
 * Tests strategy without risking real money
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const PAPER_BALANCE = {
  USD: 1000.00,  // Starting balance
  BTC: 0,
  ETH: 0
};

const TRADES_LOG = path.join(__dirname, '../logs/paper-trades.json');
const STATE_FILE = path.join(__dirname, '../logs/paper-state.json');

// Strategy parameters
const STRATEGY = {
  dcaAmount: 100,        // $100 per DCA buy
  dcaInterval: 86400000, // 24 hours
  btcAllocation: 0.7,    // 70% BTC
  ethAllocation: 0.3,    // 30% ETH
  maxLossPerTrade: 0.01, // 1% max loss per trade
  maxDailyLoss: 0.05,    // 5% max loss per day
  stopLossPercent: 0.02, // 2% stop-loss
  takeProfitPercent: 0.05 // 5% take-profit
};

/**
 * Fetch current price from Kraken public API
 */
function fetchPrice(pair) {
  return new Promise((resolve, reject) => {
    const url = `https://api.kraken.com/0/public/Ticker?pair=${pair}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.error && json.error.length > 0) {
            reject(new Error(json.error.join(', ')));
          } else {
            const result = json.result;
            const key = Object.keys(result)[0];
            const price = parseFloat(result[key].c[0]); // Current price
            resolve(price);
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

/**
 * Load paper trading state
 */
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading state:', err);
  }
  
  return {
    balance: { ...PAPER_BALANCE },
    positions: [],
    trades: [],
    startTime: Date.now(),
    lastDCATime: 0,
    dailyPnL: 0,
    totalPnL: 0
  };
}

/**
 * Save paper trading state
 */
function saveState(state) {
  try {
    const dir = path.dirname(STATE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (err) {
    console.error('Error saving state:', err);
  }
}

/**
 * Calculate portfolio value
 */
async function calculatePortfolioValue(state) {
  const btcPrice = await fetchPrice('XBTUSD');
  const ethPrice = await fetchPrice('ETHUSD');
  
  const usdValue = state.balance.USD;
  const btcValue = state.balance.BTC * btcPrice;
  const ethValue = state.balance.ETH * ethPrice;
  
  return {
    total: usdValue + btcValue + ethValue,
    usd: usdValue,
    btc: btcValue,
    eth: ethValue,
    prices: { BTC: btcPrice, ETH: ethPrice }
  };
}

/**
 * Execute DCA buy
 */
async function executeDCA(state) {
  console.log('\n💰 Executing DCA Buy...');
  
  const btcPrice = await fetchPrice('XBTUSD');
  const ethPrice = await fetchPrice('ETHUSD');
  
  const btcAmount = STRATEGY.dcaAmount * STRATEGY.btcAllocation;
  const ethAmount = STRATEGY.dcaAmount * STRATEGY.ethAllocation;
  
  // Check if we have enough USD
  if (state.balance.USD < STRATEGY.dcaAmount) {
    console.log('⚠️  Insufficient USD balance for DCA');
    return;
  }
  
  // Buy BTC
  const btcQty = btcAmount / btcPrice;
  state.balance.USD -= btcAmount;
  state.balance.BTC += btcQty;
  
  state.trades.push({
    time: Date.now(),
    type: 'buy',
    asset: 'BTC',
    quantity: btcQty,
    price: btcPrice,
    usdValue: btcAmount,
    reason: 'DCA'
  });
  
  console.log(`✅ Bought ${btcQty.toFixed(8)} BTC at $${btcPrice.toFixed(2)} ($${btcAmount.toFixed(2)})`);
  
  // Buy ETH
  const ethQty = ethAmount / ethPrice;
  state.balance.USD -= ethAmount;
  state.balance.ETH += ethQty;
  
  state.trades.push({
    time: Date.now(),
    type: 'buy',
    asset: 'ETH',
    quantity: ethQty,
    price: ethPrice,
    usdValue: ethAmount,
    reason: 'DCA'
  });
  
  console.log(`✅ Bought ${ethQty.toFixed(8)} ETH at $${ethPrice.toFixed(2)} ($${ethAmount.toFixed(2)})`);
  
  state.lastDCATime = Date.now();
}

/**
 * Check for take-profit or stop-loss triggers
 */
async function checkPositions(state) {
  // For paper trading, we track all holdings as one position
  if (state.balance.BTC === 0 && state.balance.ETH === 0) return;
  
  const portfolio = await calculatePortfolioValue(state);
  const initialValue = PAPER_BALANCE.USD;
  const currentValue = portfolio.total;
  const pnl = currentValue - initialValue;
  const pnlPercent = (pnl / initialValue) * 100;
  
  // Take profit if up 5%
  if (pnlPercent >= STRATEGY.takeProfitPercent * 100) {
    console.log(`\n🎯 TAKE PROFIT triggered at +${pnlPercent.toFixed(2)}%`);
    console.log('   (In live mode, would sell all positions)');
  }
  
  // Stop loss if down 2%
  if (pnlPercent <= -STRATEGY.stopLossPercent * 100) {
    console.log(`\n🛑 STOP LOSS triggered at ${pnlPercent.toFixed(2)}%`);
    console.log('   (In live mode, would sell all positions)');
  }
}

/**
 * Display status
 */
async function displayStatus(state) {
  const portfolio = await calculatePortfolioValue(state);
  const initialValue = PAPER_BALANCE.USD;
  const pnl = portfolio.total - initialValue;
  const pnlPercent = ((pnl / initialValue) * 100).toFixed(2);
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 PAPER TRADING STATUS');
  console.log('='.repeat(60));
  console.log(`\n💵 Balance:`);
  console.log(`   USD: $${state.balance.USD.toFixed(2)}`);
  console.log(`   BTC: ${state.balance.BTC.toFixed(8)} ($${portfolio.btc.toFixed(2)})`);
  console.log(`   ETH: ${state.balance.ETH.toFixed(8)} ($${portfolio.eth.toFixed(2)})`);
  console.log(`\n📈 Portfolio:`);
  console.log(`   Total Value: $${portfolio.total.toFixed(2)}`);
  console.log(`   P&L: $${pnl.toFixed(2)} (${pnlPercent}%)`);
  console.log(`\n📊 Prices:`);
  console.log(`   BTC: $${portfolio.prices.BTC.toFixed(2)}`);
  console.log(`   ETH: $${portfolio.prices.ETH.toFixed(2)}`);
  console.log(`\n📋 Trades: ${state.trades.length}`);
  console.log(`   Runtime: ${Math.floor((Date.now() - state.startTime) / 3600000)}h`);
  console.log('='.repeat(60) + '\n');
}

/**
 * Main trading loop
 */
async function main() {
  console.log('🚀 Paper Trading Mode Starting...');
  console.log('   Starting Balance: $1,000 USD');
  console.log('   Strategy: DCA + Momentum');
  console.log('   DCA Amount: $100 every 24h');
  console.log('   Allocation: 70% BTC, 30% ETH\n');
  
  let state = loadState();
  
  while (true) {
    try {
      // Display status
      await displayStatus(state);
      
      // Check if it's time for DCA
      const timeSinceLastDCA = Date.now() - state.lastDCATime;
      if (timeSinceLastDCA >= STRATEGY.dcaInterval) {
        await executeDCA(state);
      } else {
        const hoursUntilNext = Math.ceil((STRATEGY.dcaInterval - timeSinceLastDCA) / 3600000);
        console.log(`⏰ Next DCA in ~${hoursUntilNext} hours`);
      }
      
      // Check positions for take-profit/stop-loss
      await checkPositions(state);
      
      // Save state
      saveState(state);
      
      // Wait 1 minute before next check
      console.log('\n💤 Sleeping 60 seconds...');
      await new Promise(resolve => setTimeout(resolve, 60000));
      
    } catch (error) {
      console.error('❌ Error in trading loop:', error);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { loadState, saveState, executeDCA, calculatePortfolioValue };
