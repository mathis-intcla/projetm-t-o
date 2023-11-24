import axios from 'axios';

const cities = {
    'Saint-Étienne': { lat: 45.4339, lon: 4.39 },
    'Lyon': { lat: 45.75, lon: 4.85 },
    'Marseille': { lat: 43.2965, lon: 5.37 },
    'Paris': { lat: 48.8566, lon: 2.3522 }
};

const getWeatherForecast = async (latitude, longitude) => {
    const apiUrl = `https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`;

    try {
        const response = await axios.get(apiUrl);

        if (response.data && response.data.hourly) {
            return response.data.hourly;
        } else {
            console.error('Invalid weather data format:', response.data);
            return null;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
};

const updateWeatherUI = (hourlyWeatherData, city) => {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    const currentHour = new Date().getHours();

    if (hourlyWeatherData && hourlyWeatherData.temperature_2m && hourlyWeatherData.wind_speed_10m && hourlyWeatherData.relative_humidity_2m && hourlyWeatherData.precipitation) {
        const { temperature_2m, wind_speed_10m, relative_humidity_2m, precipitation } = hourlyWeatherData;
        const temperatureAtTargetTime = temperature_2m[currentHour];
        const windSpeedAtTargetTime = wind_speed_10m[currentHour];
        const humidityAtTargetTime = relative_humidity_2m[currentHour];
        const precipitationAtTargetTime = precipitation[currentHour];
        const temperature_2m_max = Math.max(...temperature_2m);
        const temperature_2m_min = Math.min(...temperature_2m);

        const donnees = document.createElement('div');
        donnees.classList.add('weather-info');
        donnees.innerHTML = `
            <p>Temperature à l'heure actuelle : <i class="fas fa-thermometer-half"></i> ${temperatureAtTargetTime} °C.</p>
            <p>Température maximale : <i class="fas fa-temperature-high"></i> ${temperature_2m_max} °C.</p>
            <p>Température minimale : <i class="fas fa-temperature-low"></i> ${temperature_2m_min} °C.</p>
            <p>Vitesse du vent à l'heure actuelle : <i class="fas fa-wind"></i> ${windSpeedAtTargetTime} km/h.</p>
            <p>Humidité à l'heure actuelle : <i class="fas fa-tint"></i> ${humidityAtTargetTime} %.</p>
            <p>Précipitations à l'heure actuelle : <i class="fas fa-cloud-showers-heavy"></i> ${precipitationAtTargetTime} mm.</p>
        `;

        weatherContainer.appendChild(donnees);
    } else {
        console.error('Données météorologiques manquantes ou malformatées:', hourlyWeatherData);
    }

    const cityBackgrounds = {
        'Saint-Étienne': 'url(Images/Saint_Etienne.webp)',
        'Lyon': 'url(Images/Lyon.jpeg)',
        'Marseille': 'url(Images/Marseille.jpg)',
        'Paris': 'url(Images/Paris.webp)'
    };

    const body = document.body;
    body.style.backgroundImage = cityBackgrounds[city] || 'url(Images/image_default.jpg)';
};

const getCoordinates = async (city) => cities[city];

const updateCityName = (city) => {
    const cityNameElement = document.getElementById('cityName');
    if (cityNameElement) {
        cityNameElement.innerText = city;
    }
};

const changeCity = async (city) => {
    try {
        const { lat, lon } = await getCoordinates(city);
        const weatherData = await getWeatherForecast(lat, lon);
        updateWeatherUI(weatherData, city);
        updateCityName(city);
    } catch (error) {
        console.error(error.message);
    }
};

const handleCityButtonClick = (city) => () => changeCity(city);

document.getElementById('btnSaintEtienne').addEventListener('click', handleCityButtonClick('Saint-Étienne'));
document.getElementById('btnLyon').addEventListener('click', handleCityButtonClick('Lyon'));
document.getElementById('btnMarseille').addEventListener('click', handleCityButtonClick('Marseille'));
document.getElementById('btnParis').addEventListener('click', handleCityButtonClick('Paris'));

document.getElementById('btnSaintEtienne').classList.add('round-button', 'gray-button');
document.getElementById('btnLyon').classList.add('round-button', 'gray-button');
document.getElementById('btnMarseille').classList.add('round-button', 'gray-button');
document.getElementById('btnParis').classList.add('round-button', 'gray-button');

const init = () => {
    changeCity('Saint-Étienne');
    setInterval(updateClock, 1000);
};

document.addEventListener('DOMContentLoaded', init);
