import { Button, Text } from 'react-native';
import { getAuth, getAdditionalUserInfo } from 'firebase/auth';
export const HomeScreen = ({ navigation }) => {
  const auth = getAuth().currentUser;
  console.log(auth);
  return (
    <>
      <Text>Welcome</Text>
      <Button title="user" onPress={() => console.log(auth)} />
    </>
  );
};
