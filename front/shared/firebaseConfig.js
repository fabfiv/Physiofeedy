import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyApUymmN81W5T451s_DgrkE4ZTCEjXl3Dw",
  authDomain: "fab5-ac7a5.firebaseapp.com",
  projectId: "fab5-ac7a5",
  storageBucket: "fab5-ac7a5.appspot.com",
  messagingSenderId: "582138176802",
  appId: "1:582138176802:web:3f68988a17936a0a56f17b",
  measurementId: "G-XTTJ09BESN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export { app, auth, provider, db };
