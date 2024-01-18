import showToast from "../components/toast"; // Import showToast as the default export

// Firebase imports
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
  updateProfile,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from "firebase/auth";

import firebaseConfig from "@firebase.config";
// console.log(firebaseConfig);

const app = initializeApp(firebaseConfig);

// init services
const db = getFirestore();
const auth = getAuth();

document.addEventListener("DOMContentLoaded", function () {
  // form submit
  const loginForm = document.querySelector("#login-form");
  const registrationForm = document.querySelector("#registration-form");

  // login form submit handler function for firebase auth
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault(); // prevent form from submitting
    const email = loginForm.email.value; // get email value from form
    const password = loginForm.password.value; // get password value from form

    // /**
    //  * Validates if the given email is a valid email address.
    //  *
    //  * @param {string} email - The email address to be validated.
    //  * @return {boolean} Returns true if the email is valid, otherwise returns false.
    //  */
    // const isValidEmail = (email) => {
    //   return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    // };

    // if (!isValidEmail(email)) {
    //   console.error("Invalid email format"); // You can display an error message to the user or prevent form submission
    //   return;
    // }

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
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ idToken }),
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

  // registration form submit handler function for firebase auth
  registrationForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = registrationForm.email.value;
    const password = registrationForm.password.value;
    const name = registrationForm.name.value;

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // Check if the user object is available before updating profile
      if (user) {
        await updateProfile(user, {
          displayName: name,
        });

        // Reset the form
        registrationForm.reset();
        showToast("Registration Successful", "success");
      } else {
        throw new Error("User object not available");
      }
    } catch (error) {
      // Handle specific error codes or display a generic message
      console.error("Registration error:", error.message);
    }
  });
});
