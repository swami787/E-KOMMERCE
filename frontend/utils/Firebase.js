import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAf8Ev21MRORLaGRm1Bt1IeiTQ729lv7Ig",
  authDomain: "e-commerce-32567.firebaseapp.com",
  projectId: "e-commerce-32567",
  storageBucket: "e-commerce-32567.appspot.com", 
  messagingSenderId: "718486247515",
  appId: "1:718486247515:web:c5faa1d4618e78f967477e",
  measurementId: "G-K31FPGBF6S"
};                                     

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // Use named export