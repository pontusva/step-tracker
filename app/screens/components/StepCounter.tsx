import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Pedometer } from 'expo-sensors';

export default function App() {
  const [pastStepCount, setPastStepCount] = useState(0);
  const [currentStepCount, setCurrentStepCount] = useState(0);
  const [subscription, setSubscription] = useState(null);
  const [days, setDays] = useState(1);
  const subscribe = async () => {
    const isAvailable = await Pedometer.isAvailableAsync();

    if (isAvailable) {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - days);

      const pastStepCountResult = await Pedometer.getStepCountAsync(start, end);
      if (pastStepCountResult) {
        setPastStepCount(pastStepCountResult.steps);
      }

      return Pedometer.watchStepCount(result => {
        setCurrentStepCount(result.steps);
      });
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
  }, [days]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {`Steps taken in the last ${
          days <= 0
            ? '0 hours'
            : days <= 2
            ? `${days * 24} hours`
            : days <= 7
            ? `${days} days`
            : '7 days'
        }`}
      </Text>
      <Text style={styles.span}>{pastStepCount}</Text>
      <Button
        onPress={() => {
          if (days > 0) {
            setDays(days - 1);
          }
        }}
        title="Remove a day"
      />

      <Button
        onPress={() => {
          if (days < 7) {
            setDays(days + 1);
          }
        }}
        title="Add a day"
      />
      <Text style={styles.text}>Walk! And watch this go up </Text>
      <Text style={styles.span}>{currentStepCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000c0',
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
