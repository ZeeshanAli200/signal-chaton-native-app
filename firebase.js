import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  setDoc,
  onSnapshot,
  serverTimestamp,
  doc,
  query,
  orderBy,where,
  updateDoc,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwD1wM3i9Rsgw0kCLZgMofchbMJU-J430",
  authDomain: "signal-clone-nativeapp.firebaseapp.com",
  projectId: "signal-clone-nativeapp",
  storageBucket: "signal-clone-nativeapp.appspot.com",
  messagingSenderId: "673828062835",
  appId: "1:673828062835:web:aab670356e6cd8598bcc06",
  measurementId: "G-ZW6ZR5GM9K",
};
let app;

// if (getApps()?.length === 0) {
//   console.log("app", app);
//   app = initializeApp(firebaseConfig);
// }
app = initializeApp(firebaseConfig);
//  else {
//   app = getApp('signal-app');
// }

// const db = app.firestore();
const auth = getAuth(app);
const db = getFirestore(app);
export {
  auth,
  db,
  addDoc,
  onSnapshot,
  serverTimestamp,
  collection,
  setDoc,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  doc,
  query,
  orderBy,
  updateDoc,where
};
