import os
import re
from groq import Groq
import json
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_neural_prices():
    """Neural Prices for top ticker bar"""
    try:
        prompt = "Provide current estimated prices for NIFTY, GOLD, BTC, ETH in raw JSON format. Numbers only."
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        raw = response.choices[0].message.content.strip()
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw, flags=re.IGNORECASE)
        return json.loads(cleaned)
    except:
        return {"NIFTY": 22124.5, "GOLD": 2040.0, "BTC": 64230.15, "ETH": 3452.1}

def get_global_heatmap():
    """
    Groq AI se poori duniya ke market sentiment ka snapshot lena.
    """
    try:
        prompt = """
        Analyze current global market sentiment for these indices:
        US: S&P 500, NASDAQ
        Europe: FTSE 100, DAX
        Asia: NIKKEI 225, HANG SENG, NIFTY 50
        
        Return ONLY a JSON object like this:
        {
          "US": {"sentiment": "Bullish", "change": "+1.2%", "status": "active"},
          "Europe": {"sentiment": "Bearish", "change": "-0.5%", "status": "active"},
          "Asia": {"sentiment": "Neutral", "change": "+0.1%", "status": "closed"}
        }
        Provide realistic current estimates based on your neural data.
        """
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        raw = response.choices[0].message.content.strip()
        cleaned = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw, flags=re.IGNORECASE)
        return json.loads(cleaned)
    except Exception as e:
        print(f"Heatmap Error: {e}")
        return {
          "US": {"sentiment": "Bullish", "change": "+0.8%", "status": "active"},
          "Europe": {"sentiment": "Neutral", "change": "-0.1%", "status": "active"},
          "Asia": {"sentiment": "Bullish", "change": "+0.4%", "status": "active"}
        }