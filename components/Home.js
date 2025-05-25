import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  FlatList, KeyboardAvoidingView, Platform 
} from 'react-native';
import { getWeather } from './weatherService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertTemp, getTempColor } from './utils';

export default function Home({ isCelsius, setIsCelsius }) {
  const [city, setCity] = useState('London');
  const [forecast, setForecast] = useState(null);
  const [favoriteCities, setFavoriteCities] = useState([]);

  const fetchWeather = async () => {
    try {
      const data = await getWeather(city);
      setForecast(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const savedFavorites = await AsyncStorage.getItem('favoriteCities');
        if (savedFavorites) {
          setFavoriteCities(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    };
    loadFavorites();
  }, []);

  const handleFavorite = async () => {
    if (favoriteCities.includes(city)) {
      const updatedCities = favoriteCities.filter(item => item !== city);
      setFavoriteCities(updatedCities);
      await AsyncStorage.setItem('favoriteCities', JSON.stringify(updatedCities));
    } else {
      const updatedCities = [...favoriteCities, city];
      setFavoriteCities(updatedCities);
      await AsyncStorage.setItem('favoriteCities', JSON.stringify(updatedCities));
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Storm Watch</Text>
      <View style={styles.inputButtonContainer}>
        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="Enter city"
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={fetchWeather}>
          <Text style={styles.buttonText}>Get Weather</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity 
        style={styles.favoriteButton} 
        onPress={handleFavorite}
      >
        <Text style={styles.buttonText}>
          {favoriteCities.includes(city) ? 'Remove from Favorites' : 'Add to Favorites'}
        </Text>
      </TouchableOpacity>
      <FlatList
        data={forecast ? forecast.forecast : []}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => {
          const isToday = index === 0;
          return (
            <View style={[styles.forecastItem, isToday && styles.todayForecastItem]}>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={[styles.temp, { color: getTempColor(item.temp, isCelsius) }]}>
                🌡 {convertTemp(item.temp, isCelsius).toFixed(1)}°{isCelsius ? 'C' : 'F'}
              </Text>
              <Text style={styles.condition}>☁ {item.description}</Text>
              <Text style={styles.humidity}>💧 Humidity: {item.humidity}%</Text>
              <Text style={styles.wind}>🌬 Wind: {item.windSpeed} km/h</Text>
            </View>
          );
        }}
        contentContainerStyle={styles.flatlistContainer}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6fafd',
    padding: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#0d47a1',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  inputButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#e3f2fd',
    padding: 8,
    borderRadius: 12,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  input: {
    borderBottomWidth: 1.5,
    width: '58%',
    padding: 8,
    textAlign: 'center',
    fontSize: 15,
    borderBottomColor: '#1976d2',
    color: '#0d47a1',
    backgroundColor: '#fff',
    borderRadius: 6,
    marginRight: 8,
  },
  button: {
    backgroundColor: '#42a5f5',
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginLeft: 0,
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  favoriteButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    marginVertical: 12,
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  forecastItem: {
    backgroundColor: '#ffffff',
    padding: 14,
    marginVertical: 7,
    borderRadius: 12,
    width: '98%',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#e3eaf2',
  },
  todayForecastItem: {
    backgroundColor: '#e3f2fd',
    borderColor: '#0d47a1',
    borderWidth: 1.5,
    width: '100%',
    padding: 16,
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0d47a1',
    marginBottom: 2,
    letterSpacing: 0.3,
  },
  temp: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  condition: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#1e88e5',
    marginBottom: 1,
  },
  humidity: {
    fontSize: 13,
    color: '#1976d2',
    marginBottom: 1,
  },
  wind: {
    fontSize: 13,
    color: '#1976d2',
  },
  flatlistContainer: {
    paddingBottom: 60,
  },
});
