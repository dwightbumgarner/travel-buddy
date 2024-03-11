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
import ChatComponent from '../ChatComponent';
import ForumCommentComponent from '../ForumCommentComponent';
import SecureStorageManager from '../../storage';
import HeaderComponent from '../HeaderComponent';

const HomeScreen = ({ navigation }) => {
  const [authToken, setAuthToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const secureStorage = SecureStorageManager.getInstance();
  const Tab = createBottomTabNavigator();
  const Stack = createNativeStackNavigator();

  const [fontsLoaded] = useFonts({
    MadimiOne: require('../../assets/fonts/MadimiOne-Regular.ttf'), 
  });

  const tabSize = 28;
  const focusedTabSize = 32;

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
        tabBarActiveTintColor: '#729c70',
        tabBarInactiveTintColor: '#2b2a29',
        tabBarLabelStyle: { display: 'none' },
        headerShown: false,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Detect POI') {
            iconName = 'camera-outline';
          } else if (route.name === 'Find Nearby POI\'s') {
            iconName = 'search-outline';
          } else if (route.name === 'Forum') {
            iconName = 'chatbubbles-outline';
          }
          const iconSize = focused ? focusedTabSize : tabSize;
          return <Ionicons name={iconName} size={iconSize} color={color} />;
        },
        tabBarStyle: {
          position: 'absolute',
          left: 5,
          right: 5,
          elevation: 0,
          backgroundColor: '#fcf4e6',
          borderRadius: 50,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -5,
          },
          shadowOpacity: 0.12,
          shadowRadius: 5.5,
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
          options={{
            header: ({ navigation }) => {
              return <HeaderComponent showBack={false} navigation={navigation} />;
            },
          }}
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
      <Stack.Screen 
            name="UserDetail" 
            options={{
              header: ({ navigation }) => {
                return <HeaderComponent showBack={true} showUser={false} navigation={navigation} />;
              },
            }}
            component={UserDetailComponent} />
      <Stack.Screen 
            name="ForumCommentComponent"
            options={{
              header: ({ navigation }) => {
                return <HeaderComponent showBack={true} navigation={navigation} />;
              },
            }}
            component={ForumCommentComponent} />
      <Stack.Screen 
            name="ChatScreen"
            options={{
              header: ({ navigation }) => {
                return <HeaderComponent showBack={true} navigation={navigation} />;
              },
            }}
            component={ChatComponent} />
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
