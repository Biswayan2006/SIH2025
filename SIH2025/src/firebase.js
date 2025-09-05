// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTUiv6lPVzexbBhqtPT9aILJ2BzEDdVHo",
  authDomain: "sih2025-19881.firebaseapp.com",
  projectId: "sih2025-19881",
  storageBucket: "sih2025-19881.appspot.com",
  messagingSenderId: "577288280016",
  appId: "1:577288280016:web:fd567117fc10d1f79e8bd5"
  // measurementId: "G-8LPV8PRM5W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Cloud Storage and get a reference to the service
export const storage = getStorage(app);