import { Alert, View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import * as Updates from 'expo-updates';
import Ionicons from 'react-native-vector-icons/Ionicons';


import SecureStorageManager from '../../storage';

const UserDetailScreen = ({ navigation }) => {
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

  useEffect(() => {
    navigation.setOptions({
      headerTitle: `${userName}'s Profile`
    });
  }, [userName]);

  const handleLogOut = async () => {
    console.log('triggered handleLogOut');

    try {
      await secureStorage.delete('authToken');
      await secureStorage.delete('userName');
      await secureStorage.delete('userEmail');
      await secureStorage.delete('detectedLandmark');
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
    <View style={styles.container} options={({  }) => ({
      headerShown: true,
      headerTitle: "TravelBuddy",
      headerTitleStyle: {
        fontFamily: 'MadimiOne',
        fontSize: 25,
      }
    })}>
      <Image
        source={require('../../assets/defaultprofilepic.jpeg')}
        style={styles.profileImage}
      />
      <TouchableOpacity>
        <Ionicons name="navigate" size={25} color="green" />
      </TouchableOpacity>
      <Text style={styles.text}>Name: {userName}</Text> 
      <Text style={styles.text}>Email: {userEmail}</Text> 
      <TouchableOpacity style={styles.buttonContainer} onPress={() => handleLogOut()}>
        <Text style={styles.buttonText}>Log out</Text>
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
    marginTop: -300, // Adjust the marginTop value to push everything up
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
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 2,
    borderColor: 'green',
    marginBottom: 20,
  },
});

<<<<<<< Updated upstream
export default UserDetailScreen;
=======
export default UserDetailComponent;
>>>>>>> Stashed changes
