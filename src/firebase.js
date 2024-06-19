// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "nestquest-4e001.firebaseapp.com",
  projectId: "nestquest-4e001",
  storageBucket: "nestquest-4e001.appspot.com",
  messagingSenderId: "860063126333",
  appId: "1:860063126333:web:e3a70571dafdb0884d6b54"
};

// Initialize Firebase
 export const app = initializeApp(firebaseConfig);