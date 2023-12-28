import { Alert, Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

export const AcceptFriendModal = ({
  getFriendRequests,
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

  useEffect(() => {
    getRequests();
  }, [result]);

  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={acceptFriendModalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setAcceptFriendModalVisible(!acceptFriendModalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {getFriendRequests &&
              getFriendRequests.length > 0 &&
              getFriendRequests.map((item, index) => {
                return (
                  <View key={index}>
                    <Text>{item.email}</Text>
                  </View>
                );
              })}
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>
                setAcceptFriendModalVisible(!acceptFriendModalVisible)
              }>
              <Text style={styles.textStyle}>Hide Modal</Text>
            </Pressable>
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
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
