const admin = require("firebase-admin");

/**
 * Check if the user is authenticated based on the session.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 * @return {void} 
 */
const isAuthenticated = (req, res, next) => {
  // Initialize user object if not present
  req.session.user = req.session.user || {};

  // Check if the user is authenticated based on the session
  if (req.session && req.session.user && req.session.user.uid) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    res.redirect("/page-not-found");
  }
};

/**
 * Handles the POST request for user login. Verifies the CSRF token and ID token,
 * sets the user in the session, and redirects to the dashboard upon successful
 * authentication. Handles authentication errors by returning an error response.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {Promise<void>} - A promise that resolves when the function completes
 */
const login_post = async (req, res) => {
  const { idToken } = req.body;

  // Todo: Add csrf
  // Verify the CSRF token
  // if (!csrfToken || csrfToken !== res.locals.csrfToken) {
  //   return res.status(403).send('CSRF token verification failed');
  // }

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    // Set user in session
    req.session.user = { uid, email, name };

    // Redirect to dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Authentication error:", error.message);
    res.status(401).json({ error: "Authentication failed" });
  }
};

/**
 * Get dashboard data and render the dashboard page.
 *
 * @param {object} req - the request object
 * @param {object} res - the response object
 * @return {void} 
 */
const dashboard_get = (req, res) => {
  // set cache control
  res.setHeader("Cache-Control", "no-store", "must-revalidate", "private");

  const { email, name } = req.session.user;
  res.render("dashboard", {
    title: "dashboard",
    user: { email, name },
  });
};

/**
 * Destroy the session.
 *
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @return {undefined} No return value
 */
const logout_post = (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.status(500).send("Error logging out");
    } else {
      res.redirect("/");
    }
  });
};

module.exports = { login_post, dashboard_get, logout_post, isAuthenticated };
