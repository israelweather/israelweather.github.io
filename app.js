const cityMap = {
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

    function autocompleteCity(input) {
        const val = input.toLowerCase();
        return Object.keys(cityMap).filter(city =>
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
