// index.js
import axios from 'axios';

// Define the coordinates of various cities
const cities = {
    'Saint-Étienne': { lat: 45.4339, lon: 4.39 },
    'Lyon': { lat: 45.75, lon: 4.85 },
    'Marseille': { lat: 43.2965, lon: 5.37 },
    'Paris': { lat: 48.8566, lon: 2.3522 },
    'Bourg-en-Bresse': { lat: 46.2058, lon: 5.2258 },
    'Commelle-Vernay': { lat: 45.9667, lon: 4.05 },
};

// Function to fetch weather forecast data from the API
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

// Function to update the UI with weather information
const updateWeatherUI = (hourlyWeatherData, city) => {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    const currentHour = new Date().getHours();

    if (
        hourlyWeatherData.temperature_2m &&
        hourlyWeatherData.wind_speed_10m &&
        hourlyWeatherData.relative_humidity_2m &&
        hourlyWeatherData.precipitation
    ) {
        // Extract weather data for the current hour
        const temperatureAtTargetTime = hourlyWeatherData.temperature_2m[currentHour];
        const windSpeedAtTargetTime = hourlyWeatherData.wind_speed_10m[currentHour];
        const humidityAtTargetTime = hourlyWeatherData.relative_humidity_2m[currentHour];
        const precipitationAtTargetTime = hourlyWeatherData.precipitation[currentHour];
        const temperature_2m_max = Math.max(...hourlyWeatherData.temperature_2m);
        const temperature_2m_min = Math.min(...hourlyWeatherData.temperature_2m);

        // Create HTML elements to display weather information
        const weatherInfo = document.createElement('div');
        weatherInfo.classList.add('weather-info');
        weatherInfo.innerHTML = `
            <p>Temperature à l'heure actuelle : <i class="fa-solid fa-temperature-half fa-fade"></i> ${temperatureAtTargetTime} °C.</p>
            <p>Température maximale : <i class="fas fa-temperature-high"></i> ${temperature_2m_max} °C.</p>
            <p>Température minimale : <i class="fas fa-temperature-low"></i> ${temperature_2m_min} °C.</p>
            <p>Vitesse du vent à l'heure actuelle : <i class="fas fa-wind"></i> ${windSpeedAtTargetTime} km/h.</p>
            <p>Humidité à l'heure actuelle : <i class="fas fa-tint"></i> ${humidityAtTargetTime} %.</p>
            <p>Précipitations à l'heure actuelle : <i class="fas fa-cloud-showers-heavy"></i> ${precipitationAtTargetTime} mm.</p>
        `;

        // Append the weather information to the container
        weatherContainer.appendChild(weatherInfo);
    } else {
        console.error('Missing or malformed weather data:', hourlyWeatherData);
    }

    // Update the background image based on the selected city
    const cityBackgrounds = {
        'Saint-Étienne': 'url(Images/Saint_Etienne.webp)',
        'Lyon': 'url(Images/Lyon.jpeg)',
        'Marseille': 'url(Images/Marseille.jpg)',
        'Paris': 'url(Images/Paris.webp)',
        'Bourg-en-Bresse': 'url(Images/Bourg.jpg)',
        'Commelle-Vernay': 'url(Images/Commelle.jpeg)',
    };
    const body = document.body;
    body.style.backgroundImage = cityBackgrounds[city] || 'url(Images/image_default.jpg)';
};

// Function to get coordinates for a given city
const getCoordinates = async (city) => {
    return cities[city];
};

// Event listener for the location form submission
document.getElementById('location-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const city = document.getElementById('city').value;

    try {
        const { lat, lon } = await getCoordinates(city);
        getWeatherForecast(lat, lon);
        updateCityName(city);
    } catch (error) {
        console.error(error.message);
    }
});

// Function to update the displayed city name
const updateCityName = (city) => {
    const cityNameElement = document.getElementById('cityName');
    if (cityNameElement) {
        cityNameElement.innerText = city;
    }
};

// Function to change the city and update weather information
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

// Update the clock every second
const updateClock = () => {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const currentDateTime = new Date().toLocaleString('fr-FR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
        clockElement.innerText = currentDateTime;
    }
};

setInterval(updateClock, 1000);

// Initialize the weather for Saint-Étienne on page load
document.addEventListener('DOMContentLoaded', function () {
    changeCity('Saint-Étienne');
});

// Add event handlers for city buttons
document.getElementById('btnSaintEtienne').addEventListener('click', function () {
    changeCity('Saint-Étienne');
});

document.getElementById('btnLyon').addEventListener('click', function () {
    changeCity('Lyon');
});

document.getElementById('btnMarseille').addEventListener('click', function () {
    changeCity('Marseille');
});

document.getElementById('btnParis').addEventListener('click', function () {
    changeCity('Paris');
});

document.getElementById('btnBourgEnBresse').addEventListener('click', function () {
    changeCity('Bourg-en-Bresse');
});

document.getElementById('btnCommelleVernay').addEventListener('click', function () {
    changeCity('Commelle-Vernay');
});

// Add classes to the buttons for styling
document.getElementById('btnSaintEtienne').classList.add('round-button', 'gray-button');
document.getElementById('btnLyon').classList.add('round-button', 'gray-button');
document.getElementById('btnMarseille').classList.add('round-button', 'gray-button');
document.getElementById('btnParis').classList.add('round-button', 'gray-button');
document.getElementById('btnBourgEnBresse').classList.add('round-button', 'gray-button');
document.getElementById('btnCommelleVernay').classList.add('round-button', 'gray-button');
