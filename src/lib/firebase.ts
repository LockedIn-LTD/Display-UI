import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSy4ZfKg6GK4AIgw0LPAaXJtJAVY-swml",
  authDomain: "drivesense-c1d4c.firebaseapp.com",
  databaseURL: "https://drivesense-c1d4c-default-rtdb.firebaseio.com",
  projectId: "drivesense-c1d4c",
  storageBucket: "drivesense-c1d4c.appspot.com",
  messagingSenderId: "827471724073",
  appId: "1:827471724073:web:938ae6bc117be2e2f16638",
  measurementId: "G-XNTKMGSQ86"
};

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
