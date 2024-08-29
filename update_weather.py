import os
import json
import requests
import logging
import time
from datetime import datetime

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

API_KEY = os.environ['OPENWEATHERMAP_API_KEY']
CITY_MAP = {
    'תל אביב-יפו': 'Tel Aviv',
    'ירושלים': 'Jerusalem',
    'חיפה': 'Haifa',
    'ראשון לציון': 'Rishon LeZion',
    'פתח תקווה': 'Petah Tikva',
    'אשדוד': 'Ashdod',
    'נתניה': 'Netanya',
    'באר שבע': 'Beer Sheva',
    'חולון': 'Holon',
    'בני ברק': 'Bnei Brak',
    'רמת גן': 'Ramat Gan',
    'אשקלון': 'Ashkelon',
    'רחובות': 'Rehovot',
    'בת ים': 'Bat Yam',
    'בית שמש': 'Beit Shemesh',
    'כפר סבא': 'Kfar Saba',
    'הרצליה': 'Herzliya',
    'חדרה': 'Hadera',
    'מודיעין-מכבים-רעות': 'Modiin',
    'נצרת': 'Nazareth',
    'לוד': 'Lod',
    'רמלה': 'Ramla',
    'רעננה': 'Raanana',
    'גבעתיים': 'Givatayim',
    'הוד השרון': 'Hod HaSharon',
    'קריית אתא': 'Kiryat Ata',
    'קריית גת': 'Kiryat Gat',
    'נהריה': 'Nahariya',
    'קריית מוצקין': 'Kiryat Motzkin',
    'אילת': 'Eilat',
    'אום אל-פחם': 'Umm al-Fahm',
    'ראש העין': 'Rosh HaAyin',
    'עפולה': 'Afula',
    'עכו': 'Acre',
    'אלעד': 'Elad',
    'כרמיאל': 'Karmiel',
    'טבריה': 'Tiberias',
    'נוף הגליל': 'Nof HaGalil',
    'נס ציונה': 'Nes Ziona',
    'יבנה': 'Yavne',
    'רהט': 'Rahat',
    'מודיעין עילית': 'Modiin Illit',
    'דימונה': 'Dimona',
    'קריית ביאליק': 'Kiryat Bialik',
    'קריית ים': 'Kiryat Yam',
    'מעלה אדומים': 'Maale Adumim',
    'קריית אונו': 'Kiryat Ono',
    'צפת': 'Safed',
    'אור יהודה': 'Or Yehuda',
    'נתיבות': 'Netivot',
    'ביתר עילית': 'Beitar Illit',
    'שפרעם': 'Shfaram',
    'טירה': 'Tira',
    'אופקים': 'Ofakim',
    'יהוד-מונוסון': 'Yehud',
    'באקה אל-גרביה': 'Baqa al-Gharbiyye',
    'טמרה': 'Tamra',
    'סחנין': 'Sakhnin',
    'מגדל העמק': 'Migdal HaEmek',
    'טייבה': 'Tayibe',
    'קריית שמונה': 'Kiryat Shmona',
    'יקנעם עילית': 'Yokneam',
    'נשר': 'Nesher',
    'קלנסווה': 'Qalansawe',
    'כפר קאסם': 'Kafr Qasim',
    'מעלות-תרשיחא': 'Maalot-Tarshiha',
    'אריאל': 'Ariel',
    'טירת כרמל': 'Tirat Carmel',
    'אור עקיבא': 'Or Akiva',
    'בית שאן': 'Beit Shean',
    'עראבה': 'Arraba',
    'דאלית אל-כרמל': 'Daliyat al-Karmel',
    'שדרות': 'Sderot',
    'מגאר': 'Maghar',
    'ערד': 'Arad',
    'כפר יונה': 'Kfar Yona',
    'קריית מלאכי': 'Kiryat Malakhi',
    'גבעת שמואל': 'Givat Shmuel',
    'כפר כנא': 'Kafr Kanna',
    'ירכא': 'Yarka',
    'רכסים': 'Rekhasim',
    'קריית עקרון': 'Kiryat Ekron',
    'אבו סנאן': 'Abu Sinan',
    'טורעאן': 'Turan',
    'אכסאל': 'Iksal',
    'אעבלין': 'Ibillin',
    'באר יעקב': 'Beer Yaakov',
    'בית גן': 'Beit Jann',
    'בנימינה-גבעת עדה': 'Binyamina',
    'גדיידה-מכר': 'Jadeidi-Makr',
    'גלגוליה': 'Jaljulia',
    'גסר א-זרקא': 'Jisr az-Zarqa',
    'גת': 'Jatt',
    'דבוריה': 'Daburiyya',
    'דייר אל-אסד': 'Deir al-Asad',
    'דייר חנא': 'Deir Hanna',
    'זכרון יעקב': 'Zikhron Yaakov',
    'זמר': 'Zemer',
    'טובא-זנגריה': 'Tuba-Zangariyye',
    'יפיע': 'Yafia',
    'ירוחם': 'Yeruham',
    'כאבול': 'Kabul',
    'כאוכב אבו אל-היגא': 'Kaokab Abu al-Hija',
    'כסיפה': 'Kuseife',
    'כפר ברא': 'Kafr Bara',
    'כפר מנדא': 'Kafr Manda',
    'כפר קרע': 'Kafr Qara',
    'להבים': 'Lehavim',
    'מבשרת ציון': 'Mevaseret Zion',
    'מגד אל-כרום': 'Majd al-Krum',
    'מגדל שמס': 'Majdal Shams',
    'מזכרת בתיה': 'Mazkeret Batya',
    'מעיליא': 'Miilya',
    'מצפה רמון': 'Mitzpe Ramon',
    'משהד': 'Mashhad',
    'נחף': 'Nahef',
    'סאגור': 'Sajur',
    'עומר': 'Omer',
    'עיילבון': 'Eilabun',
    'עילוט': 'Ilut',
    'עין מאהל': 'Ein Mahil',
    'עספיא': 'Isfiya',
    'ערערה': 'Arara',
    'ערערה-בנגב': 'Ararat an-Naqab',
    'פוריידיס': 'Fureidis',
    'פסוטה': 'Fassuta',
    'פקיעין (בוקייעה)': 'Pekiin',
    'פרדס חנה-כרכור': 'Pardes Hanna-Karkur',
    'פרדסיה': 'Pardesiya',
    'צור הדסה': 'Tzur Hadassah',
    'קדימה-צורן': 'Kadima-Zoran',
    'קצרין': 'Katzrin',
    'קריית ארבע': 'Kiryat Arba',
    'קריית טבעון': 'Kiryat Tivon',
    'קריית יערים': 'Kiryat Yearim',
    'קרני שומרון': 'Karnei Shomron',
    'ראמה': 'Rameh',
    'ריינה': 'Reineh',
    'רמת ישי': 'Ramat Yishai',
    'שבלי - אום אל-גנם': 'Shibli-Umm al-Ghanam',
    'שגב-שלום': 'Shaqib al-Salam',
    'שוהם': 'Shoham',
    'שלומי': 'Shlomi',
    'שעב': 'Shaab',
    'תל מונד': 'Tel Mond',
    'תל שבע': 'Tel as-Sabi'
}

CITIES = list(CITY_MAP.values())

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