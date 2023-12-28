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
        `http://192.168.1.237:5000/pending-friend-requests?userId=${uid}`
      );
      const data = await response.json();
      console.log({ data });
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
      {result && result.length > 0 ? (
        <Text
          style={{
            color: 'red',
            fontSize: 20,
          }}>
          {result.length}
        </Text>
      ) : (
        <Text
          style={{
            color: 'red',
            fontSize: 20,
          }}>
          0
        </Text>
      )}
    </View>
  );
};
