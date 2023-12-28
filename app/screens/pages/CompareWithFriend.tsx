import { View, Text, SafeAreaView, Button } from 'react-native';

export default function CompareWithFriend({ navigation }) {
  return (
    <SafeAreaView>
      <View>
        <Text>Compare with friend</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}
