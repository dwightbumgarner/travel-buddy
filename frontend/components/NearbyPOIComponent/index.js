import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';
import POIComponent from '../POIComponent'; // Ensure this path is correct for your project structure

const NearbyPOIScreen = ({ navigation }) => {
    const [POIList, setPOIList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const secureStorage = SecureStorageManager.getInstance();

    useEffect(() => {
        const checkAuthTokenAndLocation = async () => {
            try {
                const token = await secureStorage.get('authToken');
                setAuthToken(token);
            } catch (error) {
                console.error('Error fetching auth token:', error);
            }

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let userLocation = await Location.getCurrentPositionAsync({});
            setLocation(userLocation);
            setLoading(false);
        };

        checkAuthTokenAndLocation();
    }, []);

    useEffect(() => {
        if (authToken && location) {
            fetchPOIList();
        }
    }, [authToken, location]);

    const fetchPOIList = async () => {
        try {
            const response = await fetch(`${SERVER_URL}/nearby`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': authToken,
                },
                body: JSON.stringify({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }),
            });
            if (response.status === 200) {
                const data = await response.json();
                setPOIList(data);
            } else {
                console.error('Failed to fetch POI list with status:', response.status);
            }
        } catch (error) {
            console.error('Error getting POI list:', error);
        }
    };

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.root}>
            {loading ? (
                <ActivityIndicator size="large" color="#2b2a29" />
            ) : POIList.length ? (
                POIList.map((poi, index) => (
                    <POIComponent
                        key={index}
                        name={poi.name}
                        imageURL={poi.url}
                        rating={poi.forumRating || 0}
                    />
                ))
            ) : (
                <ActivityIndicator size="large" color="#2b2a29" />
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f2e7d6',
    },
    root: {
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default NearbyPOIScreen;
