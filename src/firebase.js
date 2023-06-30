// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhMpX5wwrdiFpoam9b2AdEu4TZgBXnrrk",
  authDomain: "instagramclone-1bc76.firebaseapp.com",
  databaseURL: "https://instagramclone-1bc76.firebaseio.com",
  projectId: "instagramclone-1bc76",
  storageBucket: "instagramclone-1bc76.appspot.com",
  messagingSenderId: "494988376475",
  appId: "1:494988376475:web:5f0306f08b5bf932ca893e",
  measurementId: "G-06DX0ZSN83",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const storage = getStorage(app);

export { db, auth, storage };
