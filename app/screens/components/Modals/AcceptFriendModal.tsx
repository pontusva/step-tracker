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
            user_uid: uid,
            friend_uid: friendUid,
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
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() =>
                setAcceptFriendModalVisible(!acceptFriendModalVisible)
              }>
              <Text style={styles.textStyle}>X</Text>
            </Pressable>
            <Text style={styles.modalText}>Friend Requests</Text>

            <View>
              {result.length > 0 &&
                result.map((item, index) => {
                  return (
                    <View key={index}>
                      <Text>add user: {item.friend_name}</Text>
                      <View style={styles.modalButtons}>
                        <Pressable
                          style={[
                            styles.button,
                            styles.buttonClose,
                            styles.buttonMarginRight,
                          ]}
                          onPress={() => {
                            addFriend(item.friend_uid);
                            // setModalVisible(!modalVisible)
                          }}>
                          <Text style={styles.textStyle}>Yes</Text>
                        </Pressable>
                        <Pressable
                          style={[styles.button, styles.buttonClose]}
                          onPress={() =>
                            setAcceptFriendModalVisible(
                              !acceptFriendModalVisible
                            )
                          }>
                          <Text style={styles.textStyle}>No</Text>
                        </Pressable>
                      </View>
                    </View>
                  );
                })}
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
    justifyContent: 'center',
    marginTop: 10,
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
