# Kraken Crypto Trading Bot

Automated cryptocurrency trading system using Kraken API with conservative DCA + Momentum strategy.

## Strategy

**Conservative Dollar-Cost Averaging + Momentum**
- **Target Return:** 1-3% monthly (12-36% annually)
- **Risk Profile:** Low (capital preservation focused)
- **Max Loss:** 1% per trade, 5% daily loss limit
- **Asset Allocation:** 70% BTC, 30% ETH
- **Approach:**
  - Dollar-cost averaging (regular small buys)
  - Momentum indicators (buy dips, sell peaks)
  - Stop-loss on every trade
  - Daily P&L tracking

## Setup

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure API Keys

Create `credentials/kraken-api.env`:

```bash
KRAKEN_API_KEY=your_api_key_here
KRAKEN_PRIVATE_KEY=your_private_key_here
```

**Required Permissions:**
- Query Funds
- Query Open Orders & Trades
- Query Closed Orders & Trades
- Create & Modify Orders

### 3. Test Connection

```bash
node src/kraken-client.js
```

You should see current BTC price if connection works.

## Usage

### Paper Trading (Recommended First)

```bash
npm run paper-trade
```

Simulates trades without real money. Run for 48 hours minimum before going live.

### Live Trading

```bash
npm run live-trade
```

**WARNING:** This will place real orders with real money. Start with small amounts ($100-500).

### Backtest Strategy

```bash
npm run backtest
```

Tests strategy on historical data to estimate performance.

## Safety Features

1. **Max Loss Limits:**
   - 1% per trade
   - 5% per day
   - Bot auto-stops if hit

2. **Position Sizing:**
   - Never more than 10% of portfolio in one trade
   - DCA spreads buys over time

3. **Stop-Loss:**
   - Every trade has automatic stop-loss
   - Trailing stop-loss on profitable positions

4. **Emergency Stop:**
   - Press Ctrl+C to stop bot
   - All open positions logged
   - Can resume or liquidate manually

## Monitoring

### View Performance

```bash
npm run dashboard
```

Opens localhost:3000 with:
- Current positions
- P&L (daily, weekly, monthly)
- Trade history
- Strategy performance metrics

### Logs

All trades logged to `logs/trades.log`

## Files

- `src/kraken-client.js` - API client
- `src/strategy.js` - Trading strategy logic
- `src/backtest.js` - Backtesting engine
- `src/paper-trade.js` - Simulated trading
- `src/live-trade.js` - Live trading
- `src/dashboard.js` - Performance dashboard

## Roadmap

- [x] Kraken API integration
- [x] Strategy design
- [ ] Paper trading implementation
- [ ] Backtesting engine
- [ ] Live trading
- [ ] Performance dashboard
- [ ] Discord alerts
- [ ] Multi-exchange support

## Disclaimer

**USE AT YOUR OWN RISK.** This is experimental software. You can lose money trading cryptocurrency. Past performance does not guarantee future results. Start with small amounts and paper trade first.

## License

MIT
