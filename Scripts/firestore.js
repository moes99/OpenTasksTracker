import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  query,
  where,
  Timestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

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
const auth = getAuth(app);

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
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getUserDetails(email) {
  try {
    const q = query(collection(db, "admins"), where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))[0];
  } catch (error) {
    console.error("Error getting user details:", error);
  }
}

export async function verifyUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    const userDetails = await getUserDetails(email);
    return userDetails;
  } catch (error) {
    console.error("Error verifying user credentials:", error);
    throw error;
  }
}

export async function updateCollectionData(collectionName, docId, payload) {
  const docRef = doc(db, collectionName, docId);
  try {
    await updateDoc(docRef, payload);
  } catch (error) {
    alert("Error updating document!");
    console.log(error);
  }
}

export function timestampFromDate(date) {
  return Timestamp.fromDate(date);
}

export async function getFieldValue(
  collectionName,
  docId,
  fieldName1,
  fieldName2 = null,
) {
  const docRef = doc(db, collectionName, docId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    if (fieldName2) {
      return [docSnap.get(fieldName1), docSnap.get(fieldName2)];
    } else {
      return [docSnap.get(fieldName1)];
    }
  } else {
    return null;
  }
}
