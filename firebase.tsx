// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDm5DgFp_y0-in0o9gnFaz_v3V5yyu3Yxg",
  authDomain: "project-bolt-sb1-xyezlz3-a453a.firebaseapp.com",
  projectId: "project-bolt-sb1-xyezlz3-a453a",
  storageBucket: "project-bolt-sb1-xyezlz3-a453a.firebasestorage.app",
  messagingSenderId: "983468227553",
  appId: "1:983468227553:web:0883275d822d252cf770a0",
  measurementId: "G-N3WQD23DBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
