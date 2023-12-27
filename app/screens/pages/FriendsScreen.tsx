import { useState, useEffect } from 'react';
import { Text, Dimensions, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';
import { AddFriendModal } from '../components/Modals/AddFriendModal';
import { GetFriendRequests } from '../components/GetFriendRequests';
import Ionicons from '@expo/vector-icons/Ionicons';
interface NoEmailFound {
  error: string;
}
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export const FriendsScreen = () => {
  const [emptyEmail, setEmptyEmail] = useState<NoEmailFound | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const onChangeSearch = (query: string) => setSearchQuery(query);

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
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Friends</Text>
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            alignItems: 'center',
          }}>
          <GetFriendRequests />
          <Ionicons name="people" size={50} color="black" />
        </View>
      </View>
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
      <AddFriendModal
        items={items}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
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
