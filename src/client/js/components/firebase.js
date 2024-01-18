import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import firebaseConfig from "@firebase.config";
// console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore(app);
const auth = getAuth(app);

document.addEventListener("DOMContentLoaded", function () {
  // form submit
  const form = document.querySelector("#login-form");

  // login form submit handler function for firebase auth
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent form from submitting
    const email = form.email.value; // get email value from form
    const password = form.password.value; // get password value from form

    /**
     * Validates if the given email is a valid email address.
     *
     * @param {string} email - The email address to be validated.
     * @return {boolean} Returns true if the email is valid, otherwise returns false.
     */
    const isValidEmail = (email) => {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    if (!isValidEmail(email)) {
      console.error("Invalid email format"); // You can display an error message to the user or prevent form submission
      return;
    }

    function authenticateUser(email, password) {
      return new Promise(async (resolve, reject) => {
        try {
          // Use Firebase Authentication to sign in and get the ID token
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const idToken = await userCredential.user.getIdToken();
    
          // Send the ID token to the server for verification
          const response = await fetch("/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `idToken=${idToken}`,
          });
    
          if (response.ok) {
            console.log("Authentication successful");
            resolve("Authentication successful");
          } else {
            console.error("Authentication failed");
            reject("Authentication failed");
          }
        } catch (error) {
          console.error("Authentication error:", error.message);
          reject(error.message);
        }
      });
    }
    
    authenticateUser(email, password)
      .then(() => {
        // Handle success
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      });
    

  });
});
