// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyArtcOsz1VLzw30aM5nOom80H5KIxwUl_4",
    authDomain: "taskmanager-654c4.firebaseapp.com",
    projectId: "taskmanager-654c4",
    storageBucket: "taskmanager-654c4.firebasestorage.app",
    messagingSenderId: "706387647042",
    appId: "1:706387647042:web:cb061c12cf42306d932bdb",
    measurementId: "G-H4SPXQ9CH6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export const db = getFirestore(app);