import React, { useState, useEffect } from 'react';
import { Alert, View, StyleSheet, Text, TouchableOpacity, Dimensions, TextInput, Image, ActionSheetIOS } from 'react-native';
import * as Updates from 'expo-updates';
import * as ImagePicker from 'expo-image-picker';
import { SERVER_URL } from '../../consts';

import SecureStorageManager from '../../storage';

const UserDetailComponent = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState(require('../../assets/profile.png'));

  const secureStorage = SecureStorageManager.getInstance();

  useEffect(() => {
    const loadData = async () => {
      try {
        const token = await secureStorage.get('authToken');
        setAuthToken(token);

        const name = await secureStorage.get('userName');
        setUserName(name);

        const email = await secureStorage.get('userEmail');
        setUserEmail(email);

        const imageUri = await secureStorage.get('profileImage');
        if (imageUri) {
          setProfileImage({uri: JSON.parse(imageUri) });
        }
      } catch (error) {
        console.log('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleLogOut = async () => {
    try {
      await secureStorage.delete('authToken');
      await secureStorage.delete('userName');
      await secureStorage.delete('userEmail');
      await secureStorage.delete('detectedLandmark');
      navigation.navigate('login');
    } catch (error) {
      console.error(error);
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  const handleProfileImage = async () => {
    const options = ['Cancel', 'Take Photo', 'Choose from Library'];
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          let result = await ImagePicker.launchCameraAsync();
          if (!result.cancelled) {
            setProfileImage({uri: result.assets[0].uri});
            await secureStorage.put('profileImage', JSON.stringify(result.assets[0].uri));
          }
        } else if (buttonIndex === 2) {
          let result = await ImagePicker.launchImageLibraryAsync();
          if (!result.cancelled) {
            setProfileImage({uri: result.assets[0].uri});
            await secureStorage.put('profileImage', JSON.stringify(result.assets[0].uri));
          }
        }
      }
    );
  };

  const handleNameUpdate = async (newName) => {
    console.log("HKSD<")
    console.log(newName);
  
    try {
      const response = await fetch(`${SERVER_URL}/user/edit_name`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authentication': authToken,
        },
        body: JSON.stringify({
          newName: newName,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        Alert.alert("Success", "Your name has been updated.");
        await secureStorage.put('userName', newName);
        setUserName(newName);
      } else {
        throw new Error('Failed to update name');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      Alert.alert("Error", "An error occurred while updating your name.");
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
      <TouchableOpacity onPress={handleProfileImage}>
        <Image source={profileImage} style={styles.profileImage} />
      </TouchableOpacity>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={userName}
        onChangeText={setUserName}
        placeholder="Name"
        placeholderTextColor="#999"
        autoCapitalize="none"
        returnKeyType="done"
        onEndEditing={() => handleNameUpdate(userName)}
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={userEmail}
        editable={false}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleLogOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#f2e7d6',
  },
  profileImage: {
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 30,
  },
  input: {
    fontSize: 16,
    width: windowWidth * 0.65,
    backgroundColor: 'white',
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    backgroundColor: '#729c70',
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
  label: {
    fontSize: 16,
    marginBottom: 5, 
  }
});

export default UserDetailComponent;