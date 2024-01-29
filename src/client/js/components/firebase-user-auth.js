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
        name = registrationForm.name.value;

      if (!name) {
        showToastNotification("Name field is required", "error");
        return;
      }

      const registeredUser = await registerUser(email, password, name);

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

  try {
    const response = await resetUserPassword(email);

    if (response.success) {
      showToastNotification(response.message, "success");
    } else {
      const errorMessage = response.errorMessage;
      showToastNotification(errorMessage, "error");
    }
  } catch (error) {
    throw error;
  }
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
      const { success, user, error } = await loginUser(email, password);

      if (success) {
        // Send the ID token to the server for verification
        user
          .getIdToken()
          .then((idToken) => {
            // Add the ID token to the request
            const loginPostResponse = fetch("/login", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                // "X-CSRF-Token": csrfToken, // Add the CSRF token
              },
              body: JSON.stringify({ idToken }),
            });

            if (loginPostResponse) {
              window.history.replaceState(null, null, "/dashboard");
              window.location.replace("/dashboard");
              resolve("Authentication successful");
            } else {
              showToastNotification(error, "error");
              reject(error);
            }
          })
          .catch((error) => {
            showToastNotification(error, "error");
            reject(error);
          });
      } else {
        return reject(error);
      }
    } catch (error) {
      return reject(error);
    }
  });
}
