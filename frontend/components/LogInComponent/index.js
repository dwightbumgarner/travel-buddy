import { Alert, View, StyleSheet, Button } from 'react-native';
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
        Alert.alert("Login Failed", response.message || "An error occurred");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Login Error", "An unexpected error occurred.");
    }
  };

  return (
    <View style={styles.root}>
      <Input
        placeholder="email"
        autoCapitalize="none"
        value={email}
        onChangeText={(nextVal) => setEmail(nextVal)}
      />
      <Input
        placeholder="password"
        autoCapitalize="none"
        value={password}
        onChangeText={(nextVal) => setPassword(nextVal)}
        secureTextEntry={true}
      />
      <Button
        onPress={() => handleLogin()}
        title="Sign in"
        color="blue"
      />
      <Button
        onPress={() => navigation.navigate('register')}
        title="Do not have an account? Sign up!"
        type="Tertiary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    marginTop: "50%",
    width: '100%',
    height: '100%',
  },
});

export default SignInScreen;
