import { Alert, View, StyleSheet, Button, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import * as Updates from 'expo-updates';

import { Input } from '@ui-kitten/components';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';

const SignUpComponent = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const secureStorage = SecureStorageManager.getInstance();

  const handleSignUp = async () => {
    console.log('triggered handleSignUp');
    console.log(email, password, name);

    // Email validation using regular expression
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch(SERVER_URL + "/user/register", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          name: name,
        }),
      });

      const data = await response.json();
      console.log(data);

      const resEmail = data.email;
      const resName = data.name;
      const resToken = data.token;
      console.log(resEmail, resName, resToken);

      if (resToken !== undefined) {
        console.log('Sign Up successful');
        await secureStorage.put('authToken', resToken);
        await secureStorage.put('userName', resName);
        await secureStorage.put('userEmail', resEmail);
        Alert.alert("Sign Up Successful", `Welcome ${resName}!`);
        await Updates.reloadAsync();
      } else {
        console.log('Sign Up failed');
        Alert.alert("Sign Up Failed", data.message || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Image
          source={require('../../assets/logo.png')}
          style={styles.image}
        />

        <Input
          placeholder="Name"
          autoCapitalize="none"
          value={name}
          onChangeText={(nextVal) => setName(nextVal)}
          style={styles.input}
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

        <TouchableOpacity style={styles.buttonContainer} onPress={() => handleSignUp()}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('login')} style={{ paddingTop: 20 }}>
          <Text style={[styles.buttonText, { color: 'black' }]}>
          Already have an account? <Text style={[styles.buttonText, { color: 'green' }]}>Sign in!</Text>
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: 'gray',
    paddingHorizontal: 10, 
    marginBottom: 10,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    marginTop: 0,
  },
});

export default SignUpComponent;
