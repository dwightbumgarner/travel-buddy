import React, {useState, useEffect, useCallback} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Location from 'expo-location';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';
import {ListItem} from "@ui-kitten/components";

const ForumComponent = ({ navigation }) => {
    const [POIList, setPOIList] = useState(null);
    const [loading, setLoading] = useState(true);
    const [location, setLocation] = useState(null);
    const [locationErrMsg, setLocationErrMsg] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const secureStorage = SecureStorageManager.getInstance();

    const fetchPOIList = async () => {
        if (!location) {
            return;
        }
        try {
            const response = await fetch(SERVER_URL + "/ai/nearby", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authentication': authToken,
                },
                body: JSON.stringify({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                }),
            })
            if (response.status === 200) {
                const data = await response.json();
                setPOIList(data.POIList);
            }
        } catch (error) {
            console.error('Error getting POI list:', error);
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

    useEffect(() => {
        fetchPOIList();
    }, [location])


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
                <Text>You have to enable GPS tracking to use the nearby POI's feature</Text>
            </View>
        )
    }

    if (POIList === null) {
        return (
            <View style={styles.center}>
                <Text>Sorry! We encountered an error fetching the nearby POI's.</Text>
            </View>
        )
    }

    return (
        <View style={styles.root}>
            {
                POIList.map((item, i) => (
                    <ListItem
                        key={i}
                        title={item}
                        leftIcon={{ name: 'recommend' }}
                        bottomDivider
                        chevron
                    />
                ))
            }
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

export default ForumComponent;
