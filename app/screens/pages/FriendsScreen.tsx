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
  return (
    <>
      <Text>hello</Text>
    </>
  );
};
