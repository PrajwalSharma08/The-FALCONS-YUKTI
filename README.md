# The-FALCONS-YUKTI
Project: TradeVision AI – Universal Market Decoder

Developed for: YuKti Hackathon 2026 @ BBS Group of Engineering & Technology

📌 Project Overview

TradeVision AI is an institutional-grade multimodal financial analysis suite designed to empower retail traders. By bridging the gap between complex technical data and actionable insights, the platform uses state-of-the-art Visual Reasoning to decode market trends from simple chart screenshots. Our mission is to eliminate emotional bias and provide retail investors with the same technological edge used by high-frequency trading firms.

⚠️ The Problem Statement

The retail trading landscape is currently facing a crisis of capital preservation:

Emotional Volatility: Over 90% of retail traders lose money because of "Revenge Trading" and FOMO (Fear of Missing Out).

Analysis Paralysis: Beginners are often overwhelmed by dozens of lagging indicators, failing to understand the core "Price Action."

Execution Lag: Manual analysis of news and technicals is time-consuming, leading to missed opportunities in fast-moving markets like Crypto and Gold.

🛠️ The Technology Stack

We have engineered a modular and high-performance architecture:

AI Core (Visual Reasoning): Integrated with the Llama 4 Scout (17B-16E) multimodal model, which "sees" chart pixels to identify support/resistance levels, trend reversals, and candlestick patterns.

Inference Infrastructure: Powered by Groq’s LPU (Language Processing Units), achieving sub-second analysis latency (approx. 0.8s) for real-time decision support.

Frontend Engine: Built using Streamlit, providing a clean, reactive dashboard for seamless image uploads and data visualization.

Data Integration: Real-time fundamental context is fetched via the Yahoo Finance (yfinance) API, correlating technical setups with global news sentiment.

🌟 Key Features & Innovations

Multimodal Chart Decoding: Zero manual input required. The AI auto-identifies the asset, current price, and trend direction directly from the uploaded image.

Context-Aware Sentiment: The app cross-references technical "BUY/SELL" signals with live economic headlines to warn users of high-impact events (e.g., RBI or Fed decisions).

Pro-Grade Risk Suite: An automated calculator that strictly enforces Reward-to-Risk (RR) ratios. It provides dynamic Advice (e.g., "Good Setup" vs. "High Risk") based on the mathematical distance between Entry and Stop-Loss.

Asset Agnostic: A universal engine that works across Forex, Cryptocurrencies, Commodities (Gold/Oil), and Indian Equity markets (Nifty/Sensex).

🚀 Impact & Future Roadmap

TradeVision AI transforms a raw screenshot into a professional trading plan within seconds.

Future Development (Round 3):

One-Click Execution: Direct API integration with Indian brokers (Zerodha/Angel One) for instant order placement.

Algorithmic Alerts: Background scanning of multiple watchlists with real-time Telegram/WhatsApp notifications.

AI Trading Journal: A self-learning database that tracks a user's trade history to provide personalized feedback and performance metrics.

Team: The Visionaries Prajwal Sharma (Lead), Piyush Patel (Frontend), & BBS College Engineering Squad.
