import React, { useState } from 'react';
import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { getAuth } from 'firebase/auth';

export const SendFriendRequst = ({
  modalVisible,
  setModalVisible,
  friendUId,
}) => {
  const uid = getAuth().currentUser.uid;

  const addFriend = async () => {
    const response = await fetch('http://192.168.1.237:5000/friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_uid: uid,
        friend_uid: friendUId,
        action_user_uid: uid,
      }),
    });
    const result = await response.json();
    console.log(result);
  };

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Add friend?</Text>
            <View style={styles.modalButtons}>
              <Pressable
                style={[
                  styles.button,
                  styles.buttonClose,
                  styles.buttonMarginRight,
                ]}
                onPress={() => {
                  addFriend();
                  // setModalVisible(!modalVisible)
                }}>
                <Text style={styles.textStyle}>Yes</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}>
                <Text style={styles.textStyle}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalButtons: {
    flexDirection: 'row',
  },
  button: {
    padding: 10,
    elevation: 2,
  },
  buttonMarginLeft: {
    marginLeft: 10,
  },
  buttonMarginRight: {
    marginRight: 10,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
