import { View, Text, SafeAreaView, Button } from 'react-native';
import { useFriendStore } from '../../zustand/hooks';
export default function CompareWithFriend({ navigation }) {
  const getFriendId = useFriendStore((state: any) => state.friendId);
  console.log({ getFriendId });
  return (
    <SafeAreaView>
      <View>
        <Text>Compare with friend</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}
