import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {
  getAuth,
  updateProfile,
  updatePassword,
  deleteUser,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';

export const SettingsScreen = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordDelete, setPasswordDelete] = useState('');

  const updateName = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await updateProfile(user, { displayName: name });
        alert('Name updated successfully');
      } catch (error) {
        console.error(error);
      } finally {
        setName('');
      }
    }
  };

  const updatePasswordFunc = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      try {
        await updatePassword(user, password);
        alert('Password updated successfully');
      } catch (error) {
        console.error(error);
      } finally {
        setPassword('');
      }
    }
  };

  // ...

  const deleteAccount = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && user.email) {
      const credential = EmailAuthProvider.credential(
        user.email,
        passwordDelete
      ); // use the password from state

      try {
        await reauthenticateWithCredential(user, credential);
        await deleteUser(user);
        alert('Account deleted successfully');
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="New Name"
          />
          <Button title="Update Name" onPress={updateName} />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="New Password"
            secureTextEntry
          />
          <Button title="Update Password" onPress={updatePasswordFunc} />

          <TextInput
            style={styles.input}
            value={passwordDelete}
            onChangeText={setPasswordDelete}
            placeholder="Current Password"
            secureTextEntry
          />
          <Button title="Delete Account" onPress={deleteAccount} />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: 'space-around',
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
  },
  textInput: {
    height: 40,
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: 'white',
    marginTop: 12,
  },
});
