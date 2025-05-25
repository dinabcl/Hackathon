import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './components/Home';
import Settings from './components/Settings';
import FavoriteCities from './components/FavoriteCities'; 

const Drawer = createDrawerNavigator();

export default function App() {
  const [isCelsius, setIsCelsius] = useState(true);

  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home">
          {props => <Home {...props} isCelsius={isCelsius} setIsCelsius={setIsCelsius} />}
        </Drawer.Screen>
        <Drawer.Screen name="Settings">
          {props => <Settings {...props} isCelsius={isCelsius} setIsCelsius={setIsCelsius} />}
        </Drawer.Screen>
        <Drawer.Screen name="Favorite Cities">
          {props => <FavoriteCities {...props} isCelsius={isCelsius} setIsCelsius={setIsCelsius} />}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
