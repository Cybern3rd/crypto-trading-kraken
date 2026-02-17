#!/usr/bin/env python3
"""
Test Kraken API connectivity and fetch account info
"""
import os
import time
import urllib.parse
import hashlib
import hmac
import base64
import requests
import json

# Load credentials
# Load from environment (DO NOT HARDCODE)
import os
KRAKEN_API_KEY = os.getenv('KRAKEN_API_KEY') or open('./credentials/kraken-api.env').read().split('KRAKEN_API_KEY=')[1].split('\n')[0]
KRAKEN_PRIVATE_KEY = os.getenv('KRAKEN_PRIVATE_KEY') or open('./credentials/kraken-api.env').read().split('KRAKEN_PRIVATE_KEY=')[1].split('\n')[0]

API_URL = "https://api.kraken.com"

def get_kraken_signature(urlpath, data, secret):
    """Generate Kraken API signature"""
    postdata = urllib.parse.urlencode(data)
    encoded = (str(data['nonce']) + postdata).encode()
    message = urlpath.encode() + hashlib.sha256(encoded).digest()
    mac = hmac.new(base64.b64decode(secret), message, hashlib.sha512)
    sigdigest = base64.b64encode(mac.digest())
    return sigdigest.decode()

def kraken_request(uri_path, data):
    """Make authenticated Kraken API request"""
    headers = {
        'API-Key': KRAKEN_API_KEY,
        'API-Sign': get_kraken_signature(uri_path, data, KRAKEN_PRIVATE_KEY)
    }
    response = requests.post(API_URL + uri_path, headers=headers, data=data)
    return response.json()

def test_public_api():
    """Test public API (no auth required)"""
    print("=" * 60)
    print("Testing Public API (Server Time)")
    print("=" * 60)
    response = requests.get(f"{API_URL}/0/public/Time")
    data = response.json()
    print(json.dumps(data, indent=2))
    return data.get('error', []) == []

def test_account_balance():
    """Test private API - get account balance"""
    print("\n" + "=" * 60)
    print("Testing Private API (Account Balance)")
    print("=" * 60)
    uri_path = '/0/private/Balance'
    data = {
        'nonce': str(int(time.time() * 1000))
    }
    result = kraken_request(uri_path, data)
    print(json.dumps(result, indent=2))
    return result

def test_trade_balance():
    """Get trade balance"""
    print("\n" + "=" * 60)
    print("Testing Trade Balance")
    print("=" * 60)
    uri_path = '/0/private/TradeBalance'
    data = {
        'nonce': str(int(time.time() * 1000))
    }
    result = kraken_request(uri_path, data)
    print(json.dumps(result, indent=2))
    return result

def get_ticker_info(pair="XBTUSD"):
    """Get current price for a trading pair"""
    print(f"\n" + "=" * 60)
    print(f"Getting Ticker Info for {pair}")
    print("=" * 60)
    response = requests.get(f"{API_URL}/0/public/Ticker?pair={pair}")
    data = response.json()
    print(json.dumps(data, indent=2))
    return data

if __name__ == "__main__":
    print("\n🪙 KRAKEN API TEST\n")
    
    # Test public API
    if test_public_api():
        print("\n✅ Public API working")
    else:
        print("\n❌ Public API failed")
        exit(1)
    
    # Test account balance
    balance = test_account_balance()
    if balance.get('error'):
        print(f"\n❌ Authentication failed: {balance['error']}")
        exit(1)
    else:
        print("\n✅ Authentication successful")
    
    # Test trade balance
    trade_balance = test_trade_balance()
    
    # Get BTC price
    btc_ticker = get_ticker_info("XBTUSD")
    
    # Get ETH price
    eth_ticker = get_ticker_info("ETHUSD")
    
    print("\n" + "=" * 60)
    print("TEST COMPLETE")
    print("=" * 60)
