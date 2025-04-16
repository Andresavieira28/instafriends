// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyCVd8Lsq0n0IOj_R2TGO7cI_2UF28kfCAc",
    authDomain: "fir-f5fa1.firebaseapp.com",
    projectId: "fir-f5fa1",
    storageBucket: "fir-f5fa1.firebasestorage.app",
    messagingSenderId: "230024673274",
    appId: "1:230024673274:web:f6371ef4274cf8a44c9643",
    measurementId: "G-EQG8Y8HMCM"
};

const app = initializeApp(firebaseConfig); // <- esta é a variável que precisa ser exportada

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// Adicione esta linha 👇
export { app, auth, provider, db, storage };
