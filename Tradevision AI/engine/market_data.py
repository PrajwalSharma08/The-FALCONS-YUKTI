import yfinance as yf

def get_all_forex_rates():
    forex_pairs = {
        "EUR/USD": "EURUSD=X",
        "GBP/USD": "GBPUSD=X",
        "USD/JPY": "JPY=X",
        "USD/CHF": "CHF=X",
        "AUD/USD": "AUDUSD=X",
        "USD/CAD": "USDCAD=X",
        "NZD/USD": "NZDUSD=X",
        "EUR/GBP": "EURGBP=X",
        "EUR/JPY": "EURJPY=X",
        "GBP/JPY": "GBPJPY=X"
    }

    rates = {}

    for pair_name, symbol in forex_pairs.items():
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d")

            if not data.empty:
                rates[pair_name] = round(data["Close"].iloc[-1], 5)
            else:
                rates[pair_name] = "No Data"

        except Exception as e:
            rates[pair_name] = f"Error: {e}"

    return rates
