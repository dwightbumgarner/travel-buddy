import React, { useState, useEffect } from 'react';
import { Alert, View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator, ActionSheetIOS } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';
import ChatScreen from '../ChatComponent';

const UploadPhotoScreen = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const secureStorage = SecureStorageManager.getInstance();

  useEffect(() => {
    const init = async () => {
      const token = await secureStorage.get('authToken');
      setAuthToken(token);

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };

    init();
  }, []);

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Take Photo', 'Choose from Library'],
        cancelButtonIndex: 0,
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {
          handleTakePhoto();
        } else if (buttonIndex === 2) {
          handleChoosePhotoFromLibrary();
        }
      }
    );
  };

  const handleTakePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result.assets[0].uri);
      handleUploadPhoto(result.assets[0].uri);
    }
  };

  const handleChoosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setPhoto(result.assets[0].uri);
      handleUploadPhoto(result.assets[0].uri);
    }
  };

  const handleUploadPhoto = async (uri) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('image', {
      uri: uri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
    formData.append('latitude', String(location.coords.latitude));
    formData.append('longitude', String(location.coords.longitude));

    try {
      const response = await fetch(`${SERVER_URL}/landmark/detect`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
          'authentication': authToken,
        },
        body: formData,
      });

      const data = await response.json();
      if (data && data.landmarks && data.landmarks.length > 0) {
        await secureStorage.put('detectedLandmark', data.landmarks[0].landmark);
        setPhoto(null);
        navigation.navigate('ChatScreen', { name: data.landmarks[0].landmark, imageURL: uri});
      } else {
        Alert.alert(
          "No Landmarks Detected",
          "Please try again with a different photo.",
          [{ text: "OK" }]
        );
        setPhoto(null);
      }
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert("Upload Error", "An error occurred while uploading the photo.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={showActionSheet} style={styles.photoUploadButton}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Image source={require('../../assets/uploadPlaceholder.png')} style={styles.photo} />
        )}
      </TouchableOpacity>
      {isUploading && (
        <View style={styles.uploadStatus}>
          <Text style={styles.detectingText}>Detecting Landmark</Text>
          <ActivityIndicator size="small" color="#000" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#f2e7d6',
  },
  photoUploadButton: {
    marginTop: 50,
    width: '90%',
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
  },
  uploadText: {
    fontSize: 18,
    color: '#2b2a29',
  },
  uploadStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  detectingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2b2a29',
    marginRight: 10,
  },
});

export default UploadPhotoScreen;
