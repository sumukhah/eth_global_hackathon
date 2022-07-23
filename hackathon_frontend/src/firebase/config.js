// import { initializeApp } from "firebase/app";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA-Pfr_GWE7bB6EJJXDldM3X0AMLFy5lBQ",
  authDomain: "hackathon-project-3ae89.firebaseapp.com",
  projectId: "hackathon-project-3ae89",
  storageBucket: "hackathon-project-3ae89.appspot.com",
  messagingSenderId: "601982175705",
  appId: "1:601982175705:web:bc6876e89b278f47c1f1c8",
  databaseURL: "https://hackathon-project-3ae89-default-rtdb.firebaseio.com",
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

export { firebaseApp, db };
