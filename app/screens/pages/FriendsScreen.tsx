import { useState, useEffect } from 'react';
import { Text, Dimensions, Switch, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { AddFriendModal } from '../components/Modals/AddFriendModal';
import { GetFriendRequests } from '../components/GetFriendRequests';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AcceptFriendModal } from '../components/Modals/AcceptFriendModal';
import { getAuth } from 'firebase/auth';
interface NoEmailFound {
  error: string;
}
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export const FriendsScreen = () => {
  const [emptyEmail, setEmptyEmail] = useState<NoEmailFound | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [friendsList, setFriendsList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [friendsListToggle, setFriendsListToggle] = useState(true);
  const [acceptFriendModalVisible, setAcceptFriendModalVisible] =
    useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const uid = getAuth().currentUser?.uid;
  const onChangeSearch = (query: string) => setSearchQuery(query);

  // write a function that post the uid to the backend and reqeusts the friends from /get-friends endpoint

  const getFriends = async () => {
    const response = await fetch('http://192.168.1.237:5000/get-friends', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_uid: uid }),
    });
    const result = await response.json();
    setFriendsList(result);
  };

  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      fetch(`http://192.168.1.237:5000/emails?search=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setItems(data);
          } else {
            setEmptyEmail(data);
          }
        });
    } else {
      setItems([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    getFriends();
  }, []);

  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: width,
          padding: 10,
        }}>
        <View>
          <Text style={{ fontSize: 30, fontWeight: 'bold' }}>
            {isEnabled ? 'Add Friends' : 'Friends'}
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            alignItems: 'center',
          }}>
          <GetFriendRequests />
          <Ionicons
            onPress={() =>
              setAcceptFriendModalVisible(!acceptFriendModalVisible)
            }
            name="people"
            size={50}
            color="black"
          />
        </View>
      </View>
      {/* Seperate this ternery into own component */}
      {isEnabled ? (
        <>
          <View style={styles.container}>
            <View
              style={{
                width: width,
              }}>
              <Searchbar
                placeholder="Search"
                onChangeText={onChangeSearch}
                value={searchQuery}
              />
            </View>
            {items &&
              items.map(item => {
                return (
                  <View key={item.value}>
                    <Text
                      onPress={() => setModalVisible(!modalVisible)}
                      style={styles.emailText}>
                      {item.email}
                    </Text>
                  </View>
                );
              })}
            {items.length < 1 && emptyEmail !== null && (
              <Text>{emptyEmail.error}</Text>
            )}
          </View>
        </>
      ) : (
        <View
          style={{
            width: width,
            alignItems: 'center',
            justifyContent: 'center',
            height: height - 500,
          }}>
          {friendsList &&
            friendsList.map((item, index) => {
              return (
                <View key={index}>
                  <Text>{item.friend_name}</Text>
                </View>
              );
            })}
        </View>
      )}
      <AddFriendModal
        items={items}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
      <AcceptFriendModal
        acceptFriendModalVisible={acceptFriendModalVisible}
        setAcceptFriendModalVisible={setAcceptFriendModalVisible}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  emailText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
