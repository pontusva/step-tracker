import { Text, StyleSheet, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';

export const ProfileScreen = ({ navigation, route }) => {
  const [pastStepCount, setPastStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);

  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 1);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }
    }
  };

  useEffect(() => {
    if (subscription) {
      subscription.remove();
    }

    subscribe().then(sub => {
      setSubscription(sub);
    });
    return () => subscription && subscription.remove();
  }, []);
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>
          {' '}
          The last 24 hours you've taken{' '}
          <Text style={styles.span}>{pastStepCount}</Text> steps
        </Text>
        <Text style={styles.text}>
          Do you want to share this with your friends?
        </Text>
        <Pressable style={styles.button}>
          <Text style={styles.text}>Yes</Text>
        </Pressable>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000c0',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    marginTop: 20,
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 16,
    lineHeight: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  span: {
    color: 'red',
    fontSize: 32,
  },
});
