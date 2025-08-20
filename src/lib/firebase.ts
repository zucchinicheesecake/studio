
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  "projectId": "cryptoforge-n2cnl",
  "appId": "1:243178480009:web:e2f0c0eddc3de6768e4158",
  "storageBucket": "cryptoforge-n2cnl.firebasestorage.app",
  "apiKey": "AIzaSyD6ilBhuYAq8JRFHka5bqQw5crnfk3gNzY",
  "authDomain": "cryptoforge-n2cnl.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "243178480009"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
