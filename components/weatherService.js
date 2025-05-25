const API_KEY = '25d1520dfee2ee05ef782a30c2c9e45a'; 
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const getWeather = async (city) => {
  try {
    const response = await fetch(`${BASE_URL}?q=${city}&units=metric&appid=${API_KEY}`);
    const data = await response.json();

    if (data.cod !== '200') {
      throw new Error(data.message);
    }

    // Extract daily data (API gives 3-hour intervals, so we pick one per day)
    const dailyForecast = data.list.filter((reading, index) => index % 8 === 0); // Approx. every 24h

    const result = {
      city: data.city.name,
      forecast: dailyForecast.map((day) => ({
        date: new Date(day.dt * 1000).toDateString(),
        temp: day.main.temp,
        description: day.weather[0].description,
        humidity: day.main.humidity,
        windSpeed: day.wind.speed,
      })),
    };

    console.log('Fetched Weather Data:', result); // Log the fetched data
    return result;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};
