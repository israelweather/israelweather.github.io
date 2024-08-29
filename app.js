const cityMap = {
    'תל אביב': 'Tel Aviv',
    'ירושלים': 'Jerusalem',
    'חיפה': 'Haifa',
    'אילת': 'Eilat',
    'באר שבע': 'Beer Sheva',
    'נתניה': 'Netanya',
    'אשדוד': 'Ashdod',
    'ראשון לציון': 'Rishon LeZion',
    'פתח תקווה': 'Petah Tikva',
    'חולון': 'Holon',
    'רחובות': 'Rehovot',
    'הרצליה': 'Herzliya',
    'כפר סבא': 'Kfar Saba',
    'רעננה': 'Ra\'anana',
    'בת ים': 'Bat Yam',
    'אשקלון': 'Ashkelon',
    'טבריה': 'Tiberias',
    'נצרת': 'Nazareth',
    'עכו': 'Acre',
    'נהריה': 'Nahariya',
    'לוד': 'Lod',
    'מודיעין': 'Modiin',
    'רמת גן': 'Ramat Gan',
    'גבעתיים': 'Givatayim',
    'רמלה': 'Ramla',
    'עפולה': 'Afula',
    'דימונה': 'Dimona',
    'קרית גת': 'Kiryat Gat',
    'קרית שמונה': 'Kiryat Shmona',
    'שדרות': 'Sderot',
    'ערד': 'Arad',
    'צפת': 'Safed',
    'יבנה': 'Yavne',
    'בית שמש': 'Beit Shemesh'
};

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

    weatherApp.getUserLocation = function() {
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
        const cityInput = document.getElementById('cityInput').value;
        if (cityInput.trim() !== '') {
            showLoading();
            weatherApp.fetchWeatherData(cityInput);
        } else {
            displayError('אנא הזן שם עיר חוקי.');
        }
    }

    weatherApp.fetchWeatherData = async function(city) {
        showLoading();

        const cityEnglish = cityMap[city] || city;

        try {
            const response = await fetch('weather_data.json');
            const data = await response.json();
            const cityData = data.cities.find(c => c.city.toLowerCase() === cityEnglish.toLowerCase());

            if (cityData) {
                console.log(`Data for ${city} was retrieved from the local JSON file.`);
                displayWeatherData(cityData, city);
            } else {
                throw new Error(`City ${city} not found in local data.`);
            }
        } catch (error) {
            console.error(`Error fetching weather data: ${error.message}`);
            displayError('לא ניתן לקבל את נתוני מזג האוויר. אנא נסה שוב.');
        }
    };

    function displayWeatherData(data, city) {
        const weatherInfo = document.getElementById('weather-info');
        weatherInfo.innerHTML = ''; // Clear previous content

        const currentWeather = data.current;
        const forecast = data.forecast;

        // Display current weather information
        const currentWeatherContainer = document.createElement('article');
        currentWeatherContainer.classList.add('current-weather', 'fade-in');
        currentWeatherContainer.innerHTML = `
            <h2><i class="fas fa-map-marker-alt"></i> מזג האוויר הנוכחי ב${data.city_hebrew}</h2>
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
            'shower rain': 'מקלחת גשם',
            'rain': 'גשם',
            'thunderstorm': 'סופת רעמים',
            'snow': 'שלג',
            'mist': 'ערפל'
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

    document.getElementById('cityInput').addEventListener('input', (e) => {
        debounce(() => {
            if (e.target.value.trim() !== '') {
                weatherApp.getWeatherByCity();
            }
        }, 500);
    });

    // Initialize with a default message
    const weatherInfo = document.getElementById('weather-info');
    // You can add any initial message or setup here if needed
});