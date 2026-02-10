import yfinance as yf

def get_live_market_data(symbol="USDCAD=X"):
    ticker = yf.Ticker(symbol)
    data = ticker.history(period="1d")
    current_price = data['Close'].iloc[-1]
    return round(current_price, 5)

# Optional: Add News API logic here if needed for Round 2