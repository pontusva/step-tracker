import React, { useState } from 'react';
import { Button, TextInput } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const SignInScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // Signed in
      const user = userCredential.user;
      console.log('User signed in:', user);
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  return (
    <>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <Button title="Sign In" onPress={signIn} />
    </>
  );
};

export default SignInScreen;
