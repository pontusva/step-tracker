import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { getAuth } from 'firebase/auth';

export const SendFriendRequst = ({
  modalVisible,
  setModalVisible,
  friendUId,
}) => {
  const uid = getAuth().currentUser.uid;
  console.log({ uid, friendUId });
  const addFriend = async () => {
    const response = await fetch('http://192.168.1.237:5000/friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_uid: uid,
        friend_uid: friendUId,
      }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <View>
      <Text>Send Request</Text>
    </View>
  );
};
