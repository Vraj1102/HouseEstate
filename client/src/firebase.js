// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realestate-59d0e.firebaseapp.com",
  projectId: "mern-realestate-59d0e",
  storageBucket: "mern-realestate-59d0e.appspot.com",
  messagingSenderId: "922486067136",
  appId: "1:922486067136:web:c62f691fa9d607c1ee0225",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
