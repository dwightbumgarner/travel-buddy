import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useFonts } from 'expo-font';

import LogInComponent from '../LogInComponent';
import SignUpComponent from '../SignUpComponent';
import UserDetailComponent from '../UserComponent';
import UploadPhotoScreen from '../UploadPhotoComponent';
import NearbyPOIComponent from "../NearbyPOIComponent";
import ForumComponent from '../ForumComponent';
import SecureStorageManager from '../../storage';

const HomeScreen = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const secureStorage = SecureStorageManager.getInstance();
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const [fontsLoaded] = useFonts({
    MadimiOne: require('../../assets/fonts/MadimiOne-Regular.ttf'), 
  });

  const tabSize = 26;
  const focusedTabSize = 30;

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

  if (!fontsLoaded || loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const AuthFlowNavigator = () => (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'black',
        headerShown: false,
      }}
    >
      <Tab.Screen
          name="login"
          component={LogInComponent}
          options={{
            tabBarStyle: {
                display: "none",
            },
            tabBarButton: () => null,
        }}
      />
      <Tab.Screen
          name="register"
          component={SignUpComponent}
          options={{
            tabBarStyle: {
                display: "none",
            },
            tabBarButton: () => null,
        }}
      />
    </Tab.Navigator>
  );

  const ContentFlowNavigator = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'black',
        tabBarLabelStyle: { display: 'none' },
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Detect POI') {
            iconName = focused ? 'camera-sharp' : 'camera-outline';
          } else if (route.name === 'Find Nearby POI\'s') {
            iconName = focused ? 'search-sharp' : 'search-outline';
          } else if (route.name === 'Forum') {
            iconName = focused ? 'chatbubbles-sharp' : 'chatbubbles-outline';
          }
          const iconSize = focused ? focusedTabSize : tabSize;
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Detect POI" component={UploadPhotoScreen} />
      <Tab.Screen name="Find Nearby POI's" component={NearbyPOIComponent} />
      <Tab.Screen name="Forum" component={ForumComponent} />
    </Tab.Navigator>
  );  

  return (
    <Stack.Navigator>
      {authToken !== null ? (
        <Stack.Screen 
          name="ContentFlow" 
          component={ContentFlowNavigator} 
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: "TravelBuddy",
            headerTitleStyle: {
              fontFamily: 'MadimiOne',
              fontSize: 25,
            },
            headerRight: () => (
              <TouchableOpacity onPress={() => navigation.navigate('UserDetail')}>
                <Ionicons name="person-circle" size={30} color="black" />
              </TouchableOpacity>
            ),
          })}
        />
      ) : (
        <Stack.Screen 
          name="AuthFlow" 
          component={AuthFlowNavigator} 
          options={{
            headerShown: false,
          }}
        />
      )}
      <Stack.Screen name="UserDetail" component={UserDetailComponent} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;
