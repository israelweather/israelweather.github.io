import requests
import json
from datetime import datetime
import os

API_KEY = os.environ['GOOGLE_AI_API_KEY']
API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent'

def get_ai_advice():
    today = datetime.now().strftime("%d/%m/%Y")
    day_of_week = datetime.now().strftime("%A")

    prompt = f"""בתור מדריך תיירות מקומי בישראל, תן המלצה לפעילות יומית מעניינת עבור היום, {day_of_week} {today}.
        ההמלצה צריכה להתחשב בעונה הנוכחית ובאופי היום (יום חול/סוף שבוע).
        כלול רעיון ספציפי לפעילות, בין אם זו פעילות חוץ או פנים.
        התייחס לאזור גיאוגרפי מסוים בישראל (למשל: תל אביב, ירושלים, הגליל, הנגב וכו').
        אנא תן תשובה קצרה של 2-3 משפטים, הכוללת את שם הפעילות, המיקום, ומדוע היא מתאימה ליום זה. ועוד שורה של מה צופה לנו המשך השבוע"""

    headers = {
        'Content-Type': 'application/json'
    }

    data = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.9,
            "topK": 1,
            "topP": 1,
            "maxOutputTokens": 2048,
            "stopSequences": []
        },
        "safetySettings": [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_MEDIUM_AND_ABOVE"
            }
        ]
    }

    response = requests.post(f"{API_URL}?key={API_KEY}", headers=headers, json=data)

    if response.status_code == 200:
        return response.json()['candidates'][0]['content']['parts'][0]['text']
    else:
        print(f"Error status code: {response.status_code}")
        print(f"Error message: {response.text}")
        return f"לא ניתן לקבל המלצה כרגע. קוד שגיאה: {response.status_code}"

def update_daily_advice():
    ai_advice = get_ai_advice()

    output_data = {
        "תאריך": datetime.now().strftime("%Y-%m-%d"),
        "יום בשבוע": datetime.now().strftime("%A"),
        "המלצת ה-AI להיום": ai_advice
    }

    with open('daily_advice.json', 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=4)

if __name__ == "__main__":
    update_daily_advice()