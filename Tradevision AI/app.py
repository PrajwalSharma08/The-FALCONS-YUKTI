import streamlit as st
from PIL import Image
from engine.vision_ext import analyze_chart
from engine.calculator import calculate_risk
from engine.news_engine import get_market_news

# --- PAGE CONFIGURATION ---
st.set_page_config(page_title="TradeVision AI Pro", layout="wide", page_icon="📈")

# --- CUSTOM CSS FOR HACKATHON LOOK ---
st.markdown("""
    <style>
    .main { background-color: #0e1117; }
    .stMetric { background-color: #161b22; padding: 15px; border-radius: 10px; border: 1px solid #30363d; }
    h1 { color: #58a6ff; }
    </style>
    """, unsafe_allow_html=True)

# --- SIDEBAR: TEAM & SETTINGS ---
st.sidebar.title("🛡️ Trade Control")
st.sidebar.info(f"**Team:** Prajwal, Piyush & Squad")

st.sidebar.subheader("💰 Account Settings")
balance = st.sidebar.number_input("Account Balance ($)", min_value=100, value=1000, step=100)
risk_per = st.sidebar.slider("Risk per Trade (%)", 0.5, 5.0, 2.0)

st.sidebar.subheader("🌍 Market Context")
# Selectbox to make the app "Universal"
asset_choice = st.sidebar.selectbox(
    "Select Asset Category", 
    ["Gold (GC=F)", "EUR/USD", "Bitcoin (BTC-USD)", "Nifty 50 (^NSEI)"]
)
# Extracting the symbol for the News Engine
symbol_map = {"Gold (GC=F)": "GC=F", "EUR/USD": "EURUSD=X", "Bitcoin (BTC-USD)": "BTC-USD", "Nifty 50 (^NSEI)": "^NSEI"}
selected_symbol = symbol_map[asset_choice]

# --- MAIN INTERFACE ---
st.title("📈 TradeVision AI: Pro Suite")
st.markdown("#### *Universal Multimodal Analysis for Retail Traders*")

uploaded_file = st.file_uploader("Upload any Chart Screenshot (Forex, Crypto, Stocks)", type=["png", "jpg", "jpeg"])

if uploaded_file:
    img = Image.open(uploaded_file)
    
    # Layout: 3 Columns for Round 2/3 Presentation
    col1, col2, col3 = st.columns([1, 1.2, 0.8])
    
    with col1:
        st.subheader("🖼️ Chart Preview")
        st.image(img, use_container_width=True)
        
        st.markdown("---")
        st.subheader("📰 Live News Feed")
        with st.spinner("Fetching News..."):
            news = get_market_news(selected_symbol)
            for n in news:
                st.write(f"🔹 {n}")

    with col2:
        st.subheader("🤖 AI Technical Analysis")
        if st.button("🚀 Run Deep Scan"):
            with st.spinner("Llama 3.2 Vision Analyzing Patterns..."):
                try:
                    report = analyze_chart(img)
                    st.markdown(f"**Analysis Result:**\n\n{report}")
                    
                    # Logic to highlight Verdict
                    if "BUY" in report.upper():
                        st.success("🔥 VERDICT: STRONG BULLISH SETUP")
                    elif "SELL" in report.upper():
                        st.error("📉 VERDICT: STRONG BEARISH SETUP")
                except Exception as e:
                    st.error(f"Analysis Error: {e}")

    with col3:
        st.subheader("⚖️ Risk Calculator")
        st.caption("Enter the levels suggested by AI below:")
        
        entry_val = st.number_input("Entry Price", format="%.5f")
        sl_val = st.number_input("Stop Loss (SL)", format="%.5f")
        tp_val = st.number_input("Take Profit (TP)", format="%.5f")
        
        if entry_val > 0 and sl_val > 0:
            risk_results = calculate_risk(balance, risk_per, entry_val, sl_val, tp_val)
            
            st.metric("Risk Amount", risk_results["Risk Amount"])
            st.metric("Reward-to-Risk (RR)", risk_results["RR Ratio"])
            
            if "Good" in risk_results["Advice"]:
                st.success(f"Advice: {risk_results['Advice']}")
            else:
                st.warning(f"Advice: {risk_results['Advice']}")

# --- FOOTER ---
st.markdown("---")
st.caption("TradeVision AI | Developed for YuKti Hackathon 2026 | BBS College of Engineering & Technology")