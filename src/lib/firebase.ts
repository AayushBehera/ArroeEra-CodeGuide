import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, User } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore";

// Read from firebase-applet-config or use defaults
const firebaseConfig = {
  apiKey: "AIzaSyBVwHOjAf3V_sAc3W_M_2DAzM3hUKGuDhE",
  authDomain: "trusty-unfolding-ggtt6.firebaseapp.com",
  projectId: "trusty-unfolding-ggtt6",
  storageBucket: "trusty-unfolding-ggtt6.firebasestorage.app",
  messagingSenderId: "550476560306",
  appId: "1:550476560306:web:6b8891c88fa86b2edad6ab"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Custom databaseId for the provisioned Firestore
export const db = getFirestore(app, "ai-studio-arroweracodeguid-6c997ddd-3027-4978-99a2-b08ec1540a51");

// Helper function to sign in with Google Popup
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

// Helper function to sign out
export async function logout() {
  await signOut(auth);
}
