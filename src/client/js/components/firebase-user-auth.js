import {
  registerUser,
  loginUser,
  resetUserPassword,
} from "../../../models/firebase-user-model";

import showToastNotification from "./toast"; // Import showToast as the default export

// Event Handlers
document.addEventListener("DOMContentLoaded", function () {
  // Register a new user
  try {
    const registrationForm = document.getElementById("registration-form");

    registrationForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      const email = registrationForm.email.value,
        password = registrationForm.password.value,
        name = registrationForm.name.value,
        registeredUser = await registerUser(email, password, name);

      if (registeredUser.displayName) {
        showToastNotification(
          `Registration Successful for user: ${registeredUser.displayName}`,
          "success"
        );
      }
    });
  } catch (error) {
    showToastNotification(error, "error");
    throw error;
  }

  // Login a user
  try {
    // form submit
    const loginForm = document.querySelector("#login-form");

    // login form submit handler function for firebase auth
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const email = loginForm.email.value,
        password = loginForm.password.value; // get password value from form

      // const csrfToken = loginForm.csrfToken.value; // Todo: Add CSRF token

      authenticateUser(email, password)
        .then(() => {
          // Handle success
          window.location.href = "/dashboard";
        })
        .catch((error) => {
          showToastNotification(error, "error");
          throw error;
        });
    });
  } catch (error) {
    showToastNotification(error, "error");
    throw error;
  }
});

// Reset user password
const forgotPasswordEl = document.querySelector(".forgot-password");
forgotPasswordEl.addEventListener("click", async (e) => {
  e.preventDefault();
  const loginForm = document.querySelector("#login-form"),
    email = loginForm.email.value;
    await resetUserPassword(email);
});

// FUNCTIONS

/**
 * Authenticates a user using email and password.
 *
 * @param {string} email - The user's email address
 * @param {string} password - The user's password
 * @return {Promise} A promise that resolves with a success message or rejects with an error message
 */
function authenticateUser(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      // Use Firebase Authentication to sign in and get the ID token
      const loggedinUser = await loginUser(email, password);
      const idToken = await loggedinUser.getIdToken();

      // Send the ID token to the server for verification
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // "X-CSRF-Token": csrfToken, // Add the CSRF token
        },
        body: JSON.stringify({ idToken }),
      });

      if (response.ok) {
        window.history.replaceState(null, null, "/dashboard");
        window.location.replace("/dashboard");
        resolve("Authentication successful");
      } else {
        showToastNotification("Authentication failed", "error");
        reject("Authentication failed");
      }
    } catch (error) {
      showToastNotification(error, "error");
      reject(error);
    }
  });
}
