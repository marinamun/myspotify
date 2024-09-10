// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCoZ6wYmY1cGjIZFI-nf6kZH2mXhjMqHA4",
  authDomain: "myspotify-55490.firebaseapp.com",
  projectId: "myspotify-55490",
  storageBucket: "myspotify-55490.appspot.com",
  messagingSenderId: "189992692770",
  appId: "1:189992692770:web:48d88ed7802489d776ee7b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase Authentication so you can use it in sign up page
const auth = getAuth(app);
export { auth };
