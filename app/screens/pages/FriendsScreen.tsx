import { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import { Searchbar } from 'react-native-paper';
export const FriendsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState([]);
  const onChangeSearch = query => setSearchQuery(query);

  useEffect(() => {
    if (searchQuery && searchQuery.length > 0) {
      fetch(`http://192.168.1.237:5000/emails?search=${searchQuery}`)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const newItems = data.map(user => ({
            label: user.email,
            value: user.uid,
          }));
          setItems(newItems);
        });
    } else {
      setItems([]);
    }
  }, [searchQuery]);
  console.log(items);
  return (
    <>
      <Searchbar
        placeholder="Search"
        onChangeText={onChangeSearch}
        value={searchQuery}
      />
    </>
  );
};
