import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { getWeather } from './weatherService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertTemp, getTempColor } from './utils';
import { useFocusEffect } from '@react-navigation/native'; 

const FavoriteCities = ({ isCelsius }) => {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [favoriteWeather, setFavoriteWeather] = useState({});
  const [loading, setLoading] = useState(true);

  // Function to load favorite cities from AsyncStorage
  const loadFavorites = async () => {
    try {
      const savedFavorites = await AsyncStorage.getItem('favoriteCities');
      if (savedFavorites) {
        setFavoriteCities(JSON.parse(savedFavorites));
      } else {
        setFavoriteCities([]);
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Function to fetch weather data
  const fetchFavoriteWeather = async () => {
    if (favoriteCities.length === 0) return;
    try {
      setLoading(true);
      const newWeather = {};
      for (let city of favoriteCities) {
        const data = await getWeather(city);
        newWeather[city] = data.forecast[0]; 
      }
      setFavoriteWeather(newWeather);
    } catch (error) {
      console.error('Error fetching favorite cities weather:', error);
    } finally {
      setLoading(false);
    }
  };

  // Reload data when a city is added or removed
  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    fetchFavoriteWeather();
  }, [favoriteCities]); // Re-fetch when cities change

  // Ensure reload when navigating back to this screen
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorite Cities</Text>
      <FlatList
        data={favoriteCities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.forecastItem}>
            <Text style={styles.cityName}>{item}</Text>
            <Text style={[styles.temp, { color: getTempColor(favoriteWeather[item]?.temp, isCelsius) }]}>
              🌡 <Text>{favoriteWeather[item]?.temp ? convertTemp(favoriteWeather[item].temp, isCelsius).toFixed(1) : '--'}°{isCelsius ? 'C' : 'F'}</Text>
            </Text>
            <Text style={styles.condition}>
              ☁ <Text>{favoriteWeather[item]?.description ? favoriteWeather[item].description : '--'}</Text>
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    padding: 15,
    backgroundColor: '#bbdefb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
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
  cityName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  temp: {
    fontSize: 18,
    marginVertical: 5,
  },
  condition: {
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3f2fd',
  },
});

export default FavoriteCities;
