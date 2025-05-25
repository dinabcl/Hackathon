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
    backgroundColor: '#bbdefb',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#0d47a1',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#90caf9',
    padding: 10,
    borderRadius: 10,
  },
  input: {
    borderBottomWidth: 2,
    width: '60%',
    padding: 10,
    textAlign: 'center',
    fontSize: 18,
    borderBottomColor: '#0d47a1',
    color: '#0d47a1',
  },
  button: {
    backgroundColor: '#42a5f5',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  favoriteButton: {
    backgroundColor: '#1976d2',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
    marginVertical: 15,
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forecastItem: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  todayForecastItem: {
    backgroundColor: '#90caf9',
    borderColor: '#0d47a1',
    borderWidth: 2,
    width: '90%',
    padding: 20,
  },
  date: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0d47a1',
  },
  temp: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 5,
  },
  condition: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#1e88e5',
  },
  humidity: {
    fontSize: 16,
    color: '#1e88e5',
  },
  wind: {
    fontSize: 16,
    color: '#1e88e5',
  },
  flatlistContainer: {
    paddingBottom: 100,
  },
});
