import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyASKWlUrYf2iAKEn16GAPQe_bzX8znWxoI",
  authDomain: "db-sistema-gestor.firebaseapp.com",
  projectId: "db-sistema-gestor",
  storageBucket: "db-sistema-gestor.appspot.com",
  messagingSenderId: "608726909500",
  appId: "1:608726909500:web:c8485eb3fcf55da1573939"
};

// Initialize Firebase
initializeApp(firebaseConfig);  
const auth = getAuth();
const db = getFirestore();
const storage = getStorage()

const creacionUsuariosApp = initializeApp(firebaseConfig, "CreacionUsuarios");  // para crear usuarios sin logearse 
const authCreacion = getAuth(creacionUsuariosApp);

export { auth, db, storage, creacionUsuariosApp, authCreacion};