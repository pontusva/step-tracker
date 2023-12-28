import { useState, useEffect, useCallback } from 'react';
import {
  Text,
  Dimensions,
  Switch,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Button, Searchbar } from 'react-native-paper';
import { SendFriendRequst } from '../components/Modals/SendFriendRequst';
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
  const [isEnabled, setIsEnabled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [emailOfSearchedUser, setEmailOfSearchedUser] = useState([]);
  const onChangeSearch = query => setSearchQuery(query);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

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
  console.log(emailOfSearchedUser);
  return (
    <>
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
        <Text>{getAuth().currentUser.displayName}</Text>
        <Ionicons name="person-add-outline" size={50} color="black" />
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
        <Text>Friends</Text>
      )}
    </>
  );
};
