import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { getWeather } from './weatherService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { convertTemp, getTempColor } from './utils';
import { useFocusEffect } from '@react-navigation/native';

const FavoriteCities = ({ isCelsius }) => {
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [favoriteWeather, setFavoriteWeather] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedCity, setExpandedCity] = useState(null); // 👈 To track expanded city

  // Load favorites from AsyncStorage
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

  // Fetch weather for each favorite city
  const fetchFavoriteWeather = async () => {
    if (favoriteCities.length === 0) return;
    try {
      setLoading(true);
      const newWeather = {};
      for (let city of favoriteCities) {
        const data = await getWeather(city);
        newWeather[city] = data.forecast[0]; // assuming forecast[0] has temp, min, max, etc.
      }
      setFavoriteWeather(newWeather);
    } catch (error) {
      console.error('Error fetching weather:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    fetchFavoriteWeather();
  }, [favoriteCities]);

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
          <TouchableOpacity
            onPress={() =>
              setExpandedCity(expandedCity === item ? null : item)
            }
            style={styles.forecastItem}
          >
            <Text style={styles.cityName}>{item}</Text>
            <Text
              style={[
                styles.temp,
                {
                  color: getTempColor(
                    favoriteWeather[item]?.temp,
                    isCelsius
                  ),
                },
              ]}
            >
              🌡{' '}
              <Text>
                {favoriteWeather[item]?.temp
                  ? convertTemp(favoriteWeather[item].temp, isCelsius).toFixed(1)
                  : '--'}
                °{isCelsius ? 'C' : 'F'}
              </Text>
            </Text>
            <Text style={styles.condition}>
              ☁{' '}
              <Text>
                {favoriteWeather[item]?.description || '--'}
              </Text>
            </Text>

            {/* ▼ Dropdown */}
            {expandedCity === item && favoriteWeather[item] && (
              <View style={styles.dropdown}>
                <Text>
                  🔼 High:{' '}
                  {convertTemp(favoriteWeather[item].max, isCelsius).toFixed(1)}°
                  {isCelsius ? 'C' : 'F'}
                </Text>
                <Text>
                  🔽 Low:{' '}
                  {convertTemp(favoriteWeather[item].min, isCelsius).toFixed(1)}°
                  {isCelsius ? 'C' : 'F'}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f8fb',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#1565c0',
    letterSpacing: 1,
  },
  forecastItem: {
    backgroundColor: '#ffffff',
    padding: 22,
    marginVertical: 10,
    borderRadius: 18,
    width: '95%',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: '#1565c0',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#e3eaf2',
    transition: 'all 0.2s',
  },
  cityName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1976d2',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  temp: {
    fontSize: 20,
    marginVertical: 4,
    fontWeight: '600',
  },
  condition: {
    fontSize: 16,
    color: '#607d8b',
    marginBottom: 2,
  },
  dropdown: {
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 18,
    backgroundColor: '#e3f2fd',
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#bbdefb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f8fb',
  },
});

export default FavoriteCities;
