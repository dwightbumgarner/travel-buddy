import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
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
  const [loading, setLoading] = useState(true);

  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const [fontsLoaded] = useFonts({
    MadimiOne: require('../../assets/fonts/MadimiOne-Regular.ttf'), 
  });

  useEffect(() => {
    setLoading(!fontsLoaded);
  }, [fontsLoaded]);

  const ContentFlow = () => (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#729c70',
        tabBarInactiveTintColor: '#2b2a29',
        tabBarLabelStyle: { display: 'none' },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName;
          if (route.name === 'Detect POI') {
            iconName = 'camera-outline';
          } else if (route.name === 'Find Nearby POI\'s') {
            iconName = 'search-outline';
          } else if (route.name === 'Forum') {
            iconName = 'chatbubbles-outline';
          }
          const iconSize = focused ? 32 : 28;
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
          shadowOffset: { width: 0, height: -5 },
          shadowOpacity: 0.12,
          shadowRadius: 5.5,
        },
      })}
    >
      <Tab.Screen name="Detect POI" options={{ headerShown: false }} component={UploadPhotoScreen} />
      <Tab.Screen name="Find Nearby POI's" options={{ headerShown: false }} component={NearbyPOIComponent} />
      <Tab.Screen name="Forum" options={{ headerShown: false }} component={ForumComponent} />
    </Tab.Navigator>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen name="login" component={LogInComponent} options={{ headerShown: false }} />
      <Stack.Screen name="register" component={SignUpComponent} options={{ headerShown: false }} />
      <Stack.Screen 
        name="Content" 
        component={ContentFlow} 
        options={{
          header: ({ navigation }) => <HeaderComponent showBack={false} navigation={navigation} />,
        }} 
      />
      <Stack.Screen 
        name="UserDetail" 
        component={UserDetailComponent} 
        options={{
          header: ({ navigation }) => <HeaderComponent showBack={true} navigation={navigation} />,
        }}
      />
      <Stack.Screen 
        name="ForumCommentComponent"
        component={ForumCommentComponent}
        options={{
          header: ({ navigation }) => <HeaderComponent showBack={true} navigation={navigation} />,
        }}
      />
      <Stack.Screen 
        name="ChatScreen"
        component={ChatComponent}
        options={{
          header: ({ navigation }) => <HeaderComponent showBack={true} navigation={navigation} />,
        }}
      />
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
