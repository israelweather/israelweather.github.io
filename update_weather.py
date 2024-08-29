import os
import json
import requests
import logging
import time
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

API_KEY = '2480e87306578aee0e2b4063641d2414'
CITIES = [
    'Tel Aviv', 'Jerusalem', 'Haifa', 'Eilat', 'Beer Sheva', 'Netanya',
    'Ashdod', 'Rishon LeZion', 'Petah Tikva', 'Holon', 'Rehovot',
    'Herzliya', 'Kfar Saba', 'Ra\'anana', 'Bat Yam', 'Ashkelon',
    'Tiberias', 'Nazareth', 'Acre', 'Nahariya', 'Lod', 'Modiin',
    'Ramat Gan', 'Givatayim', 'Ramla', 'Afula', 'Dimona', 'Kiryat Gat',
    'Kiryat Shmona', 'Sderot', 'Arad', 'Safed', 'Yavne', 'Beit Shemesh'
]

CITY_MAP = {
    'Tel Aviv': 'תל אביב',
    'Jerusalem': 'ירושלים',
    'Haifa': 'חיפה',
    'Eilat': 'אילת',
    'Beer Sheva': 'באר שבע',
    'Netanya': 'נתניה',
    'Ashdod': 'אשדוד',
    'Rishon LeZion': 'ראשון לציון',
    'Petah Tikva': 'פתח תקווה',
    'Holon': 'חולון',
    'Rehovot': 'רחובות',
    'Herzliya': 'הרצליה',
    'Kfar Saba': 'כפר סבא',
    'Ra\'anana': 'רעננה',
    'Bat Yam': 'בת ים',
    'Ashkelon': 'אשקלון',
    'Tiberias': 'טבריה',
    'Nazareth': 'נצרת',
    'Acre': 'עכו',
    'Nahariya': 'נהריה',
    'Lod': 'לוד',
    'Modiin': 'מודיעין',
    'Ramat Gan': 'רמת גן',
    'Givatayim': 'גבעתיים',
    'Ramla': 'רמלה',
    'Afula': 'עפולה',
    'Dimona': 'דימונה',
    'Kiryat Gat': 'קרית גת',
    'Kiryat Shmona': 'קרית שמונה',
    'Sderot': 'שדרות',
    'Arad': 'ערד',
    'Safed': 'צפת',
    'Yavne': 'יבנה',
    'Beit Shemesh': 'בית שמש'
}

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
            'city_hebrew': CITY_MAP.get(city, city),
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
                'sunrise': datetime.fromtimestamp(current_data['sys']['sunrise']).strftime('%H:%M'),
                'sunset': datetime.fromtimestamp(current_data['sys']['sunset']).strftime('%H:%M')
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