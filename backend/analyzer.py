import os
import requests
import json
from requests.exceptions import RequestException, ReadTimeout, ConnectionError as RequestsConnectionError
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

def analyze_contract(text: str):
    if not GROQ_API_KEY:
        return {"error": "GROQ_API_KEY is not set on the server"}
    prompt = f"""
You are a legal document analyzer. Return STRICT JSON with ONLY these keys:
{{
  "riskyOrVagueClauses": ["..."],
  "missingImportantClauses": ["..."],
  "confidentialityClause": "...",
  "complianceOrLegalRisks": ["..."],
  "suggestionsForImprovement": ["..."],
  "plainLanguageSummary": "..."
}}
No markdown, no extra text.

Analyze this contract:
{text}
"""

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": "llama-3.3-70b-versatile",
        
        "messages": [
            {"role": "system", "content": "You are a legal expert assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2
    }

    try:
        response = requests.post(
            GROQ_API_URL,
            headers=headers,
            json=payload,
            timeout=(10, 60),
        )
        response.raise_for_status()
        data = response.json()
        content = data["choices"][0]["message"]["content"]
        try:
            sections = json.loads(content)
            return {"sections": sections, "raw": content}
        except Exception:
            return {"raw": content}
    except ReadTimeout:
        return {"error": "Upstream model API timed out. Please try again."}
    except RequestsConnectionError:
        return {"error": "Cannot reach model API (network error)."}
    except RequestException as e:
        # Any other HTTP error from upstream
        try:
            err_json = response.json() if 'response' in locals() else None
        except Exception:
            err_json = None
        return {"error": f"Model API error: {getattr(e, 'response', None) and getattr(e.response, 'status_code', 'unknown')}\n{err_json or str(e)}"}
