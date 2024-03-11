import React, { useCallback } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Stars from 'react-native-stars';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';

const POIComponent = ({ name, imageURL, rating = 0, disabled = true, onPress, forumId = 0 }) => {
  const secureStorage = SecureStorageManager.getInstance();

  const onStarRatingPress = useCallback(async (newRating) => {
    try {
      const authToken = await secureStorage.get('authToken');
      const response = await fetch(SERVER_URL + '/forum/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authentication': authToken,
        },
        body: JSON.stringify({
          rating: newRating,
          forumId: forumId,
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
      } else {
        Alert.alert('Error', data.message || 'Failed to update rating.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating rating.');
    }
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image source={{ uri: imageURL }} style={styles.image} />
      <View style={styles.textAndStarsContainer}>
        <Text style={styles.name}>{name}</Text>
        <Stars
          default={rating}
          count={5}
          half={false}
          fullStar={<Icon name="star" size={24} color="#FFD700" />}
          emptyStar={<Icon name="star-outline" size={24} color="#FFD700" />}
          spacing={4}
          disabled={disabled}
          update={(newRating) => !disabled && onStarRatingPress(newRating)}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    width: '100%',
  },
  textAndStarsContainer: {
    flex: 1,
    marginLeft: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  image: {
    width: 90,
    height: 90,
    borderRadius: 8,
  },
});

export default POIComponent;
