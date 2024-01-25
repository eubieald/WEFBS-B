// model/firebaseUserModel.js
import { initializeApp, FirebaseError } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

import firebaseConfig from "@firebase.config";
import showToastNotification from "../client/js/components/toast";

const app = initializeApp(firebaseConfig);
const auth = getAuth();

/**
 * Registers a new user with the provided email, password, and name.
 *
 * @param {string} email - The email of the user
 * @param {string} password - The password of the user
 * @param {string} name - The name of the user
 * @return {Promise<User | Error>} The user object if registration is successful, or an error if not
 */
export const registerUser = async (email, password, name) => {
  try {
    const response = await createUserWithEmailAndPassword(auth, email, password);

    // Assuming you have successfully obtained the user from the response
    const user = response.user;

    // Additional logic, if needed
    await updateProfile(user, { displayName: name });
    return user; // Return the user if registration is successful
  } catch (error) {
    error = getErrorMessage(error);
    showToastNotification(error, "error");
    throw error; // Re-throw the error to propagate it to the caller or handle it as needed
  }
};

/**
 * Asynchronously logs in a user with the given email and password.
 *
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @return {Promise<User>} The logged in user
 */
export const loginUser = async (email, password) => {
  try {
    const response = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return response.user;
  } catch (error) {
    error = getErrorMessage(error);
    showToastNotification(error, "error");
    throw error;
  }
};

export const resetUserPassword = async (email) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      showToastNotification("Password reset email sent", "success");
    })
    .catch((error) => {
      error = getErrorMessage(error);
      showToastNotification(error, "error");
      throw error;
    })
}

/**
 * Get error message from Firebase error or return the error itself.
 *
 * @param {any} error - the error to retrieve the message from
 * @return {string} the error message without the "firebase: " prefix if it is a FirebaseError, otherwise the error itself
 */
export const getErrorMessage = (error) => {
  if (error instanceof FirebaseError) {
    return error.message.replace(/^firebase:\s*/i, "");
  } else {
    return error;
  }
};
