import { useState, useEffect } from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

export const FriendsScreen = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (search && search.length > 0) {
      // Replace this with your actual database query
      fetch(`https://your-database-api.com/search?email=${search}`)
        .then(response => response.json())
        .then(data => {
          const newItems = data.map(user => ({
            label: user.email,
            value: user.uid,
          }));
          setItems(newItems);
        });
    } else {
      setItems([]);
    }
  }, [search]);

  return (
    <>
      <DropDownPicker
        searchable={true}
        searchPlaceholder="Search email"
        onChangeValue={setSearch}
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
      />
    </>
  );
};
