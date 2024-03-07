import { Alert, View, StyleSheet, Button, TouchableOpacity, Text } from 'react-native';
import React, { useState } from 'react';
import * as Updates from 'expo-updates';

import { Input } from '@ui-kitten/components';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const secureStorage = SecureStorageManager.getInstance();

  const handleLogin = async () => {
    console.log('triggered handleLogIn');
    console.log(email, password);

    try {
      const response = await fetch(SERVER_URL + "/user/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();
      const resEmail = data.email;
      const resName = data.name;
      const resToken = data.token;
      console.log(resEmail, resName, resToken);

      if (resToken !== undefined) {
        console.log('login successful');
        await secureStorage.put('authToken', resToken);
        await secureStorage.put('userName', resName);
        await secureStorage.put('userEmail', resEmail);
        Alert.alert("Login Successful", `Welcome ${resName}!`);
        await Updates.reloadAsync();
      } else {
        console.log('login failed');
        Alert.alert("Login Failed", data.message || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.root}>

    <Input
      placeholder="Email"
      autoCapitalize="none"
      value={email}
      onChangeText={(nextVal) => setEmail(nextVal)}
      style={styles.input}
    />
    <Input
      placeholder="Password"
      autoCapitalize="none"
      value={password}
      onChangeText={(nextVal) => setPassword(nextVal)}
      secureTextEntry={true}
      style={styles.input}
    />

      <TouchableOpacity style={styles.buttonContainer} onPress={() => handleLogin()}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.buttonContainer} onPress={() => navigation.navigate('register')}>
        <Text style={styles.buttonText}>Do not have an account? Sign up!</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    backgroundColor: 'green',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  input: {
    borderRadius: 10, // Adjust the value to change the roundness of the corners
    borderWidth: 1, // Add border to give it a cleaner look
    borderColor: 'gray', // Change the border color if needed
    paddingHorizontal: 10, // Add some padding for better readability
    marginBottom: 10, // Add margin bottom to separate inputs
  },
});



export default SignInScreen;
