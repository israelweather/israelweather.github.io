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

 function displayWeatherData(data, cityHebrew) {
    const weatherInfo = document.getElementById('weather-info');
    weatherInfo.innerHTML = ''; // Clear previous content

    const currentWeather = data.current;
    const forecast = data.forecast;

    // Display current weather information
    const currentWeatherContainer = document.createElement('article');
    currentWeatherContainer.classList.add('current-weather', 'fade-in');

    const title = document.createElement('h2');
    const icon = document.createElement('i');
    icon.classList.add('fas', 'fa-map-marker-alt');
    title.appendChild(icon);
    title.appendChild(document.createTextNode(` מזג האוויר הנוכחי ב${cityHebrew}`));
    currentWeatherContainer.appendChild(title);

    const weatherDetails = document.createElement('div');
    weatherDetails.classList.add('weather-details');

    const mainInfo = document.createElement('div');
    mainInfo.classList.add('main-info');

    const weatherIcon = document.createElement('img');
    weatherIcon.src = `http://openweathermap.org/img/wn/${currentWeather.icon}@2x.png`;
    weatherIcon.alt = 'סמל מזג אוויר';
    weatherIcon.classList.add('weather-icon');
    mainInfo.appendChild(weatherIcon);

    const temperatureDiv = document.createElement('div');
    temperatureDiv.classList.add('temperature');

    const temp = document.createElement('span');
    temp.classList.add('temp');
    temp.textContent = formatTemperature(currentWeather.temperature);
    temperatureDiv.appendChild(temp);

    const feelsLike = document.createElement('span');
    feelsLike.classList.add('feels-like');
    feelsLike.textContent = `מרגיש כמו: ${formatTemperature(currentWeather.feels_like)}`;
    temperatureDiv.appendChild(feelsLike);

    mainInfo.appendChild(temperatureDiv);
    weatherDetails.appendChild(mainInfo);

    const description = document.createElement('p');
    description.classList.add('description');
    description.textContent = translateWeatherDescription(currentWeather.description);
    weatherDetails.appendChild(description);

    const detailsGrid = document.createElement('div');
    detailsGrid.classList.add('details-grid');

    const detailItems = [
        { icon: 'fa-tint', text: `לחות: ${currentWeather.humidity}%` },
        { icon: 'fa-wind', text: `רוח: ${currentWeather.wind_speed} מ'/ש'` },
        { icon: 'fa-compass', text: `כיוון רוח: ${currentWeather.wind_direction}°` },
        { icon: 'fa-compress-arrows-alt', text: `לחץ: ${currentWeather.pressure} hPa` },
        { icon: 'fa-eye', text: `ראות: ${currentWeather.visibility} מטר` },
        { icon: 'fa-cloud', text: `עננות: ${currentWeather.cloudiness}%` },
        { icon: 'fa-sun', text: `זריחה: ${currentWeather.sunrise}` },
        { icon: 'fa-moon', text: `שקיעה: ${currentWeather.sunset}` }
    ];

    detailItems.forEach(item => {
        const detailItem = document.createElement('div');
        detailItem.classList.add('detail-item');
        const itemIcon = document.createElement('i');
        itemIcon.classList.add('fas', item.icon);
        detailItem.appendChild(itemIcon);
        detailItem.appendChild(document.createTextNode(` ${item.text}`));
        detailsGrid.appendChild(detailItem);
    });

    weatherDetails.appendChild(detailsGrid);
    currentWeatherContainer.appendChild(weatherDetails);
    weatherInfo.appendChild(currentWeatherContainer);

    // Display forecast
    const weeklyForecastContainer = document.createElement('section');
    weeklyForecastContainer.classList.add('next-5-days', 'fade-in');

    const forecastTitle = document.createElement('h2');
    const calendarIcon = document.createElement('i');
    calendarIcon.classList.add('fas', 'fa-calendar-alt');
    forecastTitle.appendChild(calendarIcon);
    forecastTitle.appendChild(document.createTextNode(' תחזית ל-5 ימים הקרובים'));
    weeklyForecastContainer.appendChild(forecastTitle);

    const dailyForecastContainer = document.createElement('div');
    dailyForecastContainer.classList.add('daily-forecast');

    Object.entries(forecast).forEach(([date, forecastData]) => {
        const dailyForecast = document.createElement('div');
        dailyForecast.classList.add('daily-forecast-item');

        const dateHeading = document.createElement('h3');
        dateHeading.textContent = formatDate(date);
        dailyForecast.appendChild(dateHeading);

        const forecastIcon = document.createElement('img');
        forecastIcon.src = `http://openweathermap.org/img/wn/${forecastData.icon}@2x.png`;
        forecastIcon.alt = 'סמל מזג אוויר';
        forecastIcon.classList.add('weather-icon');
        dailyForecast.appendChild(forecastIcon);

        const forecastTemps = document.createElement('div');
        forecastTemps.classList.add('forecast-temps');

        const forecastTemp = document.createElement('span');
        forecastTemp.classList.add('temp');
        forecastTemp.textContent = formatTemperature(forecastData.temp);
        forecastTemps.appendChild(forecastTemp);

        const forecastFeelsLike = document.createElement('span');
        forecastFeelsLike.classList.add('feels-like');
        forecastFeelsLike.textContent = `מרגיש כמו: ${formatTemperature(forecastData.feels_like)}`;
        forecastTemps.appendChild(forecastFeelsLike);

        dailyForecast.appendChild(forecastTemps);

        const forecastDescription = document.createElement('p');
        forecastDescription.classList.add('description');
        forecastDescription.textContent = translateWeatherDescription(forecastData.description);
        dailyForecast.appendChild(forecastDescription);

        const forecastDetails = document.createElement('div');
        forecastDetails.classList.add('forecast-details');

        const forecastDetailItems = [
            { icon: 'fa-tint', text: `${forecastData.humidity}%` },
            { icon: 'fa-wind', text: `${forecastData.wind_speed} מ'/ש'` },
            { icon: 'fa-compass', text: `${forecastData.wind_direction}°` },
            { icon: 'fa-compress-arrows-alt', text: `${forecastData.pressure} hPa` },
            { icon: 'fa-cloud', text: `${forecastData.cloudiness}%` }
        ];

        forecastDetailItems.forEach(item => {
            const detailSpan = document.createElement('span');
            const itemIcon = document.createElement('i');
            itemIcon.classList.add('fas', item.icon);
            detailSpan.appendChild(itemIcon);
            detailSpan.appendChild(document.createTextNode(` ${item.text}`));
            forecastDetails.appendChild(detailSpan);
        });

        dailyForecast.appendChild(forecastDetails);
        dailyForecastContainer.appendChild(dailyForecast);
    });

    weeklyForecastContainer.appendChild(dailyForecastContainer);
    weatherInfo.appendChild(weeklyForecastContainer);
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
