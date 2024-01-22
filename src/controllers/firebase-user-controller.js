const admin = require("firebase-admin");

const isAuthenticated = (req, res, next) => {
  // Initialize user object if not present
  req.session.user = req.session.user || {};

  // Check if the user is authenticated based on the session
  if (req.session && req.session.user && req.session.user.uid) {
    // User is authenticated
    next();
  } else {
    // User is not authenticated
    res.redirect("/404");
  }
};

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

const dashboard_get = (req, res) => {
  // set cache control
  res.setHeader("Cache-Control", "no-store", "must-revalidate", "private");

  const { email, name } = req.session.user;
  res.render("dashboard", {
    title: "Dashboard",
    user: { email, name },
  });
};

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
