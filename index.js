import axios from 'axios';

const getWeatherForecast = async (latitude, longitude) => {
    const apiUrl = `https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;

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

        const données = document.createElement('div');
        données.classList.add('weather-info');
        données.innerHTML = `
            <p>Temperature à l'heure actuelle : <i class="fas fa-thermometer-half"></i> ${temperatureAtTargetTime} °C.</p>
            <p>Vitesse du vent à l'heure actuelle : <i class="fas fa-wind"></i> ${windSpeedAtTargetTime} km/h.</p>
            <p>Humidité à l'heure actuelle : <i class="fas fa-tint"></i> ${humidityAtTargetTime} %.</p>
            <p>Précipitations à l'heure actuelle : <i class="fas fa-cloud-showers-heavy"></i> ${precipitationAtTargetTime} mm.</p>
        `;

        weatherContainer.appendChild(données);
    } else {
        console.error('Données météorologiques manquantes ou malformatées:', hourlyWeatherData);
    }

    const données = document.createElement('div');
    données.classList.add('weather-data');
    données.innerHTML = `
        <p> Temperature: ${temperatureAtTargetTime} °C</p>
        <p> Wind Speed: ${windSpeedAtTargetTime} km/h</p>
        <p> Humidity: ${humidityAtTargetTime} %</p>
        <p> Precipitation: ${precipitationAtTargetTime} mm</p>
    `;
};

const getRandomCoordinates = () => {
    const randomLatitude = Math.random() * (90 - (-90)) + (-90);
    const randomLongitude = Math.random() * (180 - (-180)) + (-180);
    return { latitude: randomLatitude, longitude: randomLongitude };
};

document.getElementById('random-button').addEventListener('click', () => {
    const { latitude, longitude } = getRandomCoordinates();
    getWeatherForecast(latitude, longitude);
});

getWeatherForecast();

setInterval(getWeatherForecast, 24 * 60 * 60 * 1000);
