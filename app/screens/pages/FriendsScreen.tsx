import { useState, useEffect } from 'react';
import { Text, Dimensions, StyleSheet, View } from 'react-native';
import { Searchbar } from 'react-native-paper';

interface NoEmailFound {
  error: string;
}
const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height

export const FriendsScreen = () => {
  const [emptyEmail, setEmptyEmail] = useState<NoEmailFound | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
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
      <View style={styles.container}>
        {items.length < 1 && <Text>{emptyEmail.error}</Text>}
        <View
          style={{
            width: width,
            marginBottom: 20,
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
              <Text key={item.value} style={styles.emailText}>
                {item.email}
              </Text>
            );
          })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
