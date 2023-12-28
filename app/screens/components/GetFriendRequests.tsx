import { View, Text } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';
export const GetFriendRequests = ({ acceptFriendModalVisible }) => {
  const [result, setResult] = useState([]);
  const uid = getAuth().currentUser?.uid;

  const getRequests = async () => {
    console.log({ uid });
    try {
      const response = await fetch(
        'http://192.168.1.237:5000/get-friend-requests',
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ uid }),
        }
      );
      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRequests();
  }, [acceptFriendModalVisible]);

  return (
    <View>
      <Text
        style={{
          color: 'red',
          fontSize: 20,
          fontWeight: 'bold',
        }}>
        {result.length > 0 ? result.length : 0}
      </Text>
    </View>
  );
};
