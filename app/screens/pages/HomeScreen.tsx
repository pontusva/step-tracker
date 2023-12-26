import { Button, ImageBackground, StyleSheet, Text } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useEffect } from 'react';
export const HomeScreen = ({ navigation }) => {
  const auth = getAuth().currentUser;
  console.log(auth.displayName);

  useEffect(() => {
    if (!auth) {
      navigation.navigate('SignIn');
    }
  }, []);
  return (
    <>
      <ImageBackground
        source={require('../../assets/homescreen.jpg')}
        resizeMode="cover"
        style={styles.image}>
        {/* <Button title="user" onPress={() => console.log(auth.displayName)} /> */}
        <Text style={styles.text}>Hej {auth.displayName}</Text>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  text: {
    marginTop: 100,
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});
