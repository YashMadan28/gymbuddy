// Import the functions you need from the SDKs you need
/*import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAGDcdCmfPfGNXHIrU-LRp9Va3WI0TgrZg",
  authDomain: "gymbuddy-ca4a6.firebaseapp.com",
  projectId: "gymbuddy-ca4a6",
  storageBucket: "gymbuddy-ca4a6.firebasestorage.app",
  messagingSenderId: "289045757663",
  appId: "1:289045757663:web:55884ab02651f2e679736a",
  measurementId: "G-XPL3B624S4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);*/
// Import necessary Firebase modules
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAGDcdCmfPfGNXHIrU-LRp9Va3WI0TgrZg",
  authDomain: "gymbuddy-ca4a6.firebaseapp.com",
  projectId: "gymbuddy-ca4a6",
  storageBucket: "gymbuddy-ca4a6.appspot.com", // Fix incorrect domain
  messagingSenderId: "289045757663",
  appId: "1:289045757663:web:55884ab02651f2e679736a",
  measurementId: "G-XPL3B624S4" // Can be removed if not using Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app); // Authentication
export const db = getFirestore(app); // Firestore Database
export const storage = getStorage(app); // Storage for profile images

export default app;
