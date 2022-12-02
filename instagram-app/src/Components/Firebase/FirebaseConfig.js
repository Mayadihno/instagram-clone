import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAXQLKupDm5pgOVVitm7E1CJHvqjsDJJu4",
  authDomain: "react-instagram-clone-d9ab0.firebaseapp.com",
  projectId: "react-instagram-clone-d9ab0",
  storageBucket: "react-instagram-clone-d9ab0.appspot.com",
  messagingSenderId: "524836628300",
  appId: "1:524836628300:web:4a465e557fd03ad4c1d1e9",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage(app);
