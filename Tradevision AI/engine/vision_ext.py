import os
import base64
from groq import Groq
from dotenv import load_dotenv
from io import BytesIO

# .env file se API Key load karna
load_dotenv()

# Groq Client initialize karna
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_chart(pil_image):
    """
    Yeh function PIL image leta hai, use Base64 mein convert karta hai 
    aur Groq Llama 3.2 Vision model se analyze karwata hai.
    """
    
    # 1. Image ko Base64 string mein convert karna taaki AI ise samajh sake
    buffered = BytesIO()
    pil_image.save(buffered, format="PNG")
    base64_image = base64.b64encode(buffered.getvalue()).decode('utf-8')

    # 2. AI ko Request bhejna (Expert Prompting)
    try:
        completion = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text", 
                            "text": """
                            Act as a Professional Wall Street Technical Analyst. 
                            Analyze this trading chart and provide:
                            1. **Asset Identification**: Name the pair/stock.
                            2. **Market Structure**: Current trend (Bullish/Bearish).
                            3. **Key Levels**: Identify immediate Support and Resistance.
                            4. **Trading Signal**: BUY, SELL, or WAIT.
                            5. **Execution Plan**: Specific Entry, Stop Loss (SL), and Take Profit (TP) prices.
                            6. **Confidence**: 0-100% score based on patterns.
                            Keep the tone professional and the formatting clean.
                            """
                        },
                        {
                            "type": "image_url",
                            "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                        },
                    ],
                }
            ],
            temperature=0.2, # Accuracy ke liye temperature kam rakha hai
            max_tokens=800,
        )
        return completion.choices[0].message.content
    
    except Exception as e:
        return f"Vision Error: {str(e)}"