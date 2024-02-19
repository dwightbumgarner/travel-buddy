import { Alert, View, StyleSheet, Button } from 'react-native';
import React, { useState } from 'react';

import { Input } from '@ui-kitten/components';

import { SERVER_URL } from '../../consts';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('triggered on press');
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
        Alert.alert("Login Successful", `Welcome ${resName}!`);
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
        title="Sign up"
        type="Tertiary"
        // onPress={() => navigation.navigate('register')}
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
