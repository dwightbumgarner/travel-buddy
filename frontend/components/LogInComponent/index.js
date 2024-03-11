import { Alert, View, StyleSheet, Button, TouchableOpacity, Text, Image, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView } from 'react-native';
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
        setEmail('');
        setPassword('');
        navigation.navigate('Content');
      } else {
        console.log('login failed');
        Alert.alert("Login Failed", data.message || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.root}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.image}
          />

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

          <TouchableOpacity onPress={() => navigation.navigate('register')} style={{ paddingTop: 20 }}>
            <Text style={[styles.buttonText, { color: 'black' }]}>
              Don't have an account? <Text style={[styles.buttonText, { color: '#729c70' }]}>Sign up!</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f2e7d6',
  },
  buttonContainer: {
    backgroundColor: '#729c70',
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
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'gray',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    marginTop: -50,
  },
});

export default SignInScreen;
