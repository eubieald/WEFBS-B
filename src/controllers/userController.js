const admin = require('firebase-admin');

const isAuthenticated = (req, res, next) => {
  // Initialize user object if not present
  req.session.user = req.session.user || {};

  // Check if the user is authenticated based on the session
  if (req.session && req.session.user && req.session.user.uid) {
    next();
  } else {
    // Redirect to page not found
    res.redirect('/page-not-found');
  }
};

const login_post = async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name } = decodedToken;

    console.log(decodedToken);

    // Set user in session
    req.session.user = { uid, email, name };

    // Redirect to dashboard
    res.redirect('/dashboard');
  } catch (error) {
    console.error('Authentication error:', error.message);
    res.status(401).json({ error: 'Authentication failed' });
  }
};

const dashboard_get = (req, res) => {
  const { email, name } = req.session.user;
  res.render('dashboard', {
    title: 'Dashboard',
    user: { email, name },
  });
};

const logout_get = (req, res) => {
  // Destroy the session
  req.session.destroy(err => {
    if (err) {
      console.error('Error destroying session:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      // Redirect to the home page or any other page after logout
      res.redirect('/');
    }
  });
};

module.exports = { login_post, dashboard_get, logout_get, isAuthenticated };
