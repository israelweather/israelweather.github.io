import os
import json
import requests
import logging
import time
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

API_KEY = os.environ['OPENWEATHERMAP_API_KEY']

CITIES = [
    'ירושלים', 'תל אביב-יפו'
    # ... (rest of the cities)
]

def get_air_pollution(lat, lon):
    try:
        current_url = f"http://api.openweathermap.org/data/2.5/air_pollution?lat={lat}&lon={lon}&appid={API_KEY}"
        forecast_url = f"http://api.openweathermap.org/data/2.5/air_pollution/forecast?lat={lat}&lon={lon}&appid={API_KEY}"

        current_response = requests.get(current_url)
        forecast_response = requests.get(forecast_url)

        if current_response.status_code != 200 or forecast_response.status_code != 200:
            raise Exception(f"API request failed for air pollution data")

        current_data = current_response.json()
        forecast_data = forecast_response.json()

        return {
            'current': current_data['list'][0],
            'forecast': forecast_data['list'][:5]  # Get forecast for next 5 time steps
        }
    except requests.RequestException as e:
        logging.error(f"Error fetching air pollution data: {e}")
        raise

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
                    'temp_min': item['main']['temp_min'],
                    'temp_max': item['main']['temp_max'],
                    'feels_like': item['main']['feels_like'],
                    'description': item['weather'][0]['description'],
                    'icon': item['weather'][0]['icon'],
                    'humidity': item['main']['humidity'],
                    'wind_speed': item['wind']['speed'],
                    'wind_direction': item['wind']['deg'],
                    'pressure': item['main']['pressure'],
                    'cloudiness': item['clouds']['all'],
                    'rain': item.get('rain', {}).get('3h', 0),
                    'snow': item.get('snow', {}).get('3h', 0)
                }
            else:
                daily_forecasts[date]['temp_min'] = min(daily_forecasts[date]['temp_min'], item['main']['temp_min'])
                daily_forecasts[date]['temp_max'] = max(daily_forecasts[date]['temp_max'], item['main']['temp_max'])

        # Keep only 5 days
        daily_forecasts = dict(list(daily_forecasts.items())[:5])

        # Get coordinates for the city
        lat, lon = current_data['coord']['lat'], current_data['coord']['lon']

        # Get air pollution data
        air_pollution = get_air_pollution(lat, lon)

        return {
            'city': city,
            'current': {
                'temperature': current_data['main']['temp'],
                'feels_like': current_data['main']['feels_like'],
                'temp_min': current_data['main']['temp_min'],
                'temp_max': current_data['main']['temp_max'],
                'description': current_data['weather'][0]['description'],
                'icon': current_data['weather'][0]['icon'],
                'humidity': current_data['main']['humidity'],
                'wind_speed': current_data['wind']['speed'],
                'wind_direction': current_data['wind']['deg'],
                'pressure': current_data['main']['pressure'],
                'visibility': current_data.get('visibility', 'N/A'),
                'cloudiness': current_data['clouds']['all'],
                'sunrise': datetime.fromtimestamp(current_data['sys']['sunrise']).strftime('%H:%M'),
                'sunset': datetime.fromtimestamp(current_data['sys']['sunset']).strftime('%H:%M'),
                'rain': current_data.get('rain', {}).get('1h', 0),
                'snow': current_data.get('snow', {}).get('1h', 0),
                'air_pollution': air_pollution['current']
            },
            'forecast': {
                'daily': daily_forecasts,
                'air_pollution': air_pollution['forecast']
            }
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
