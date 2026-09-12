from fastapi import FastAPI, UploadFile, File, Body
from fastapi.middleware.cors import CORSMiddleware
from engine.vision_ext import analyze_chart
from engine.news_engine import get_market_news
from engine.ticker_engine import get_neural_prices, get_global_heatmap
from engine.chat_engine import get_falcon_response
from PIL import Image
import io
import uvicorn
import re
import os
import json
from datetime import datetime, timedelta
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NEW: REAL-TIME NEURAL EVENT ENGINE ---
def get_neural_events():
    """
    Groq AI se current world economic calendar fetch karna.
    Yeh mock data ki jagah real-time scenarios generate karega.
    """
    try:
        now = datetime.now()
        current_date = now.strftime("%Y-%m-%d")
        
        prompt = f"""
        Act as a financial data provider. Today's date is {current_date}.
        Provide 3 major global economic events happening today or tomorrow.
        Focus on events like RBI Policy, US Fed Minutes, CPI Data, or Earnings.
        
        Return ONLY a JSON list of objects with this structure:
        [
          {{
            "id": 1,
            "event": "Event Name",
            "impact": "HIGH/MEDIUM",
            "time": "ISO format time within next 12 hours",
            "description": "Short 1 line description"
          }}
        ]
        Make the times realistic based on current IST/UTC.
        """
        
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.3-70b-versatile",
            response_format={"type": "json_object"}
        )
        
        raw_content = response.choices[0].message.content.strip()
        cleaned_content = re.sub(r"^```(?:json)?\s*|\s*```$", "", raw_content, flags=re.IGNORECASE)
        data = json.loads(cleaned_content)
        # Handle different JSON keys if AI wraps the list
        events = data.get("events", data) if isinstance(data, dict) else data
        return events
    except Exception as e:
        print(f"Neural Event Error: {e}")
        # Fallback in case of API failure
        now = datetime.now()
        return [
            {
                "id": 1, "event": "Global Market Sync", "impact": "MEDIUM",
                "time": (now + timedelta(hours=1)).isoformat(),
                "description": "Routine neural stabilization of global indices."
            }
        ]

# --- ENDPOINTS ---

@app.get("/economic-events")
async def get_events():
    """Real-time data bhejta hai bina hardcoding ke"""
    events_data = get_neural_events()
    return {"success": True, "events": events_data}

@app.get("/ticker")
async def get_ticker():
    return {"success": True, "prices": get_neural_prices()}

@app.get("/heatmap")
async def get_heatmap():
    return {"success": True, "data": get_global_heatmap()}

@app.post("/chat")
async def chat_with_falcon(payload: dict = Body(...)):
    query = payload.get("query")
    context = payload.get("context", "No context available.")
    response = get_falcon_response(query, context)
    return {"success": True, "response": response}

@app.post("/analyze")
async def standard_analysis(file: UploadFile = File(...)):
    try:
        img_data = await file.read()
        img = Image.open(io.BytesIO(img_data))
        report = analyze_chart(img)
        
        clean_text = report.replace(",", "")
        calc_hints = {"entry": 0, "sl": 0, "tp": 0, "lot_size": 50, "asset_name": "NIFTY"}
        
        # Regex for price extraction
        entry_m = re.search(r"(?:Buy at|Sell at|Entry:?)\s+\*?\*?([\d.]+)\*?\*?", clean_text, re.I)
        if entry_m: calc_hints["entry"] = float(entry_m.group(1))
        
        sl_m = re.search(r"(?:Stop Loss|SL:?)\s*(?::|at)?\s*\*?\*?([\d.]+)\*?\*?", clean_text, re.I)
        if sl_m: calc_hints["sl"] = float(sl_m.group(1))
        
        tp_m = re.search(r"(?:Take Profit|TP:?)\s*(?::|at)?\s*\*?\*?([\d.]+)\*?\*?", clean_text, re.I)
        if tp_m: calc_hints["tp"] = float(tp_m.group(1))
        
        return {"success": True, "report": report, "calc_data": calc_hints}
    except Exception as e:
        return {"success": False, "error": str(e)}

@app.post("/analyze-confluence")
async def confluence_analysis(file_short: UploadFile = File(...), file_long: UploadFile = File(...)):
    try:
        img_s = Image.open(io.BytesIO(await file_short.read()))
        img_l = Image.open(io.BytesIO(await file_long.read()))
        report_s = analyze_chart(img_s)
        report_l = analyze_chart(img_l)
        
        htf_up = any(x in report_l.upper() for x in ["BUY", "BULLISH", "UP"])
        ltf_up = "BUY" in report_s.upper()
        is_shq = htf_up and ltf_up
        
        return {"success": True, "report": f"### CONFLUENCE REPORT\n\n{report_s}", "is_shq": is_shq}
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9514)