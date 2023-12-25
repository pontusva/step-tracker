import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
const Tab = createBottomTabNavigator();
import { HomeScreen } from './screens/pages/HomeScreen';
import { ProfileScreen } from './screens/pages/ProfileScreen';
import SignInScreen from './screens/pages/SignInScreen';
import { SignUpScreen } from './screens/pages/SignUpScreen';

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        {false ? (
          <>
            <Tab.Screen
              name="Home"
              options={{
                tabBarLabel: 'Home',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home-outline" color={color} size={size} />
                ),
              }}
              component={HomeScreen}
            />
            <Tab.Screen
              name="Profile"
              options={{
                tabBarLabel: 'Profile',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person-outline" color={color} size={size} />
                ),
              }}
              component={ProfileScreen}
            />
            <Tab.Screen
              name="Settings"
              options={{
                tabBarLabel: 'Settings',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="settings-outline" color={color} size={size} />
                ),
              }}
              component={ProfileScreen}
            />
          </>
        ) : (
          <>
            <Tab.Screen
              options={{
                tabBarLabel: 'Login',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="log-in" color={color} size={size} />
                ),
              }}
              name="SignIn"
              component={SignInScreen}
            />
            <Tab.Screen
              options={{
                tabBarLabel: 'Sign Up',
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" color={color} size={size} />
                ),
              }}
              name="SignUp"
              component={SignUpScreen}
            />
          </>
        )}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
