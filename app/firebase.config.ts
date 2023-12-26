import {
  initializeAuth,
  getAuth,
  onAuthStateChanged,
  getReactNativePersistence,
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA0ZoN2ey6bGReHY6_Xc_eEYe9MHC6IiBQ',

  authDomain: 'madame-90ac7.firebaseapp.com',

  projectId: 'madame-90ac7',

  storageBucket: 'madame-90ac7.appspot.com',

  messagingSenderId: '1083578133945',

  appId: '1:1083578133945:web:924de29091e4e442c5da68',

  measurementId: 'G-ZBR175GFGJ',
};

export default firebaseConfig;
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
const app = initializeApp(firebaseConfig, {});
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
