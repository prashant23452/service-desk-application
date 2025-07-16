// Import functions from Firebase SDK
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// ✅ Your Firebase config from Firebase Console
const firebaseConfig = {
   apiKey: "AIzaSyDtaiWa0XMHfMbclmO4KHg_GX0iZ0JL6mk",
  authDomain: "servicedesk-ffb3d.firebaseapp.com",
  projectId: "servicedesk-ffb3d",
  storageBucket: "servicedesk-ffb3d.firebasestorage.app",
  messagingSenderId: "578062379364",
  appId: "1:578062379364:web:640c6b5f953480464d3271",
  measurementId: "G-33YFMPYT23"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export instances
export const auth = getAuth(app);
export const db = getFirestore(app);
