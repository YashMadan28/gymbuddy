// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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
const analytics = getAnalytics(app);
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCEm3oMuQWcThdP3FIPwNw17yO-SqpY8YE",
  authDomain: "gymbuddy-d7838.firebaseapp.com",
  projectId: "gymbuddy-d7838",
  storageBucket: "gymbuddy-d7838.firebasestorage.app",
  messagingSenderId: "710247929201",
  appId: "1:710247929201:web:94d854ba38680c1f0612d0",
  measurementId: "G-0QFYC13N37"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const storage = getStorage(app);

export { auth, storage };