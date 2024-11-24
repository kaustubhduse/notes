// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkfymF-k5Ln0L4IZpqIpG6N0TpZ7bREG4",
    authDomain: "news-portal-a90d8.firebaseapp.com",
    projectId: "news-portal-a90d8",
    storageBucket: "news-portal-a90d8.firebasestorage.app",
    messagingSenderId: "575053126526",
    appId: "1:575053126526:web:fbe3eea68e02fa83b6312f",
    measurementId: "G-4ZDVBGFTJH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
