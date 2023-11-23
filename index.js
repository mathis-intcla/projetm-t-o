import axios from 'axios';

// Déplacer la déclaration de getRandomCoordinates à l'extérieur du module
const getRandomCoordinates = () => {
    const randomLatitude = Math.random() * (90 - (-90)) + (-90);
    const randomLongitude = Math.random() * (180 - (-180)) + (-180);
    return { latitude: randomLatitude, longitude: randomLongitude };
};

const getCityName = async (latitude, longitude) => {
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`;

    try {
        const response = await axios.get(nominatimUrl);

        if (response.data && response.data.address && response.data.address.city) {
            return response.data.address.city;
        } else {
            throw new Error('City name not found');
        }
    } catch (error) {
        console.error('Error fetching city name:', error);
    }
};

const getWeatherForecast = async () => {
    const { latitude, longitude } = getRandomCoordinates();

    try {
        const cityName = await getCityName(latitude, longitude);
        updateCityName(cityName);

        const apiUrl = `https://api.open-meteo.com/v1/meteofrance?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m`;

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

const updateCityName = (cityName) => {
    // Mettez à jour le DOM avec le nom de la ville
    const cityNameElement = document.getElementById('cityName');
    if (cityNameElement) {
        cityNameElement.innerText = cityName;
    }
};

const updateUI = (hourlyWeatherData) => {
    // Le reste du code pour mettre à jour l'interface utilisateur
    // ...
};

// Initial weather forecast
getWeatherForecast();

// Définir l'intervalle pour actualiser la météo toutes les 24 heures
setInterval(getWeatherForecast, 24 * 60 * 60 * 1000); // 24 heures en millisecondes
