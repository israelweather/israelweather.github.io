import os
import json
import requests
import logging
import time
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

API_KEY = '2480e87306578aee0e2b4063641d2414'

CITIES = [
    'ירושלים', 'תל אביב-יפו', 'חיפה', 'ראשון לציון', 'פתח תקווה', 'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'בני ברק',
    'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'בית שמש', 'כפר סבא', 'הרצליה', 'חדרה', 'נצרת', 'לוד',
    'רמלה', 'רעננה', 'גבעתיים', 'הוד השרון', 'קריית אתא', 'קריית גת', 'נהריה', 'קריית מוצקין', 'אילת', 'אום אל-פחם',
    'ראש העין', 'עפולה', 'עכו', 'אלעד', 'כרמיאל', 'טבריה', 'נס ציונה', 'יבנה', 'מודיעין עילית', 'דימונה',
    'קריית ביאליק', 'קריית ים', 'קריית אונו', 'צפת', 'אור יהודה', 'נתיבות', 'ביתר עילית', 'שפרעם', 'טירה', 'אופקים',
    'טמרה', 'מגדל העמק', 'טייבה', 'קריית שמונה', 'נשר', 'קלנסווה', 'כפר קאסם', 'אריאל', 'טירת כרמל', 'אור עקיבא',
    'בית שאן', 'עראבה', 'שדרות', 'ערד', 'כפר יונה', 'גבעת שמואל', 'כפר כנא', 'ירכא', 'רכסים', 'אבו סנאן',
    'טורעאן', 'באר יעקב', 'בית גן', 'גת', 'דבוריה', 'זכרון יעקב', 'יפיע', 'ירוחם', 'כסיפה', 'כפר ברא',
    'כפר מנדא', 'כפר קרע', 'להבים', 'מזכרת בתיה', 'מעיליא', 'מצפה רמון', 'משהד', 'נחף', 'עומר', 'עין מאהל',
    'עספיא', 'ערערה', 'פוריידיס', 'פסוטה', 'פרדס חנה-כרכור', 'פרדסיה', 'צור הדסה', 'קצרין', 'קריית טבעון', 'ראמה',
    'ריינה', 'רמת ישי', 'שוהם', 'שלומי', 'שעב', 'תל מונד'
]

def calculate_feels_like(temperature, humidity, wind_speed):
    if temperature > 27 and humidity > 40:
        return temperature + (0.5 * (humidity - 40))
    elif temperature < 10 and wind_speed > 4.8:
        return 13.12 + 0.6215 * temperature - 11.37 * (wind_speed ** 0.16) + 0.3965 * temperature * (wind_speed ** 0.16)
    else:
        return temperature

def get_weather(city):
    try:
        current_url = f"http://api.openweathermap.org/data/2.5/weather?q={city},IL&appid={API_KEY}&units=metric"
        forecast_url = f"http://api.openweathermap.org/data/2.5/forecast?q={city},IL&appid={API_KEY}&units=metric"

        current_response = requests.get(current_url)
        forecast_response = requests.get(forecast_url)

        if current_response.status_code != 200 or forecast_response.status_code != 200:
            raise Exception(f"API request failed for {city}")

        current_data = current_response.json()
        forecast_data = forecast_response.json()

        # Process 5-day forecast
        daily_forecasts = {}
        for item in forecast_data['list']:
            date = datetime.fromtimestamp(item['dt']).strftime('%Y-%m-%d')
            if date not in daily_forecasts:
                daily_forecasts[date] = {
                    'temp': item['main']['temp'],
                    'feels_like': item['main']['feels_like'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed'],
                    'wind_direction': item['wind']['deg'],
                    'pressure': item['main']['pressure'],
                    'cloudiness': item['clouds']['all']
                }

        # Keep only 5 days
        daily_forecasts = dict(list(daily_forecasts.items())[:5])

        return {
            'city': city,
            'current': {
                'temperature': current_data['main']['temp'],
                'feels_like': current_data['main']['feels_like'],
                'description': current_data['weather'][0]['description'],
                'icon': current_data['weather'][0]['icon'],
                'humidity': current_data['main']['humidity'],
                'wind_speed': current_data['wind']['speed'],
                'wind_direction': current_data['wind']['deg'],
                'pressure': current_data['main']['pressure'],
                'visibility': current_data.get('visibility', 'N/A'),
                'cloudiness': current_data['clouds']['all'],
                'sunrise': (datetime.fromtimestamp(current_data['sys']['sunrise']) + timedelta(hours=3)).strftime('%H:%M'),
                'sunset': (datetime.fromtimestamp(current_data['sys']['sunset']) + timedelta(hours=3)).strftime('%H:%M')
            },
            'forecast': daily_forecasts
        }
    except requests.RequestException as e:
        logging.error(f"Error fetching data for {city}: {e}")
        raise

def update_weather_data():
    weather_data = []
    for city in CITIES:
        try:
            city_weather = get_weather(city)
            weather_data.append(city_weather)
            logging.info(f"Successfully fetched data for {city}")
            time.sleep(1)  # Add a 1-second delay between requests
        except Exception as e:
            logging.error(f"Error fetching data for {city}: {e}")

    with open('weather_data.json', 'w', encoding='utf-8') as f:
        json.dump({
            'last_updated': datetime.now().isoformat(),
            'cities': weather_data
        }, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    update_weather_data()