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
    'ריינה','מעלות תרשיחא', 'רמת ישי', 'שוהם', 'שלומי', 'שעב',
    'תל מונד'
];
// weatherApp object will be defined here

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
        showLoading();
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
                displayWeatherData(cityData, city);
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
    weatherInfo.innerHTML = '';

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
    temperatureDiv.classList.add('temperature-container');

    const currentTemp = document.createElement('div');
    currentTemp.classList.add('current-temp');
    currentTemp.innerHTML = `<span class="temp-value">${formatTemperature(currentWeather.temperature)}</span>`;
    temperatureDiv.appendChild(currentTemp);

    const minMaxTemp = document.createElement('div');
    minMaxTemp.classList.add('min-max-temp');

    const maxTemp = document.createElement('div');
    maxTemp.classList.add('temp', 'max-temp');
    maxTemp.innerHTML = `<i class="fas fa-arrow-up"></i> ${formatTemperature(currentWeather.temp_max)}`;
    minMaxTemp.appendChild(maxTemp);

    const minTemp = document.createElement('div');
    minTemp.classList.add('temp', 'min-temp');
    minTemp.innerHTML = `<i class="fas fa-arrow-down"></i> ${formatTemperature(currentWeather.temp_min)}`;
    minMaxTemp.appendChild(minTemp);

    temperatureDiv.appendChild(minMaxTemp);

    const feelsLike = document.createElement('div');
    feelsLike.classList.add('feels-like');
    feelsLike.innerHTML = `<i class="fas fa-thermometer-half"></i> מרגיש כמו: ${formatTemperature(currentWeather.feels_like)}`;
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
        { icon: 'fa-moon', text: `שקיעה: ${currentWeather.sunset}` },
        { icon: 'fa-cloud-rain', text: `גשם: ${currentWeather.rain} מ"מ` },
        { icon: 'fa-snowflake', text: `שלג: ${currentWeather.snow} מ"מ` }
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

    // Air quality section
    const airQualityDiv = document.createElement('div');
    airQualityDiv.classList.add('air-quality');

    const airQualityTitle = document.createElement('h3');
    airQualityTitle.innerHTML = '<i class="fas fa-wind"></i> איכות אוויר';
    airQualityDiv.appendChild(airQualityTitle);

    const airQualityIndex = currentWeather.air_pollution.main.aqi;
    const airQualityText = getAirQualityText(airQualityIndex);

    const airQualityDisplay = document.createElement('div');
    airQualityDisplay.classList.add('air-quality-display');
    airQualityDisplay.innerHTML = `
        <div class="air-quality-index">${airQualityIndex}</div>
        <div class="air-quality-text">${airQualityText}</div>
    `;
    airQualityDiv.appendChild(airQualityDisplay);

    // Air quality chart
    const airQualityChartCanvas = document.createElement('canvas');
    airQualityChartCanvas.id = 'airQualityChart';
    airQualityDiv.appendChild(airQualityChartCanvas);

    weatherDetails.appendChild(airQualityDiv);

    // Air pollution forecast
    const airPollutionForecastDiv = document.createElement('div');
    airPollutionForecastDiv.classList.add('air-pollution-forecast');

    const airPollutionForecastTitle = document.createElement('h3');
    airPollutionForecastTitle.innerHTML = '<i class="fas fa-chart-line"></i> תחזית איכות אוויר';
    airPollutionForecastDiv.appendChild(airPollutionForecastTitle);

    const forecastChart = document.createElement('canvas');
    forecastChart.id = 'airQualityForecastChart';
    airPollutionForecastDiv.appendChild(forecastChart);

    weatherDetails.appendChild(airPollutionForecastDiv);

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

    Object.entries(forecast.daily).forEach(([date, forecastData]) => {
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

        const tempRangeLabel = document.createElement('div');
        tempRangeLabel.classList.add('temp-range-label');
        tempRangeLabel.textContent = 'טווח טמפ\'';
        forecastTemps.appendChild(tempRangeLabel);

        const maxTemp = document.createElement('div');
        maxTemp.classList.add('temp', 'max-temp');
        maxTemp.innerHTML = `<i class="fas fa-arrow-up"></i> ${formatTemperature(forecastData.temp_max)}`;
        forecastTemps.appendChild(maxTemp);

        const minTemp = document.createElement('div');
        minTemp.classList.add('temp', 'min-temp');
        minTemp.innerHTML = `<i class="fas fa-arrow-down"></i> ${formatTemperature(forecastData.temp_min)}`;
        forecastTemps.appendChild(minTemp);

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
            { icon: 'fa-cloud', text: `${forecastData.cloudiness}%` },
            { icon: 'fa-cloud-rain', text: `${forecastData.rain} מ"מ` },
            { icon: 'fa-snowflake', text: `${forecastData.snow} מ"מ` }
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

    // Create air quality chart
    createAirQualityChart(currentWeather.air_pollution.components);

    // Create air quality forecast chart
    createAirQualityForecastChart(forecast.air_pollution);
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

    // Close the suggestions list when clicking outside of it
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-box')) {
            suggestionsList.innerHTML = '';
        }
    });

    // Initialize with a default message
    const weatherInfo = document.getElementById('weather-info');
    // You can add any initial message or setup here if needed
});




