import { Text, StyleSheet, View, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import { getAuth } from 'firebase/auth';
export const ProfileScreen = ({ navigation, route }) => {
  const [pastStepCount, setPastStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const auth = getAuth();
  const user = auth.currentUser;

  const syncSteps = async () => {
    try {
      const response = await fetch('http://192.168.1.237:5000/sync-steps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          steps: pastStepCount,
          uid: user.uid,
        }),
      });
      const data = await response.json();
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

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
    return Pedometer.watchStepCount(result => {
      setCurrentStepCount(result.steps);
    });
  };

  useEffect(() => {
    if (subscription) {
      subscription.remove();
    }

    subscribe().then(sub => {
      setSubscription(sub);
    });
    return () => subscription && subscription.remove();
  }, [currentStepCount]);
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.text}>
          The last 24 hours you've taken{' '}
          <Text style={styles.span}>{pastStepCount}</Text> steps
        </Text>
        <Text style={styles.text}>
          Do you want to share this with your friends?
        </Text>
        <Pressable onPress={syncSteps} style={styles.button}>
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
