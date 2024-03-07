import React, { useState, useEffect } from 'react';
import { Alert, View, Text, Image, Button, StyleSheet, TouchableOpacity, ActionSheetIOS } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';
import ChatScreen from '../ChatComponent';

const UploadPhotoScreen = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [detectedLandmarks, setDetectedLandmarks] = useState([]);
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
    console.log("uploading photo");
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
        setDetectedLandmarks(data.landmarks);
        await secureStorage.put('detectedLandmark', data.landmarks[0]);
      } else {
        Alert.alert(
          "No Landmarks Detected",
          "We couldn't identify any landmarks in your photo. Please try a different image.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error('Upload failed', error);
      Alert.alert("Upload Error", "An error occurred while uploading the photo.");
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.uploadContainer}>
        <Text style={styles.uploadText}>{detectedLandmarks.length > 0 ? detectedLandmarks[0] : "Select Landmark Image:"}</Text>
        <TouchableOpacity onPress={showActionSheet} style={styles.photoContainer}>
          {photo && (
            <View style={styles.photoWrapper}>
              <Image
                source={{ uri: photo }}
                style={styles.photo}
              />
            </View>
          )}
          {!photo && <Text style={styles.photoPlaceholderText}>Select</Text>}
        </TouchableOpacity>
      </View>
      <ChatScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  uploadText: {
    marginRight: 10,
    fontSize: 25,
  },
  photoContainer: {
    width: 70,
    height: 70,
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dotted',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 'auto',
  },
  photoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photo: {
    width: 70,
    height: 70,
    borderRadius: 15,
  },
  photoPlaceholderText: {
    textAlign: 'center',
    color: '#999',
  },
  chatContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default UploadPhotoScreen;
