import { Alert, View, StyleSheet, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Updates from 'expo-updates';
import * as Location from 'expo-location';

import SecureStorageManager from '../../storage';

const UserDetailComponent = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);

  const secureStorage = SecureStorageManager.getInstance();

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await secureStorage.get('authToken');
        setAuthToken(token);

        const name = await secureStorage.get('userName');
        setUserName(name);

        const email = await secureStorage.get('userEmail');
        setUserEmail(email);
      } catch (error) {
        console.log('Error fetching auth token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  const handleLogOut = async () => {
    console.log('triggered handleLogOut');

    try {
      await secureStorage.delete('authToken');
      await secureStorage.delete('userName');
      await secureStorage.delete('userEmail');
      await secureStorage.delete('userLocation');
      await secureStorage.delete('detectedLandmark');
      await Updates.reloadAsync();
    } catch (error) {
      console.error(error);
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  const updateLocation = async () => {
    try {
      let currentLocation = await Location.getCurrentPositionAsync({});
      await secureStorage.put('userLocation', JSON.stringify(currentLocation));
      console.log('User location updated:', currentLocation);
    } catch (error) {
      console.error('Error updating user location:', error);
      Alert.alert("Location Error", "Failed to update user location.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Name: {userName}</Text> 
      <Text style={styles.text}>Email: {userEmail}</Text> 
      <TouchableOpacity style={styles.buttonContainer} onPress={() => handleLogOut()}>
        <Text style={styles.buttonText}>Log out</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={() => updateLocation()}>
        <Text style={styles.buttonText}>Update My Location</Text>
      </TouchableOpacity>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default UserDetailComponent;
