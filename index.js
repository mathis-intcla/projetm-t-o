// index.js
import axios from 'axios';

const getWeatherForecast = async (latitude, longitude) => {
    const apiUrl = `https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min&timezone=Europe%2FBerlin`;

    try {
        const response = await axios.get(apiUrl);

        if (response.data && response.data.hourly) {
            updateUI(response.data.hourly);
        } else {
            console.error('Invalid weather data format:', response.data);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

const updateUI = (hourlyWeatherData) => {
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    const cityNameElement = document.getElementById('cityName');
    if (cityNameElement) {
        cityNameElement.innerText = 'Saint-Étienne';
    }

    const currentHour = new Date().getHours();

    if (
        hourlyWeatherData.temperature_2m &&
        hourlyWeatherData.wind_speed_10m &&
        hourlyWeatherData.relative_humidity_2m &&
        hourlyWeatherData.precipitation
    ) {
        const temperatureAtTargetTime = hourlyWeatherData.temperature_2m[currentHour];
        const windSpeedAtTargetTime = hourlyWeatherData.wind_speed_10m[currentHour];
        const humidityAtTargetTime = hourlyWeatherData.relative_humidity_2m[currentHour];
        const precipitationAtTargetTime = hourlyWeatherData.precipitation[currentHour];
        const temperature_2m_max = Math.max(...hourlyWeatherData.temperature_2m);
        const temperature_2m_min = Math.min(...hourlyWeatherData.temperature_2m);
        const données = document.createElement('div');
        données.classList.add('weather-info');
        données.innerHTML = `
            <p>Temperature à l'heure actuelle : <i class="fas fa-thermometer-half"></i> ${temperatureAtTargetTime} °C.</p>
            <p>Température maximale : <i class="fas fa-temperature-high"></i> ${temperature_2m_max} °C.</p>
            <p>Température minimale : <i class="fas fa-temperature-low"></i> ${temperature_2m_min} °C.</p>
            <p>Vitesse du vent à l'heure actuelle : <i class="fas fa-wind"></i> ${windSpeedAtTargetTime} km/h.</p>
            <p>Humidité à l'heure actuelle : <i class="fas fa-tint"></i> ${humidityAtTargetTime} %.</p>
            <p>Précipitations à l'heure actuelle : <i class="fas fa-cloud-showers-heavy"></i> ${precipitationAtTargetTime} mm.</p>
         
        `;

        weatherContainer.appendChild(données);
    } else {
        console.error('Données météorologiques manquantes ou malformatées:', hourlyWeatherData);
    }
};

// Fonction pour utiliser Nominatim pour obtenir les coordonnées de la ville
const getCoordinates = async (city) => {
    const corsAnywhereUrl = 'https://cors-anywhere.herokuapp.com/';
    const nominatimUrl = `${corsAnywhereUrl}https://nominatim.openstreetmap.org/search/${encodeURIComponent(city)}?format=json`;

    try {
        const response = await axios.get(nominatimUrl);

        if (response.data.length > 0) {
            const { lat, lon } = response.data[0];
            return { lat, lon };
        } else {
            throw new Error('Coordonnées introuvables pour la ville spécifiée:', city);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des coordonnées:', error);
        throw error;
    }
};

// Gestionnaire d'événement pour le formulaire
document.getElementById('location-form').addEventListener('submit', async function (event) {
    event.preventDefault();

    const city = document.getElementById('city').value;

    try {
        const { lat, lon } = await getCoordinates(city);
        getWeatherForecast(lat, lon);
    } catch (error) {
        console.error(error.message);
    }
});

getWeatherForecast(45.4339, 4.39);

setInterval(() => {
    const lastCity = document.getElementById('city').value || 'Saint-Étienne';

    getCoordinates(lastCity)
        .then(({ lat, lon }) => {
            getWeatherForecast(lat, lon);
        })
        .catch((error) => {
            console.error('Erreur lors de la récupération des coordonnées:', error);
        });
}, 24 * 60 * 60 * 1000);

const updateClock = () => {
    const clockElement = document.getElementById('clock');
    if (clockElement) {
        const currentDateTime = new Date().toLocaleString('fr-FR', { hour: 'numeric', minute: 'numeric', second: 'numeric' });
        clockElement.innerText = currentDateTime;
    }
};

// Mettre à jour l'horloge toutes les secondes
setInterval(updateClock, 1000);


