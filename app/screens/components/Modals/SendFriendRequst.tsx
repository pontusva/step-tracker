import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { getAuth } from 'firebase/auth';

export const SendFriendRequst = ({ friendUId }) => {
  const uid = getAuth().currentUser.uid;
  console.log({ uid, friendUId });

  const sendFriendRequest = async () => {
    const response = await fetch(
      'http://192.168.1.237:5000/send-friend-request',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUserId: uid, friendUId: friendUId }),
      }
    );

    const result = await response.json();
    console.log(result);
  };

  return (
    <View>
      <Text onPress={sendFriendRequest}>Send Request</Text>
    </View>
  );
};
