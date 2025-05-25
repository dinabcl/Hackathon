export const convertTemp = (temp, isCelsius) => (isCelsius ? temp : temp * 9 / 5 + 32);

// Get color based on temperature
export const getTempColor = (temp, isCelsius) => {
  if (temp === undefined || temp === null) return '#333'; 

  // Adjusted color ranges for better gradient handling
  const convertedTemp = convertTemp(temp, isCelsius); // Call the function to get the correct temperature

  if (isCelsius) {
    // Celsius color ranges
    if (convertedTemp >= 30) {
      return '#d32f2f'; // Hot - Red
    } else if (convertedTemp >= 20 && convertedTemp < 30) {
      return '#f57c00'; // Warm - Orange
    } else if (convertedTemp >= 10 && convertedTemp < 20) {
      return '#0288d1'; // Moderate - Blue
    } else if (convertedTemp <= 10) {
      return '#1565c0'; // Cold - Blue
    }
  } else {
    // Fahrenheit color ranges
    if (convertedTemp >= 86) { // 30°C is 86°F
      return '#d32f2f'; // Hot - Red
    } else if (convertedTemp >= 68 && convertedTemp < 86) { // 20°C is 68°F
      return '#f57c00'; // Warm - Orange
    } else if (convertedTemp >= 50 && convertedTemp < 68) { // 10°C is 50°F
      return '#0288d1'; // Moderate - Blue
    } else if (convertedTemp < 50) { // below 10°C is below 50°F
      return '#1565c0'; // Cold - Blue
    }
  }

  return '#333'; 
};
