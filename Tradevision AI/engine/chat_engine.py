import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def get_falcon_response(user_query, report_context):
    """
    Falcon AI Mentor Logic: Report ke context ke basis par user ke sawalon ka jawab dena.
    """
    try:
        system_prompt = f"""
        You are 'Falcon AI', a professional institutional trading mentor. 
        A user has just scanned a chart and received this analysis report:
        ---
        {report_context}
        ---
        Your job is to answer the user's questions about this specific trade setup. 
        - Use professional, concise, and encouraging language.
        - Explain the 'Why' behind the Stop Loss and Take Profit levels mentioned in the report.
        - If asked about news impact (like RBI or Fed), explain how it could invalidate the technical levels.
        - Speak like a senior fund manager mentor.
        """
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_query}
            ],
            model="qwen/qwen3.8-27b",
            temperature=0.5,
            max_tokens=400
        )
        
        return response.choices[0].message.content
    except Exception as e:
        return f"Neural Mentor Offline: {str(e)}"