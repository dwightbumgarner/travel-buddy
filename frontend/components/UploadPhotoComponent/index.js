import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';

const UploadPhotoScreen = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = React.useState(null);

  useEffect(() => {
    const secureStorage = SecureStorageManager.getInstance();
    const checkAuthToken = async () => {
      try {
        const token = await secureStorage.get('authToken');
        setAuthToken(token);
      } catch (error) {
        console.log('Error fetching auth token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  const handleChoosePhoto = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
        setPhoto(result.assets[0].uri);
    }
  };

  const handleUploadPhoto = async () => {
    console.log('triggered handleUploadPhoto');

    try {
        const formData = new FormData();
        formData.append('image', { uri: photo, name: 'image.jpg', type: 'image/jpeg' });

        const response = await fetch(SERVER_URL + "/landmark/detect", {
            method: 'POST',
            headers: {
                'authentication': authToken,
            },
            body: formData,
        });

        const data = await response.json();
        const resLandmarks = data.landmarks;
        console.log(resLandmarks);
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
      {photo && (
        <>
          <Image
            source={{ uri: photo }}
            style={{ width: "75%", height: "75%" }}
          />
          <Button title="Upload Photo" onPress={handleUploadPhoto} />
        </>
      )}
      <Button title="Choose Photo" onPress={handleChoosePhoto} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginTop: "5%",
    width: '100%',
    height: '100%',
  },
});

export default UploadPhotoScreen;
