import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

export const AcceptFriendModal = ({
  acceptFriendModalVisible,
  setAcceptFriendModalVisible,
}) => {
  const uid = getAuth().currentUser.uid;
  const [result, setResult] = useState([]);
  const [friendUid, setFriendUid] = useState<number | null>(null);

  const getRequests = async () => {
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

  const setFriendUidFunc = (uid: number) => {
    setFriendUid(uid);
  };

  const addFriend = async (uid: number) => {
    setFriendUidFunc(uid);
    console.log({ friendUid });
    try {
      const response = await fetch(
        'http://192.168.1.237:5000/accept-friend-request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_uid: friendUid,
            friend_uid: uid,
            action_user_uid: uid,
          }),
        }
      );
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRequests();
  }, [result]);

  return (
    <View>
      <Text>Accept friend modal</Text>
    </View>
  );
};
