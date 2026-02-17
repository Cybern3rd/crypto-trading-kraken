# Crypto Trading System - Project Brief

**Started:** 2026-02-17 03:33 UTC  
**Owner:** Neo  
**Priority:** P1 - CRITICAL (Money-making)

## Objective
Build an automated cryptocurrency trading system using Kraken API to generate daily profit.

## Credentials
- **API Key:** Stored in `credentials/kraken-api.env`
- **Exchange:** Kraken
- **Access Level:** Full trading permissions

## Strategy Authority
**Green card granted** - I have full authority to define trading strategy, risk management, and execution parameters.

## Phase 1: Market Analysis & Strategy Design
### Goals
1. Test Kraken API connectivity
2. Analyze available trading pairs
3. Research profitable strategies (scalping, arbitrage, trend following, DCA)
4. Assess current market conditions
5. Define risk management rules (max loss per trade, position sizing)

### Deliverables
- API integration test
- Market analysis report
- Strategy selection document
- Risk management framework

## Phase 2: Bot Implementation
### Components
- Real-time market data feed
- Trading signal generation
- Order execution engine
- Position management
- Performance tracking
- Alert system (via Discord/Telegram)

### Technology Stack
- Python (ccxt library for exchange integration)
- Data storage (SQLite for local, or D1/PostgreSQL)
- Backtesting framework
- Live trading mode with safety limits

## Phase 3: Optimization & Monitoring
- Performance metrics dashboard
- Strategy refinement based on results
- Auto-adjustment based on market conditions
- Integration with ops-workflow-engine for tracking

## Risk Management Rules (Initial)
1. **Max loss per trade:** 1-2% of portfolio
2. **Daily loss limit:** 5% of portfolio
3. **Position sizing:** Scale with confidence/volatility
4. **Stop losses:** Always active
5. **Paper trading first:** Test for 24-48 hours before live trading

## Success Metrics
- **Target:** Consistent daily profit (even small amounts build up)
- **Primary:** Positive return over 7-day rolling window
- **Secondary:** Win rate > 55%, Risk/Reward ratio > 1:1.5
- **Key:** Capital preservation > aggressive gains

---

**Next Steps:**
1. Test Kraken API
2. Fetch account balance
3. Get available trading pairs
4. Analyze BTC/USD, ETH/USD markets
5. Research current profitable strategies
6. Build initial bot framework
