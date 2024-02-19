import { Alert, View, StyleSheet, Button, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Updates from 'expo-updates';

import SecureStorageManager from '../../storage';

const UserDetailScreen = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const secureStorage = SecureStorageManager.getInstance();

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await secureStorage.get('authToken');
        setAuthToken(token);

        const name = await secureStorage.get('userName');
        setUserName(name);
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
        await Updates.reloadAsync();
    } catch (error) {
      console.error(error);
      Alert.alert("Login Error", "An unexpected error occurred.");
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
    <View style={styles.root}>
      <Button
        onPress={() => handleLogOut()}
        title="Log out"
        color="blue"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginTop: "50%",
    width: '100%',
    height: '100%',
  },
});

export default UserDetailScreen;
