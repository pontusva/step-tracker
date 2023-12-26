import { Button, Text } from 'react-native';
import { getAuth } from 'firebase/auth';
export const HomeScreen = ({ navigation }) => {
  const auth = getAuth().currentUser;
  console.log(auth.displayName);

  return (
    <>
      <Button title="user" onPress={() => console.log(auth)} />
      <Text>Welcome, {auth.displayName}</Text>
    </>
  );
};
