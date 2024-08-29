const CITIES = [
    'ירושלים', 'תל אביב-יפו', 'חיפה', 'ראשון לציון', 'פתח תקווה',
    'אשדוד', 'נתניה', 'באר שבע', 'חולון', 'בני ברק',
    'רמת גן', 'אשקלון', 'רחובות', 'בת ים', 'בית שמש',
    'כפר סבא', 'הרצליה', 'חדרה', 'נצרת', 'לוד',
    'רמלה', 'רעננה', 'גבעתיים', 'הוד השרון', 'קריית אתא',
    'קריית גת', 'נהריה', 'קריית מוצקין', 'אילת', 'אום אל-פחם',
    'ראש העין', 'עפולה', 'עכו', 'אלעד', 'כרמיאל',
    'טבריה', 'נס ציונה', 'יבנה', 'מודיעין עילית', 'דימונה',
    'קריית ביאליק', 'קריית ים', 'קריית אונו', 'צפת', 'אור יהודה',
    'נתיבות', 'ביתר עילית', 'שפרעם', 'טירה', 'אופקים',
    'טמרה', 'מגדל העמק', 'טייבה', 'קריית שמונה', 'נשר',
    'קלנסווה', 'כפר קאסם', 'אריאל', 'טירת כרמל', 'אור עקיבא',
    'בית שאן', 'עראבה', 'שדרות', 'ערד', 'כפר יונה',
    'גבעת שמואל', 'כפר כנא', 'ירכא', 'רכסים', 'אבו סנאן',
    'טורעאן', 'באר יעקב', 'בית גן', 'גת', 'דבוריה',
    'זכרון יעקב', 'יפיע', 'ירוחם', 'כסיפה', 'כפר ברא',
    'כפר מנדא', 'כפר קרע', 'להבים', 'מזכרת בתיה', 'מעיליא',
    'מצפה רמון', 'משהד', 'נחף', 'עומר', 'עין מאהל',
    'עספיא', 'ערערה', 'פוריידיס', 'פסוטה', 'פרדס חנה-כרכור',
    'פרדסיה', 'צור הדסה', 'קצרין', 'קריית טבעון', 'ראמה',
    'ריינה', 'רמת ישי', 'שוהם', 'שלומי', 'שעב',
    'תל מונד'
];
// יצירת אובייקט גלובלי לאפליקציה
const weatherApp = {};

document.addEventListener('DOMContentLoaded', () => {
    let debounceTimer;

    function debounce(func, delay) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(func, delay);
    }

    function displayError(message) {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = `<div class="error">${message}</div>`;
    }

    function showLoading() {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> טוען נתוני מזג אוויר...</div>';
    }

    function formatTemperature(temp) {
        return `${Math.round(temp)}°C`;
    }

function autocompleteCity(input) {
    const val = input.toLowerCase();
    return CITIES.filter(city =>
        city.toLowerCase().startsWith(val)
    ).slice(0, 5); // מחזיר עד 5 תוצאות
}

    weatherApp.getUserLocation = function() {
    showLoading(); // Show loading indicator immediately when the button is clicked
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchCityNameByCoords(latitude, longitude);
            },
            (error) => {
                console.error('שגיאה בקבלת מיקום המשתמש:', error);
                displayError('לא ניתן לקבל את המיקום שלך. ברירת מחדל לירושלים.');
                weatherApp.fetchWeatherData('ירושלים');
            }
        );
    } else {
        console.error('גיאולוקציה אינה נתמכת.');
        displayError('גיאולוקציה אינה נתמכת בדפדפן שלך.');
    }
}

    function fetchCityNameByCoords(latitude, longitude) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                const city = data.address.city || data.address.town || data.address.village || 'עיר לא ידועה';
                weatherApp.fetchWeatherData(city);
            })
            .catch(error => {
                console.error('שגיאה בקבלת נתוני העיר:', error);
                displayError('לא ניתן לקבל נתוני העיר. ברירת מחדל לירושלים.');
                weatherApp.fetchWeatherData('ירושלים');
            });
    }

    weatherApp.getWeatherByCity = function() {
    const cityInput = document.getElementById('cityInput');
    const cityName = cityInput.value.trim();
    if (cityName !== '') {
        const suggestions = autocompleteCity(cityName);
        if (suggestions.length > 0) {
            showLoading();
            weatherApp.fetchWeatherData(suggestions[0]);
        } else {
            displayError('עיר לא נמצאה. אנא בדוק את האיות ונסה שוב.');
        }
    } else {
        displayError('אנא הזן שם עיר.');
    }
}

