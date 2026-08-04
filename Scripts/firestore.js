import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

// Replace these values with your Firebase project config.
const firebaseConfig = {
  apiKey: "AIzaSyDw4yyN_W7LEZBieLeot7t_0AcaVeLxJgU",
  authDomain: "opentaskstracker.firebaseapp.com",
  projectId: "opentaskstracker",
  storageBucket: "opentaskstracker.firebasestorage.app",
  messagingSenderId: "588343222325",
  appId: "1:588343222325:web:9eba9c51b6ee4b93e4517c",
  measurementId: "G-VS4Q20795X",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "maindb");

export { db };

export async function getCollectionData(collectionName) {
  try {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);

    if (snapshot.empty) {
      console.log(`No documents found in collection: ${collectionName}`);
      return [];
    }

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching Firestore data:", error);
    throw error;
  }
}

export async function verifyUser(name, password) {
  try {
    const queryResult = await query(
      collection(db, "admins"),
      where("name", "==", name),
      where("password", "==", password),
    );
    const snapshot = await getDocs(queryResult);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return data[0];
  } catch (error) {
    console.error("Error verifying user:", error);
    throw error;
  }
}
