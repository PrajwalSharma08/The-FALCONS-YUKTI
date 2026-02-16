# engine/news_engine.py
import yfinance as yf

def get_market_news(symbol="GC=F"):
    try:
        ticker = yf.Ticker(symbol)
        news = ticker.news[:3]
        headlines = []
        for item in news:
            # Agar 'title' nahi mile toh 'headline' check karein
            title = item.get('title', item.get('headline', 'Market Update'))
            headlines.append(title)
        return headlines if headlines else ["No news available"]
    except:
        return ["News service temporarily unavailable"]