weatherApp.fetchWeatherData = async function(city) {
    showLoading();

    try {
        const response = await fetch('weather_data.json');
        const data = await response.json();
        const cityData = data.cities.find(c => c.city === city);

        if (cityData) {
            console.log(`Data for ${city} was retrieved from the local JSON file.`);
            displayWeatherData(cityData, city);  // שים לב שאנו מעבירים את 'city' כפרמטר שני
        } else {
            throw new Error(`City ${city} not found in local data.`);
        }
    } catch (error) {
        console.error(`Error fetching weather data: ${error.message}`);
        displayError('לא ניתן לקבל את נתוני מזג האוויר. אנא נסה שוב.');
    }
};

    function displayWeatherData(data, cityHebrew) {  // קבל את שם העיר בעברית כפרמטר
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = ''; // Clear previous content

    const currentWeather = data.current;
    const forecast = data.forecast;

    // Display current weather information
    const currentWeatherContainer = document.createElement('article');
    currentWeatherContainer.classList.add('current-weather', 'fade-in');
    currentWeatherContainer.innerHTML = `
        <h2><i class="fas fa-map-marker-alt"></i> מזג האוויר הנוכחי ב${cityHebrew}</h2>
            <div class="weather-details">
                <div class="main-info">
                    <img src="http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png" alt="סמל מזג אוויר" class="weather-icon">
                        <div class="temperature">
                        <span class="temp">${formatTemperature(currentWeather.temperature)}</span>
                        <span class="feels-like">מרגיש כמו: ${formatTemperature(currentWeather.feels_like)}</span>
                    </div>
                </div>
                <p class="description">${translateWeatherDescription(currentWeather.description)}</p>
                <div class="details-grid">
                    <div class="detail-item"><i class="fas fa-tint"></i> לחות: ${currentWeather.humidity}%</div>
                    <div class="detail-item"><i class="fas fa-wind"></i> רוח: ${currentWeather.wind_speed} מ'/ש'</div>
                    <div class="detail-item"><i class="fas fa-compass"></i> כיוון רוח: ${currentWeather.wind_direction}°</div>
                    <div class="detail-item"><i class="fas fa-compress-arrows-alt"></i> לחץ: ${currentWeather.pressure} hPa</div>
                    <div class="detail-item"><i class="fas fa-eye"></i> ראות: ${currentWeather.visibility} מטר</div>
                    <div class="detail-item"><i class="fas fa-cloud"></i> עננות: ${currentWeather.cloudiness}%</div>
                    <div class="detail-item"><i class="fas fa-sun"></i> זריחה: ${currentWeather.sunrise}</div>
                    <div class="detail-item"><i class="fas fa-moon"></i> שקיעה: ${currentWeather.sunset}</div>
                </div>
            </div>
        `;
        weatherInfo.appendChild(currentWeatherContainer);

        // Display forecast
        const weeklyForecastContainer = document.createElement('section');
        weeklyForecastContainer.classList.add('next-5-days', 'fade-in');
        weeklyForecastContainer.innerHTML = `
            <h2><i class="fas fa-calendar-alt"></i> תחזית ל-5 ימים הקרובים</h2>
            <div class="daily-forecast"></div>
        `;
        weatherInfo.appendChild(weeklyForecastContainer);

        const dailyForecastContainer = weeklyForecastContainer.querySelector('.daily-forecast');
        Object.entries(forecast).forEach(([date, forecastData]) => {
            const dailyForecast = document.createElement('div');
            dailyForecast.classList.add('daily-forecast-item');
            dailyForecast.innerHTML = `
                <h3>${formatDate(date)}</h3>
                <img src="http://openweathermap.org/img/wn/${forecastData.icon}@2x.png" alt="סמל מזג אוויר" class="weather-icon">
                <p class="temp">${formatTemperature(forecastData.temp)}</p>
                <p class="feels-like">מרגיש כמו: ${formatTemperature(forecastData.feels_like)}</p>
                <p class="description">${translateWeatherDescription(forecastData.description)}</p>
                <p><i class="fas fa-tint"></i> ${forecastData.humidity}%</p>
                <p><i class="fas fa-wind"></i> ${forecastData.wind_speed} מ'/ש'</p>
                <p><i class="fas fa-compass"></i> ${forecastData.wind_direction}°</p>
                <p><i class="fas fa-compress-arrows-alt"></i> ${forecastData.pressure} hPa</p>
                <p><i class="fas fa-cloud"></i> ${forecastData.cloudiness}%</p>
            `;
            dailyForecastContainer.appendChild(dailyForecast);
        });

        updateLastUpdated();
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('he-IL', { weekday: 'long' });
    }

    function clearWeatherInfo() {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = '';
    }

    function translateWeatherDescription(description) {
        const translations = {
        'clear sky': 'שמיים בהירים',
        'few clouds': 'מעט עננים',
        'scattered clouds': 'עננים מפוזרים',
        'broken clouds': 'עננים שבורים',
        'overcast clouds': 'עננות מלאה',
        'light rain': 'גשם קל',
        'moderate rain': 'גשם מתון',
        'heavy intensity rain': 'גשם כבד',
        'very heavy rain': 'גשם כבד מאוד',
        'extreme rain': 'גשם קיצוני',
        'freezing rain': 'גשם קפוא',
        'light intensity shower rain': 'מקלחת גשם קלה',
        'shower rain': 'מקלחת גשם',
        'heavy intensity shower rain': 'מקלחת גשם כבדה',
        'ragged shower rain': 'מקלחת גשם לא סדירה',
        'thunderstorm': 'סופת רעמים',
        'thunderstorm with light rain': 'סופת רעמים עם גשם קל',
        'thunderstorm with rain': 'סופת רעמים עם גשם',
        'thunderstorm with heavy rain': 'סופת רעמים עם גשם כבד',
        'light thunderstorm': 'סופת רעמים קלה',
        'heavy thunderstorm': 'סופת רעמים כבדה',
        'ragged thunderstorm': 'סופת רעמים לא סדירה',
        'thunderstorm with light drizzle': 'סופת רעמים עם טפטוף קל',
        'thunderstorm with drizzle': 'סופת רעמים עם טפטוף',
        'thunderstorm with heavy drizzle': 'סופת רעמים עם טפטוף כבד',
        'light intensity drizzle': 'טפטוף קל',
        'drizzle': 'טפטוף',
        'heavy intensity drizzle': 'טפטוף כבד',
        'light intensity drizzle rain': 'טפטוף גשם קל',
        'drizzle rain': 'טפטוף גשם',
        'heavy intensity drizzle rain': 'טפטוף גשם כבד',
        'shower rain and drizzle': 'מקלחת גשם וטפטוף',
        'heavy shower rain and drizzle': 'מקלחת גשם כבדה וטפטוף',
        'shower drizzle': 'טפטוף מקלחת',
        'light snow': 'שלג קל',
        'snow': 'שלג',
        'heavy snow': 'שלג כבד',
        'sleet': 'ברד מעורב בגשם',
        'light shower sleet': 'ברד קל מעורב בגשם',
        'shower sleet': 'ברד מעורב בגשם',
        'light rain and snow': 'גשם קל ושלג',
        'rain and snow': 'גשם ושלג',
        'light shower snow': 'מקלחת שלג קלה',
        'shower snow': 'מקלחת שלג',
        'heavy shower snow': 'מקלחת שלג כבדה',
        'mist': 'ערפל קל',
        'smoke': 'עשן',
        'haze': 'אובך',
        'sand/dust whirls': 'מערבולות חול/אבק',
        'fog': 'ערפל',
        'sand': 'חול',
        'dust': 'אבק',
        'volcanic ash': 'אפר וולקני',
        'squalls': 'משבי רוח',
        'tornado': 'טורנדו'
    };
        return translations[description.toLowerCase()] || description;
    }

    function updateLastUpdated() {
        const now = new Date();
        const formattedDate = now.toLocaleString('he-IL');
        const lastUpdatedElement = document.createElement('p');
        lastUpdatedElement.textContent = `עודכן לאחרונה: ${formattedDate}`;
        document.getElementById('weather-info').appendChild(lastUpdatedElement);
    }

    // Event listeners for buttons
    document.getElementById('getLocationBtn').addEventListener('click', weatherApp.getUserLocation);
    document.getElementById('getWeatherByCityBtn').addEventListener('click', weatherApp.getWeatherByCity);

    const cityInput = document.getElementById('cityInput');
    const suggestionsList = document.getElementById('suggestions');

   cityInput.addEventListener('input', function(e) {
    debounce(() => {
        const suggestions = autocompleteCity(e.target.value);
        suggestionsList.innerHTML = '';
        suggestions.forEach(city => {
            const li = document.createElement('li');
            li.textContent = city;
            li.addEventListener('click', function() {
                cityInput.value = city;
                suggestionsList.innerHTML = '';
                weatherApp.getWeatherByCity();
            });
            suggestionsList.appendChild(li);
        });
    }, 300);
});

    // סגור את רשימת ההצעות כאשר לוחצים מחוץ לה
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            suggestionsList.innerHTML = '';
        }
    });

    // Initialize with a default message
    const weatherInfo = document.getElementById('weather-info');
    // You can add any initial message or setup here if needed
});
