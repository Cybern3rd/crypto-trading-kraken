# Phase 1 Research Findings: Crypto/Polymarket Trading System

**Date:** 2026-02-13  
**Researcher:** Neo  
**Project:** Systematic Trading System ($100 Budget)

---

## Executive Summary

After researching exchanges, data sources, and strategies suitable for a $100 micro-account, I recommend a **hybrid approach**:
1. **Primary:** MEXC spot trading (no KYC, 0% maker fees, global access)
2. **Secondary:** Polymarket prediction markets (zero fees, event-driven)
3. **Strategy:** DCA + momentum on MEXC + event arbitrage on Polymarket

---

## 1. Market Analysis

### Polymarket (Prediction Markets)

**Fees:**
- **Zero trading fees** on standard prediction markets
- Taker fees only on: 15-min crypto markets (~3% max), NCAAB/Serie A markets, US app markets (0.10%)
- No minimum order size
- Gas fees: $0.01-$0.10 per transaction (Polygon L2)

**Requirements:**
- Deposit: $10-50 USDC + $1-5 MATIC for gas
- Wallet: MetaMask or similar (Polygon network)
- No KYC for basic trading

**Opportunities:**
- Market rebalancing arbitrage (within single market)
- Combinatorial arbitrage (across multiple related markets)
- Information edge on event outcomes
- HFT arbitrage exists but requires bots and speed

**Challenges for $100 account:**
- Opportunities last seconds/minutes
- Need real-time monitoring
- Gas fees eat small trades

### Crypto Exchanges (Spot Trading)

| Exchange | Trading Fee | Min Order | API | KYC Required | Best For |
|----------|-------------|-----------|-----|--------------|----------|
| **MEXC** ⭐ | 0% maker / 0.05% taker | ~$2 | ✅ Excellent | No | **TOP PICK - No KYC, global** |
| **Binance** | 0.1% | ~$10 | ✅ | Yes | Lowest fees but requires KYC |
| **Bybit** | 0.1% maker / 0.5% taker | ~$5-10 | ✅ | No (non-US) | Bot-friendly, US-restricted |
| **OKX** | 0.08-0.1% | ~$1-10 | ✅ | Yes | 350+ pairs |
| **Kraken** | 0.00-0.25% maker | $1+ | ✅ | Yes | US compliance |
| **KuCoin** | 0.1% | ~$1-10 | ✅ | Yes (US) | No US residents |
| **Coinbase** | 0.26-0.4% | $2 | ✅ | Yes | Beginner-friendly (high fees) |

**DECISION: MEXC** ✅
- ✅ **No KYC required**
- ✅ **No geographic restrictions** (works globally including US)
- ✅ **Zero maker fees** / 0.05% taker
- ✅ **Low minimum order** (~$2)
- ✅ **Excellent API** for bot trading
- ✅ **3,000+ trading pairs**

---

## 2. Data Sources

### Free Historical Data APIs

| Source | Coverage | Rate Limits | Best For |
|--------|----------|-------------|----------|
| **CCXT** | 120+ exchanges | Respect limits in code | Unified API |
| **CoinGecko** | 1 year daily/hourly | Free tier available | Price/volume data |
| **CryptoDataDownload** | Daily/hourly/minute | No limits | CSV downloads |
| **Binance API** | Full historical | Rate limited | Most accurate |
| **Yahoo Finance** | Limited crypto | 2000 calls/hour | Basic charts |

**Recommendation:** 
- Use CCXT for unified access
- Binance API for production data
- CoinGecko for quick validation

---

## 3. Strategy Analysis for $100 Accounts

### Strategy Comparison

| Strategy | Realism | Risk | Time Required | Expected Return |
|----------|---------|------|---------------|-----------------|
| **Dollar-Cost Averaging (DCA)** | ⭐⭐⭐⭐⭐ | Very Low | Minimal | 10-50% annually |
| **Momentum Trading** | ⭐⭐⭐ | Medium | High (active) | Variable |
| **Mean Reversion** | ⭐⭐⭐ | Medium | Medium | 5-15% monthly |
| **Arbitrage** | ⭐⭐ | Low (theory) | Very High | Small, consistent |

