// index.js
import axios from 'axios';

const getWeatherForecast = async () => {
    const apiUrl = 'https://api.open-meteo.com/v1/meteofrance?latitude=45.4339&longitude=4.39&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m';


    try {
        const response = await axios.get(apiUrl);

        // Update the UI with the current weather details
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
    // Clear previous content
    const weatherContainer = document.getElementById('weather-container');
    weatherContainer.innerHTML = '';

    // Check if the 'cityName' element exists before attempting to update it
    const cityNameElement = document.getElementById('cityName');
    if (cityNameElement) {
        // Utiliser directement le nom de la ville (Saint-Étienne)
        cityNameElement.innerText = 'Saint-Étienne';
    }

    // Utiliser la température actuelle et l'heure actuelle
    const currentHour = new Date().getHours(); // Heure actuelle

    // Vérifier si les données nécessaires sont présentes
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

        // Ajouter toutes les informations au conteneur
        const données = document.createElement('div');
        données.innerHTML = `
            <p>Temperature à l'heure actuelle : ${temperatureAtTargetTime} °C.</p>
            <p>Vitesse du vent à l'heure actuelle : ${windSpeedAtTargetTime} km/h.</p>
            <p>Humidité à l'heure actuelle : ${humidityAtTargetTime} %.</p>
            <p>Précipitations à l'heure actuelle : ${precipitationAtTargetTime} mm.</p>
        `;

        // Ajouter l'élément de données au conteneur principal
        weatherContainer.appendChild(données);
    } else {
        console.error('Données météorologiques manquantes ou malformatées:', hourlyWeatherData);
    }
};

// Initial weather forecast for Saint-Étienne
getWeatherForecast();

// Définir l'intervalle pour actualiser la météo toutes les 24 heures
setInterval(getWeatherForecast, 24 * 60 * 60 * 1000); // 24 heures en millisecondes
