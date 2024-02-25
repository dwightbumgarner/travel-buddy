import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LogInComponent from '../LogInComponent';
import SignUpComponent from '../SignUpComponent';
import UserDetailComponent from '../UserComponent';
import UploadPhotoScreen from '../UploadPhotoComponent';

import SecureStorageManager from '../../storage';

const HomeScreen = () => {
  const [authToken, setAuthToken] = useState(null);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  const secureStorage = SecureStorageManager.getInstance();
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const tabSize = 22;

  useEffect(() => {
    const checkAuthToken = async () => {
      try {
        const token = await secureStorage.get('authToken');
        setAuthToken(token);

        const name = await secureStorage.get('userName');
        setUserName(name);
      } catch (error) {
        console.log('Error fetching auth token:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthToken();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const AuthFlowNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen
            name="login"
            component={LogInComponent}
            options={{
                tabBarIcon: (tabInfo) => (
                <Ionicons name="person-add-outline" size={tabSize} color={tabInfo.tintColor} />
                ),
            }}
        />
        <Tab.Screen
            name="register"
            component={SignUpComponent}
            options={{
                tabBarIcon: (tabInfo) => (
                    <Ionicons name="person-add-outline" size={tabSize} color={tabInfo.tintColor} />
                ),
            }}
        />
    </Tab.Navigator>
  );

  const ContentFlowNavigator = () => (
    <Tab.Navigator>
        <Tab.Screen
            name="user"
            component={UserDetailComponent}
            options={{
                tabBarIcon: (tabInfo) => (
                <Ionicons name="person-add-outline" size={tabSize} color={tabInfo.tintColor} />
                ),
            }}
        />
        <Tab.Screen
            name="detect"
            component={UploadPhotoScreen}
            options={{
                tabBarIcon: (tabInfo) => (
                <Ionicons name="person-add-outline" size={tabSize} color={tabInfo.tintColor} />
                ),
            }}
        />
    </Tab.Navigator>
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        {authToken !== null ? (
          <Stack.Screen name="ContentFlow" component={ContentFlowNavigator} />
        ) : (
          <Stack.Screen name="AuthFlow" component={AuthFlowNavigator} />
        )}
    </Stack.Navigator>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white', // Ensures that the area not covered by the navbar and mainSection also has a white background
  },
  navbar: {
    backgroundColor: 'blue',
    width: '100%',
    padding: 15,
    alignItems: 'center',
  },
  navbarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  mainSection: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
