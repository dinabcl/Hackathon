const API_KEY = '25d1520dfee2ee05ef782a30c2c9e45a'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const getWeather = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await response.json();

    if (data.cod !== '200') {
      throw new Error(data.message);
    }

    // Group readings by day
    const days = {};
    data.list.forEach((reading) => {
      const date = new Date(reading.dt * 1000).toDateString();
      if (!days[date]) days[date] = [];
      days[date].push(reading);
    });

    // For each day, find the max and min temps
    const forecast = Object.entries(days).map(([date, readings]) => {
      const temps = readings.map(r => r.main.temp);
      const maxTemps = readings.map(r => r.main.temp_max);
      const minTemps = readings.map(r => r.main.temp_min);
      // Use the first reading for description, humidity, windSpeed
      const first = readings[0];
      return {
        date,
        temp: first.main.temp,
        max: Math.max(...maxTemps),
        min: Math.min(...minTemps),
        description: first.weather[0].description,
        humidity: first.main.humidity,
        windSpeed: first.wind.speed,
      };
    });

    const result = {
      city: data.city.name,
      forecast,
    };

    console.log('Fetched Weather Data:', result);
    return result;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};
