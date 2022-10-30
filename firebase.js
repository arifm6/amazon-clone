import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyDMzQ3Qn4cW8N0Nsf9Y09IB8AkVDmdlWFw",
  authDomain: "clone-93215.firebaseapp.com",
  projectId: "clone-93215",
  storageBucket: "clone-93215.appspot.com",
  messagingSenderId: "756304059142",
  appId: "1:756304059142:web:1468e2c70a12e1b0c31c87",
};

const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(getApp);

export default db;
