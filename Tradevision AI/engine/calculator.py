# engine/calculator.py
def calculate_risk(balance, risk_percent, entry, sl, tp):
    # Risk calculation logic
    risk_amount = balance * (risk_percent / 100)
    stop_loss_pips = abs(entry - sl)
    
    # Simple Reward-to-Risk Ratio
    reward_pips = abs(tp - entry)
    rr_ratio = round(reward_pips / stop_loss_pips, 2) if stop_loss_pips > 0 else 0
    
    return {
        "Risk Amount": f"${risk_amount:.2f}",
        "RR Ratio": f"1:{rr_ratio}",
        "Advice": "Good Setup" if rr_ratio >= 2 else "High Risk Setup"
    }