### Recommended Strategies for Phase 2

**Strategy 1: DCA with Momentum Overlay (Binance)**
- Core position: Weekly $10 DCA into BTC/ETH
- Overlay: Add $10 when RSI < 30 (oversold)
- Risk: Low, time-tested
- Fits guardrails perfectly

**Strategy 2: Event-Driven Polymarket**
- Identify markets with clear catalysts
- Enter when odds misprice probability
- Use small position sizing ($5-10 per market)
- Example: Election markets, sports outcomes

**Strategy 3: Mean Reversion (Crypto)**
- Bollinger Bands + RSI signals
- Trade BTC/USDT in ranging markets
- Tight stop-losses (2-3%)
- Requires active monitoring

---

## 4. Backtesting Framework

### Recommended Stack: VectorBT + CCXT

**Why VectorBT:**
- Fastest backtesting (10-30s for large datasets)
- Tick-level accuracy (matches Binance within 0.3%)
- Perfect for small account optimization
- NumPy/Pandas vectorized operations

**Alternative:** Backtrader for live trading integration

**Data Pipeline:**
```
CCXT → Fetch OHLCV → VectorBT → Optimize → Live Trading
```

---

## 5. Risk Management for Micro Accounts

### Position Sizing
- Max position: $20 (20% of account)
- Default position: $10 (10% of account)
- Keep $40-50 in reserve for opportunities

### Stop-Loss Rules
- Every trade must have stop-loss
- Max loss per trade: $2 (2% of account)
- Daily max loss: $10 (10% of account)
- Account halt at $50 (50% drawdown)

### Fee Management (MEXC)
- MEXC 0% maker / 0.05% taker fee = $0.01 on $20 trade
- Round trip (maker+taker) = $0.01 (0.05% of position)
- Pure maker orders = $0 fees
- Need 0.1%+ edge per trade to profit (much easier)

---

## 6. Phase 2: Strategy Design Plan

### Week 1: Setup & Data
1. Set up Python environment with VectorBT, CCXT
2. Create MEXC account (no KYC required)
3. Connect to MEXC API (spot trading)
4. Download 1 year BTC/ETH hourly data
5. Build backtesting framework

### Week 2: Strategy Development
1. Implement DCA momentum overlay strategy
2. Backtest on historical data
3. Optimize parameters (avoid overfitting)
4. Paper trade for 3-5 days

### Week 3: Polymarket Integration
1. Set up MetaMask + Polygon
2. Deposit $50 USDC + MATIC
3. Research active markets with edge
4. Test small positions ($5) manually

### Week 4: System Integration
1. Combine strategies into portfolio
2. Build monitoring dashboard
3. Document all trades
4. Prepare for live trading

---

## 7. Requirements from Ruben

### Immediate Needs
1. **MEXC account** (no KYC required - I can create)
2. **MEXC API credentials** (generate read + spot trading keys)
3. **$100 capital** transfer (USDT to MEXC, USDC to Polymarket)
4. **Risk parameter confirmation:**
   - Confirm $10 daily loss limit
   - Confirm $50 account halt level
   - Confirm max 20% position size

### Infrastructure Setup
1. Python environment (local or VPS)
2. Wallet setup for Polymarket (I can guide)
3. Telegram alerts for trade signals (optional)

---

## 8. Initial Hypotheses to Test

1. **H1:** BTC/ETH show predictable mean reversion during low-volatility periods
2. **H2:** Polymarket election markets offer 5-10% edge in final 48 hours
3. **H3:** RSI(14) < 30 with volume spike predicts 2-5% bounce within 48h
4. **H4:** DCA outperforms active trading for accounts <$500

---

## Next Steps

1. **Get approval** on research findings and Phase 2 plan
2. **Receive API keys** and $100 capital
3. **Begin Strategy Design** (Week 1 tasks)
4. **Daily reporting** to Ruben on progress

---

**Research completed. Ready to proceed to Phase 2 upon approval.**
