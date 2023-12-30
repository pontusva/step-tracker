import { View, Text, SafeAreaView, Button, StyleSheet } from 'react-native';
import { useFriendStore } from '../../zustand/hooks';
import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';

import { ImageBackground } from 'react-native';

export default function CompareWithFriend({ navigation }) {
  const [friendData, setFriendData] = useState([]);
  const [yourData, setYourData] = useState([]);
  const [winner, setWinner] = useState(null);
  const getFriendId = useFriendStore((state: any) => state.friendId);

  const getFriendData = async () => {
    // fetch the friend's data from the database
    try {
      const response = await fetch(
        `http://192.168.1.237:5000/compare-with-friends?userId=${getFriendId}`
      );

      const result = await response.json();
      setFriendData(result);
      console.log('friend data', result);
    } catch (error) {
      console.log(error);
    }
  };

  const getYourData = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.237:5000/compare-with-friends?userId=${
          getAuth().currentUser.uid
        }`
      );

      const result = await response.json();
      setYourData(result);
    } catch (error) {
      console.log(error);
    }
  };

  // write a function that takes friendData and yourData and compares them and returns the winner

  const compareData = () => {
    if (friendData[0].step_count_day > yourData[0].step_count_day) {
      setWinner(friendData[0].name);
    } else {
      setWinner('You');
    }
  };

  useEffect(() => {
    getFriendData();
    getYourData();
  }, []);
  return (
    <ImageBackground
      source={require('../../assets/homescreen.jpg')}
      resizeMode="cover"
      style={styles.image}>
      <View style={styles.container}>
        <SafeAreaView>
          <View>
            <Button title="Go back" onPress={() => navigation.goBack()} />
            <View
              style={{
                marginTop: 50,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <View>
                {friendData &&
                  friendData.map((item: any) => {
                    return (
                      <View key={item.name}>
                        <Text style={styles.text}>{item.name}</Text>
                        <Text style={styles.text}>
                          {item.step_count_day && item.step_count_day}
                        </Text>
                      </View>
                    );
                  })}
              </View>

              <View>
                {yourData &&
                  yourData.map((item: any) => {
                    return (
                      <View key={item.name}>
                        <Text style={styles.text}>You</Text>
                        <Text style={styles.text}>
                          {item && item.step_count_day}
                        </Text>
                      </View>
                    );
                  })}
              </View>
            </View>
          </View>
          <View
            style={{
              alignItems: 'center',
              marginTop: 50,
            }}>
            <Text>{winner}</Text>
          </View>
        </SafeAreaView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000c0',
  },
  text: {
    color: 'white',
    fontSize: 16,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    flex: 1,
    justifyContent: 'flex-start',
  },
});
