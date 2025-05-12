import firebase from "firebase/compat/app";
import "firebase/compat/storage";

// Set the configuration for your app
// TODO: Replace with your app's config object
const firebaseConfig = {
  apiKey: "AIzaSyBm1_hTE01B9auBam8sfIIiKfeZIWRemiw",
  authDomain: "mit-web-app-93f89.firebaseapp.com",
  projectId: "mit-web-app-93f89",
  storageBucket: "mit-web-app-93f89.appspot.com",
  messagingSenderId: "894115628022",
  appId: "1:894115628022:web:de734aeb0570bbc5e07dd7",
  measurementId: "G-PXP3Y5MKFM",
};
firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
