// ── Replace these values with your Firebase project config ──
// After creating your project at https://console.firebase.google.com,
// go to Project Settings → Your apps → SDK setup and configuration → Config
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDAl6JUUDLatIbUau9_OKej31DdzfOm-zg",
  authDomain: "erik-praznici.firebaseapp.com",
  projectId: "erik-praznici",
  storageBucket: "erik-praznici.firebasestorage.app",
  messagingSenderId: "759943349398",
  appId: "1:759943349398:web:5cae1fe2b9a5f5886d6eb7"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
