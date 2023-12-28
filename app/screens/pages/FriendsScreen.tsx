import { useState, useEffect, useCallback } from 'react';
import { useFriendStore } from '../../zustand/hooks';
import { Link } from '@react-navigation/native';
import {
  Text,
  Dimensions,
  Switch,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { Button, Searchbar } from 'react-native-paper';
import { SendFriendRequst } from '../components/Modals/SendFriendRequst';
import { GetFriendRequests } from '../components/GetFriendRequests';
import Ionicons from '@expo/vector-icons/Ionicons';
import { AcceptFriendModal } from '../components/Modals/AcceptFriendModal';
import { getAuth } from 'firebase/auth';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export const FriendsScreen = ({ navigation }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailOfSearchedUser, setEmailOfSearchedUser] = useState([]);
  const [acceptFriendModalVisible, setAcceptFriendModalVisible] =
    useState(false);
  const [getFriendRequests, setGetFriendRequests] = useState([]);
  const [acceptedFriendRequests, setAcceptedFriendRequests] = useState([]);
  const onChangeSearch = query => setSearchQuery(query);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  const getFriendId = useFriendStore((state: any) => state.friendId);
  const setFriendId = useFriendStore((state: any) => state.setFriendId);

  console.log(getFriendId);
  const searchByEmail = async () => {
    const response = await fetch(
      `http://192.168.1.237:5000/search-user?searchParam=${searchQuery}`
    );
    const result = await response.json();

    setEmailOfSearchedUser(result);
  };

  useEffect(() => {
    searchByEmail();
  }, [searchQuery]);

  const getRequests = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.237:5000/pending-friend-requests?userId=${
          getAuth().currentUser.uid
        }`
      );
      const data = await response.json();

      setGetFriendRequests(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAcceptedFriendRequests = async () => {
    try {
      const response = await fetch(
        `http://192.168.1.237:5000/accepted-friend-requests/${
          getAuth().currentUser.uid
        }`
      );
      const data = await response.json();
      console.log(data);
      setAcceptedFriendRequests(data);
      if (!response.ok) {
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRequests();
    fetchAcceptedFriendRequests();
  }, [acceptFriendModalVisible]);

  return (
    <SafeAreaView>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: 'lightgray',
          width: width,
        }}>
        <Text
          style={{
            fontSize: 30,
            fontWeight: 'bold',
            paddingLeft: 10,
          }}>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          {!isEnabled ? 'Friends' : 'Add friends'}
        </Text>
        <GetFriendRequests
          acceptFriendModalVisible={acceptFriendModalVisible}
        />
        <Text>{getAuth().currentUser.displayName}</Text>
        <Ionicons
          onPress={() => setAcceptFriendModalVisible(!acceptFriendModalVisible)}
          name="person-add-outline"
          size={50}
          color="black"
        />
      </View>
      {isEnabled ? (
        <View>
          <Searchbar
            placeholder="Search"
            onChangeText={onChangeSearch}
            value={searchQuery}
          />
          {emailOfSearchedUser &&
            emailOfSearchedUser.length > 0 &&
            emailOfSearchedUser.map((user, index) => {
              return (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgray',
                    width: width,
                  }}>
                  <Text>{user.email}</Text>
                  <SendFriendRequst friendUId={user.uid} />
                </View>
              );
            })}
        </View>
      ) : (
        <View>
          {acceptedFriendRequests &&
            acceptedFriendRequests.map(friends => {
              return (
                <View
                  key={friends.uid}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'lightgray',
                    width: width,
                  }}>
                  <Button
                    onPress={async () => {
                      await setFriendId(friends.uid);
                      navigation.navigate('HiddenScreen');
                    }}>
                    {friends.email}
                  </Button>
                </View>
              );
            })}
        </View>
      )}
      <AcceptFriendModal
        getFriendRequests={getFriendRequests}
        acceptFriendModalVisible={acceptFriendModalVisible}
        setAcceptFriendModalVisible={setAcceptFriendModalVisible}
      />
    </SafeAreaView>
  );
};
