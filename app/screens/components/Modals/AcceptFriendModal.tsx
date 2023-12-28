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

  const acceptFriendRequest = async (friendUId: string) => {
    console.log({ uid, friendUId });
    try {
      const response = await fetch(
        'http://192.168.1.237:5000/accept-friend-request',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ currentUserId: uid, friendUId }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Handle successful friend request acceptance
        console.log(data.message);
        console.log(data);
      } else {
        // Handle error
        console.error(data.error);
      }
    } catch (error) {
      console.error(error);
    }
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
                    <Pressable
                      style={[styles.button, styles.buttonClose]}
                      onPress={() => {
                        acceptFriendRequest(item.uid);
                        setAcceptFriendModalVisible(!acceptFriendModalVisible);
                      }}>
                      <Text style={styles.textStyle}>Accept</Text>
                    </Pressable>
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
