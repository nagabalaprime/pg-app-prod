// Import the functions you need from the SDKs you need

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'
import {getStorage} from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDHVnzbD51Hh5uIBAyYyDjjVnzfotEfjXw",
    authDomain: "manage-pg-prod.firebaseapp.com",
    projectId: "manage-pg-prod",
    storageBucket: "manage-pg-prod.appspot.com",
    messagingSenderId: "1066197951705",
    appId: "1:1066197951705:web:391167fb295baf089d4ac8",
    measurementId: "G-G8NHWNYKQD"
  };

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = getStorage(firebaseApp);


export { auth, db  , storage};