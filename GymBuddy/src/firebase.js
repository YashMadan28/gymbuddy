import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);