import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';
import { useFocusEffect } from '@react-navigation/native';
import POIComponent from '../POIComponent';

const ForumComponent = ({ navigation }) => {
  const [forumsList, setForumsList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authToken, setAuthToken] = useState(null);
  const secureStorage = SecureStorageManager.getInstance();

  const fetchForumsList = async () => {
    try {
      const response = await fetch(SERVER_URL + '/forum', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authentication': authToken,
        },
      });
      if (response.status === 200) {
        const data = await response.json();
        setForumsList(data.accessibleForums);
      }
    } catch (error) {
      console.error('Error getting forums list:', error);
    }
  };

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

    checkAuthToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (authToken) {
        fetchForumsList();
      }
    }, [authToken])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (forumsList === null) {
    return (
      <View style={styles.center}>
        <Text>Sorry! We encountered an error fetching the forums.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.root}>
      {forumsList.map((forum, i) => (
        <POIComponent
          key={forum.id}
          name={forum.name}
          imageURL={forum.imageURL}
          rating={forum.rating || 0}
          onPress={() => navigation.navigate('ForumCommentComponent', 
            { name: forum.name, 
              imageURL: forum.imageURL,
              rating: forum.rating || 0,
              forumId: forum.id 
            })}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f2e7d6',
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ForumComponent;
