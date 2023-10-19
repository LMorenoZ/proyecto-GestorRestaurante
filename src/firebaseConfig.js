import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXJoKG6sjrWdQc_UsPuDYq1rUN0GEsOvo",
  authDomain: "db-sistema-pupuseria.firebaseapp.com",
  projectId: "db-sistema-pupuseria",
  storageBucket: "db-sistema-pupuseria.appspot.com",
  messagingSenderId: "979871408805",
  appId: "1:979871408805:web:9d298f0c8d7be28ffda34c"
};

// Initialize Firebase
initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

export { auth, db };