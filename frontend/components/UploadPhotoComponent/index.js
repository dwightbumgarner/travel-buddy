import React, { useState, useEffect } from 'react';
import { Alert, View, Text, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';

const UploadPhotoScreen = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = React.useState(null);
  const [location, setLocation] = useState(null);
  const [locationErrMsg, setLocationErrMsg] = useState(null);
  const [detectedLandmarks, setDetectedLandmarks] = useState([]);
  const secureStorage = SecureStorageManager.getInstance();

  useEffect(() => {
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

    const checkUserLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationErrMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log('user current location:', location);
      setLocation(location);
    }

    checkAuthToken();
    checkUserLocation();
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
        formData.append('latitude', `${location.coords.latitude}`);
        formData.append('longitude', `${location.coords.longitude}`);

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
        setDetectedLandmarks(resLandmarks);
        await secureStorage.put('detectedLandmark', resLandmarks[0]);

        if (resLandmarks && resLandmarks.length > 0) {
          Alert.alert(
            "Detected Landmark",
            `Based on your current location and the photo you uploaded, we think the landmark is ${resLandmarks[0]}`,
            [
                { text: "OK", onPress: () => navigation.navigate('chat') }
            ],
            { cancelable: false }
          );
      } else {
          Alert.alert(
              "No Landmarks Detected",
              "We couldn't identify any landmarks in your photo. Perhaps try to upload a different image.",
              [
                  { text: "OK", onPress: () => console.log("no detection res OK Pressed") }
              ],
              { cancelable: false }
          );
      }
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

  if (locationErrMsg === null && location === null) {
    return (
      <View style={styles.center}>
        <Text>You have to enable GPS tracking to use landmark detection feature</Text>
      </View>
    )
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
