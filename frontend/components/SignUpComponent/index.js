import { Alert, View, StyleSheet, Button } from 'react-native';
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
      <Input
        placeholder="name"
        autoCapitalize="none"
        value={name}
        onChangeText={(nextVal) => setName(nextVal)}
      />
      <Button
        onPress={() => handleSignUp()}
        title="Sign up"
        color="blue"
      />
      <Button
        onPress={() => navigation.navigate('login')}
        title="Already have an account? Sign in!"
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

export default SignUpComponent;
