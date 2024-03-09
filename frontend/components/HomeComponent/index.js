import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';

import LogInComponent from '../LogInComponent';
import SignUpComponent from '../SignUpComponent';
import UserDetailComponent from '../UserComponent';
import UploadPhotoScreen from '../UploadPhotoComponent';
import NearbyPOIComponent from "../NearbyPOIComponent";
<<<<<<< Updated upstream
import ChatComponent from "../ChatComponent";

import SecureStorageManager from '../../storage';
import chatComponent from "../ChatComponent";

const HomeScreen = () => {
=======
import ForumComponent from '../ForumComponent';
import SecureStorageManager from '../../storage';
const HomeScreen = ({ navigation }) => {
>>>>>>> Stashed changes
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
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'log-in' : 'log-in-outline'}
              size={tabSize}
              color={color}
            />
          ),
          tabBarStyle: {
            display: 'none',
          },
          headerShown: false, // Hide the name of the screen
        }}
      />
      <Tab.Screen
        name="register"
        component={SignUpComponent}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person-add' : 'person-add-outline'}
              size={tabSize}
              color={color}
            />
          ),
          tabBarStyle: {
            display: 'none',
          },
          headerShown: false, // Hide the name of the screen
        }}
      />
    </Tab.Navigator>
  );

  const ContentFlowNavigator = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'black',
        tabBarStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      <Tab.Screen
        name="Profile"
        component={UserDetailComponent}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'person' : 'person-outline'}
              size={tabSize}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Detect POI"
        component={UploadPhotoScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'camera' : 'camera-outline'}
              size={tabSize}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Find Nearby POI's"
        component={NearbyPOIComponent}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? 'search' : 'search-outline'}
              size={tabSize}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="chat"
        component={chatComponent}
        options={{
          tabBarStyle: {
            display: 'none',
          },
          tabBarButton: () => null,
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
<<<<<<< Updated upstream
    </Stack.Navigator>
=======

<Stack.Screen
  name="UserDetail"
  component={UserDetailComponent}
  options={({ navigation }) => ({
    headerShown: true,
    headerTitle: "TravelBuddy",
    headerTitleStyle: {
      fontFamily: 'MadimiOne',
      fontSize: 25,
    },
    headerBackTitleVisible: false, 
    headerLeft: () => (
      <TouchableOpacity onPress={() => navigation.navigate('ContentFlow')}>
        <Ionicons name="arrow-back-outline" size={25} color="black" />
      </TouchableOpacity>
    ),
  })}
/>

      </Stack.Navigator>
>>>>>>> Stashed changes
  );
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
