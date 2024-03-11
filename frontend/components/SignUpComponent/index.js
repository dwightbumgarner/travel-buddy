import React, { useState } from 'react';
import { Alert, View, StyleSheet, Button, TouchableOpacity, Text, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import * as Updates from 'expo-updates';

import { Input } from '@ui-kitten/components';

import { SERVER_URL } from '../../consts';
import SecureStorageManager from '../../storage';

const SignUpComponent = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const secureStorage = SecureStorageManager.getInstance();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validateName = (name) => {
    const parts = name.trim().split(' ');
    return parts.length >= 2;
  };

  const handleSignUp = async () => {
    console.log('triggered handleSignUp');

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      return;
    }

    if (!validateName(name)) {
      Alert.alert("Invalid Name", "Please enter your full name (first and last).");
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

      if (data.token) {
        console.log('Sign Up successful');
        await secureStorage.put('authToken', data.token);
        await secureStorage.put('userName', data.name);
        await secureStorage.put('userEmail', data.email);
        Alert.alert("Sign Up Successful", `Welcome ${data.name}!`);
        await Updates.reloadAsync();
      } else {
        console.log('Sign Up failed');
        Alert.alert("Sign Up Failed", data.message || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Sign Up Error", "An unexpected error occurred.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Image source={require('../../assets/logo.png')} style={styles.image} />

        <Input placeholder="Full Name" autoCapitalize="none" value={name} onChangeText={setName} style={styles.input} />
        <Input placeholder="Email" autoCapitalize="none" value={email} onChangeText={setEmail} style={styles.input} />
        <Input placeholder="Password" autoCapitalize="none" value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} />

        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('login')} style={{ paddingTop: 20 }}>
          <Text style={[styles.buttonText, { color: 'black' }]}>Already have an account? <Text style={[styles.buttonText, { color: '#729c70' }]}>Sign in!</Text></Text>
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
    marginTop: 0,
  },
});

export default SignUpComponent;
