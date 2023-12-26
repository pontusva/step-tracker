import React, { useState } from 'react';
import { TextInput, Button, StyleSheet } from 'react-native';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

const SignUpScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signUp = async () => {
    const auth = getAuth();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get the UID
      const uid = user.uid;

      // Update the user's profile with the entered name
      await updateProfile(user, { displayName: name });

      const response = await fetch('http://192.168.1.237:5000/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, name, email }),
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      } else {
        console.error('Server responded with status', response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Name"
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Sign Up" onPress={signUp} />
    </>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