function createAirQualityChart(components) {
    const ctx = document.getElementById('airQualityChart').getContext('2d');
    const data = Object.entries(components).map(([key, value]) => ({
        pollutant: getPollutantName(key),
        value: value
    }));

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.map(d => d.pollutant),
            datasets: [{
                label: 'ריכוז (μg/m³)',
                data: data.map(d => d.value),
                backgroundColor: data.map(d => getColorForPollutant(d.value, d.pollutant)),
                borderColor: data.map(d => getColorForPollutant(d.value, d.pollutant)),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'ריכוז מזהמים באוויר',
                    font: {
                        size: 16
                    }
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toFixed(2) + ' μg/m³';
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'ריכוז (μg/m³)'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'מזהמים'
                    }
                }
            }
        }
    });
}

function createAirQualityForecastChart(forecast) {
    const ctx = document.getElementById('airQualityForecastChart').getContext('2d');
    const data = forecast.slice(0, 24).map(f => ({
        time: new Date(f.dt * 1000),
        aqi: f.main.aqi
    }));

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.map(d => d.time.toLocaleString('he-IL', { weekday: 'short', hour: 'numeric' })),
            datasets: [{
                label: 'מדד איכות אוויר',
                data: data.map(d => d.aqi),
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                pointBackgroundColor: data.map(d => getColorForAQI(d.aqi)),
                pointBorderColor: data.map(d => getColorForAQI(d.aqi)),
                pointRadius: 5,
                pointHoverRadius: 8
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'תחזית זיהום אוויר ל-5 שעות הקרובות',
                    font: {
                        size: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `מדד איכות אוויר: ${context.parsed.y} (${getAirQualityText(context.parsed.y)})`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 5,
                    title: {
                        display: true,
                        text: 'מדד איכות אוויר'
                    },
                    ticks: {
                        stepSize: 1,
                        callback: function(value, index, values) {
                            return `${value} - ${getAirQualityText(value)}`;
                        }
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'זמן'
                    }
                }
            }
        }
    });
}

function getColorForPollutant(value, pollutant) {
    // יש להגדיר ערכי סף לכל מזהם בהתאם לתקנים הרלוונטיים
    const thresholds = {
        'פחמן חד-חמצני': [4400, 9400, 12400, 15400],
        'חנקן דו-חמצני': [40, 70, 150, 200],
        'אוזון': [50, 100, 168, 208],
        'גופרית דו-חמצנית': [40, 80, 380, 800],
        'חלקיקים עדינים (PM2.5)': [10, 20, 25, 50],
        'חלקיקים גסים (PM10)': [20, 50, 100, 200],
        'אמוניה': [100, 200, 300, 400]
    };

    const colors = ['#4CAF50', '#FFC107', '#FF9800', '#F44336', '#9C27B0'];
    const pollutantThresholds = thresholds[pollutant] || [50, 100, 150, 200];

    for (let i = 0; i < pollutantThresholds.length; i++) {
        if (value <= pollutantThresholds[i]) {
            return colors[i];
        }
    }
    return colors[colors.length - 1];
}

function getColorForAQI(aqi) {
    const colors = ['#4CAF50', '#FFC107', '#FF9800', '#F44336', '#9C27B0'];
    return colors[aqi - 1] || colors[colors.length - 1];
}


function getAirQualityText(aqi) {
    switch (aqi) {
        case 1:
            return "טובה";
        case 2:
            return "סבירה";
        case 3:
            return "בינונית";
        case 4:
            return "ירודה";
        case 5:
            return "גרועה";
        default:
            return "לא ידוע";
    }
}

function getPollutantName(pollutant) {
    switch (pollutant) {
        case 'co':
            return 'פחמן חד-חמצני';
        case 'no':
            return 'חנקן חד-חמצני';
        case 'no2':
            return 'חנקן דו-חמצני';
        case 'o3':
            return 'אוזון';
        case 'so2':
            return 'גופרית דו-חמצנית';
        case 'pm2_5':
            return 'חלקיקים עדינים (PM2.5)';
        case 'pm10':
            return 'חלקיקים גסים (PM10)';
        case 'nh3':
            return 'אמוניה';
        default:
            return pollutant;
    }
}

