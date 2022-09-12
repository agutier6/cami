import { initializeApp } from "firebase/app";
import 'firebase/auth';
// import { getAnalytics, isSupported } from "firebase/analytics";
import Constants from 'expo-constants';
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';



const firebaseConfig = {
    apiKey: Constants.manifest?.extra?.firebaseApiKey,
    authDomain: Constants.manifest?.extra?.firebaseAuthDomain,
    projectId: Constants.manifest?.extra?.firebaseProjectId,
    storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
    messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId,
    appId: Constants.manifest?.extra?.firebaseAppId,
    measurementId: Constants.manifest?.extra?.firebaseMeasurementId,
    storageBucket: Constants.manifest?.extra?.firebaseStorageBucket,
};

const app = initializeApp(firebaseConfig);
// const analytics = isSupported(getAnalytics(app));
const storage = getStorage(app);

const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
});


export default { app, storage, auth };