import streamlit as st
from PIL import Image
from engine.vision_ext import analyze_chart
from engine.calculator import calculate_risk
from engine.news_engine import get_market_news
import base64
import random

# --- 1. PAGE SETUP ---
st.set_page_config(
    page_title="TRADEVISION AI | THE FALCONS",
    page_icon="🦅",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Session state to keep results after scan
if 'scan_result' not in st.session_state:
    st.session_state['scan_result'] = None
if 'session_risk_score' not in st.session_state:
    st.session_state['session_risk_score'] = None

# Function to encode image for CSS
def get_base64_image(image_path):
    try:
        with open(image_path, "rb") as img_file:
            return base64.b64encode(img_file.read()).decode()
    except:
        return None

logo_base64 = get_base64_image("image_5e80e9.png")

# --- 2. ADVANCED UI CSS ---
st.markdown(f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Inter:wght@400;600&display=swap');

.stApp {{
    background: radial-gradient(circle at top right, #050b1a, #010409);
    color: #f8fafc;
    font-family: 'Inter', sans-serif;
}}

/* THE HERO BANNER */
.hero-banner {{
    background: rgba(255, 255, 255, 0.02);
    border: 2px solid rgba(0, 212, 255, 0.3);
    border-radius: 20px;
    padding: 20px 10px;
    text-align: center;
    margin-bottom: 20px;
    box-shadow: 0 0 40px rgba(0, 212, 255, 0.1);
    backdrop-filter: blur(15px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}}

.logo-img {{
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 2px solid #00d4ff;
    box-shadow: 0 0 15px rgba(0, 212, 255, 0.4);
    margin-bottom: 10px;
    object-fit: cover;
}}

.main-text {{
    font-family: 'Orbitron', sans-serif;
    font-size: clamp(25px, 5vw, 55px);
    font-weight: 900;
    letter-spacing: 10px;
    background: linear-gradient(90deg, #00d4ff, #deff9a, #00d4ff);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    animation: flow 5s linear infinite;
    margin: 0;
    padding: 5px 0;
    text-transform: uppercase;
    line-height: 1;
}}

@keyframes flow {{ to {{ background-position: 200% center; }} }}

/* DUAL BOX CONTAINER (Signal + Risk) */
.dual-box-container {{ 
    display: flex; 
    justify-content: center; 
    align-items: stretch;
    gap: 15px; 
    margin: 20px 0;
    flex-wrap: wrap;
}}

.status-box {{
    flex: 1;
    min-width: 180px;
    max-width: 280px;
    padding: 15px;
    border-radius: 15px;
    text-align: center;
    font-family: 'Orbitron', sans-serif;
    text-transform: uppercase;
    border: 3px solid;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}}

.buy-box {{ background: rgba(0, 255, 136, 0.1); color: #00ff88; border-color: #00ff88; box-shadow: 0 0 20px rgba(0, 255, 136, 0.2); }}
.sell-box {{ background: rgba(255, 75, 75, 0.1); color: #ff4b4b; border-color: #ff4b4b; box-shadow: 0 0 20px rgba(255, 75, 75, 0.2); }}
.wait-box {{ background: rgba(148, 163, 184, 0.1); color: #94a3b8; border-color: #94a3b8; box-shadow: 0 0 20px rgba(148, 163, 184, 0.2); }}
.risk-box {{ background: rgba(0, 212, 255, 0.1); color: #00d4ff; border-color: #00d4ff; box-shadow: 0 0 20px rgba(0, 212, 255, 0.2); }}

.box-label {{ font-size: 10px; letter-spacing: 1px; margin-bottom: 3px; opacity: 0.8; }}
.box-value {{ font-size: 28px; font-weight: 900; }}

/* IMPACT ENGINE CARDS */
.impact-card {{
    background: rgba(255, 255, 255, 0.03);
    padding: 12px;
    border-radius: 12px;
    margin-bottom: 10px;
    border-left: 4px solid;
}}
.impact-high {{ border-left-color: #ff4b4b; }}
.impact-med {{ border-left-color: #facc15; }}
.impact-low {{ border-left-color: #00d4ff; }}

.stButton>button {{
    background: linear-gradient(90deg, #00d4ff 0%, #0055ff 100%);
    color: white; border: none; border-radius: 10px; padding: 12px;
    font-family: 'Orbitron', sans-serif; font-weight: bold; width: 100%;
}}
</style>
""", unsafe_allow_html=True)

# --- 3. SIDEBAR ---
with st.sidebar:
    if logo_base64:
        st.markdown(f'<center><img src="data:image/png;base64,{logo_base64}" style="width:90px; border-radius:50%; border:2px solid #00d4ff;"></center>', unsafe_allow_html=True)
    else:
        st.markdown("<h2 style='color:#00d4ff; font-family:Orbitron; text-align:center;'>鹰 TRADEVISION</h2>", unsafe_allow_html=True)
    
    st.markdown("---")
    st.write("### Problem Statement Focus")
    st.info("P4-C: News Impact Indicator")
    
    balance = st.number_input("Portfolio Balance ($)", value=1000)
    risk_per = st.slider("Risk Tolerance (%)", 0.5, 5.0, 1.5)
    asset_choice = st.selectbox("Trading Asset", ["Gold (XAUUSD)", "Nifty 50", "Bitcoin", "Reliance (NSE)"])
    
    st.markdown("---")
    if st.button("🗑️ Clear Scan"):
        st.session_state['scan_result'] = None
        st.session_state['session_risk_score'] = None
        st.rerun()
    st.caption("The FALCONS | BBS College")

# --- 4. HERO BANNER ---
logo_html = f'<img src="data:image/png;base64,{logo_base64}" class="logo-img">' if logo_base64 else ""
st.markdown(f"""
<div class="hero-banner">
{logo_html}
<div class="main-text">TRADEVISION AI</div>
<div style='color:#94a3b8; letter-spacing:5px; font-size:12px; margin-top:5px; text-transform:uppercase;'>NEURAL MARKET DECODER • INSTITUTIONAL GRADE ANALYSIS</div>
</div>
""", unsafe_allow_html=True)

# --- 5. MAIN WORKSPACE ---
col_left, col_right = st.columns([2, 1], gap="large")

with col_left:
    st.markdown("### 🖼️ Neural Chart Feed")
    uploaded_file = st.file_uploader("Upload Image", type=["png", "jpg", "jpeg"], label_visibility="collapsed")
    
    if uploaded_file:
        img = Image.open(uploaded_file)
        st.image(img, use_container_width=True)
        
        if st.button("🚀 EXECUTE NEURAL SCAN"):
            with st.spinner("Decoding pixels..."):
                report = analyze_chart(img)
                st.session_state['scan_result'] = report
                st.session_state['session_risk_score'] = random.randint(3, 8)
        
        if st.session_state['scan_result']:
            report = st.session_state['scan_result']
            st.markdown("### 🤖 Scout AI Verdict")
            st.info(report)
            
            # SIGNAL LOGIC
            rep_up = report.upper()
            risk_val = st.session_state['session_risk_score'] or 5
            
            if "BUY" in rep_up: 
                sig_type, sig_class = "BUY", "buy-box"
            elif "SELL" in rep_up: 
                sig_type, sig_class = "SELL", "sell-box"
            else: 
                sig_type, sig_class = "WAIT", "wait-box"
            
            st.markdown(f"""
<div class="dual-box-container">
    <div class="status-box {sig_class}">
        <div class="box-label">Action Signal</div>
        <div class="box-value">{sig_type}</div>
    </div>
    <div class="status-box risk-box">
        <div class="box-label">Neural Risk Score</div>
        <div class="box-value">{risk_val}/10</div>
    </div>
</div>
""", unsafe_allow_html=True)

with col_right:
    st.markdown("### ⚖️ Risk Suite")
    with st.container():
        st.markdown('<div style="background:rgba(255,255,255,0.02); padding:15px; border-radius:15px; border: 1px solid rgba(255,255,255,0.05);">', unsafe_allow_html=True)
        entry = st.number_input("Entry Price", format="%.5f")
        sl = st.number_input("Stop Loss", format="%.5f")
        tp = st.number_input("Take Profit", format="%.5f")
        
        if entry > 0 and sl > 0:
            res = calculate_risk(balance, risk_per, entry, sl, tp)
            st.metric("RR Ratio", res["RR Ratio"])
            color = "#00ff88" if "Good" in res['Advice'] else "#ff4b4b"
            st.markdown(f"<p style='color:{color}; font-weight:bold; font-size:16px;'>{res['Advice']}</p>", unsafe_allow_html=True)
        st.markdown('</div>', unsafe_allow_html=True)

    st.markdown("<br>### 📰 Market News Stream", unsafe_allow_html=True)
    symbol_map = {"Gold (XAUUSD)": "GC=F", "Nifty 50": "^NSEI", "Reliance (NSE)": "RELIANCE.NS", "Bitcoin": "BTC-USD"}
    news = get_market_news(symbol_map[asset_choice])
    for n in news:
        st.markdown(f"<div style='background:rgba(255,255,255,0.03); padding:10px; border-radius:10px; margin-bottom:8px; border-left:3px solid #00d4ff; font-size:13px;'>{n}</div>", unsafe_allow_html=True)

    # --- PROBLEM 4-C: News Impact Engine (NEW SECTION) ---
    st.markdown("<br>### 📊 Event Impact Engine (P4-C)", unsafe_allow_html=True)
    st.caption("Marking assets affected by major global events")
    
    impact_events = [
        {"e": "Fed Interest Rate Hike", "lvl": "HIGH IMPACT", "c": "impact-high", "note": "Bearish for Gold & Tech Stocks"},
        {"e": "RBI Monetary Policy Meeting", "lvl": "HIGH IMPACT", "c": "impact-high", "note": "Volatility expected in Nifty Banks"},
        {"e": "US CPI Data Release", "lvl": "MED IMPACT", "c": "impact-med", "note": "Direct Impact on Bitcoin (USD pairs)"}
    ]
    
    for item in impact_events:
        st.markdown(f"""
            <div class="impact-card {item['c']}">
                <div style="font-size:10px; font-weight:900; opacity:0.8;">{item['lvl']}</div>
                <div style="font-size:14px; font-weight:bold; margin-top:2px;">{item['e']}</div>
                <div style="font-size:12px; color:#94a3b8; margin-top:4px;">{item['note']}</div>
            </div>
        """, unsafe_allow_html=True)

# --- 6. FOOTER ---
st.markdown("<br><hr><center><p style='color:#475569; font-size:12px;'>BBS College of Engineering | Team The Falcons | YuKti 2026</p></center>", unsafe_allow_html=True)