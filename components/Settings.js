import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

export default function Settings({ isCelsius, setIsCelsius }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select temperature unit:</Text>
      <View style={styles.switchContainer}>
        <Text style={styles.toggleText}>°F</Text>
        <Switch
          value={isCelsius}
          onValueChange={setIsCelsius}
          thumbColor={isCelsius ? "#0d47a1" : "#1565c0"} // Deep blue tones
          trackColor={{ false: "#bbdefb", true: "#64b5f6" }} // Light blue gradient
          ios_backgroundColor="#D8BFD8" // Consistent iOS styling
          style={styles.switch}
        />
        <Text style={styles.toggleText}>°C</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 28,
    backgroundColor: '#e3f2fd',
  },
  label: {
    fontSize: 18,
    color: "#0d47a1",
    marginBottom: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 24,
    shadowColor: "#1976d2",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#bbdefb",
    marginTop: 10,
  },
  toggleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginHorizontal: 18,
    color: "#1976d2",
    letterSpacing: 1,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
    marginHorizontal: 10,
  },
});
