const express = require("express");
const session = require("express-session");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const mustacheExpress = require("mustache-express");
const bodyParser = require('body-parser');
const webpackConfig = require("../../webpack.config");
const admin = require('firebase-admin');
const crypto = require('crypto');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const viewsDirectory = path.join(__dirname, "../client/views");
const compiler = webpack(webpackConfig);

// Generate a secure random string for the session secret
const sessionSecret = crypto.randomBytes(32).toString('hex');

// 1. View Engine and Partial Registration
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", viewsDirectory);

// 2. Static Files
app.use(express.static(path.join(__dirname, 'dist')));

// 3. Webpack Middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);

app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());

// 4. Firebase Admin
const getConfigData = require('../../service-account.config');
const initializeFirebase = () => {
  return new Promise((resolve, reject) => {
    getConfigData()
      .then(configData => {
        admin.initializeApp({
          credential: admin.credential.cert(configData),
          databaseURL: "https://gotocart-mobile-app.firebaseio.com",
        });
        resolve();
      })
      .catch(error => {
        // Handle errors from getConfigData
        console.error('Error getting config data:', error);
        reject(error);
      });
  });
};

// 5. Session Middleware
app.use(session({
  secret: sessionSecret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
}));

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Initialize user object if not present
  req.session.user = req.session.user || {};

  // Check if the user is authenticated based on the session
  if (req.session && req.session.user && req.session.user.uid) {
    next();
  } else {
    // User is not authenticated, redirect to login page or handle as needed
    res.redirect('/'); // Adjust the route to your login page
  }
};

// Initialize Firebase, and start the server when initialization is complete
initializeFirebase().then(() => {
  // Handle login form submission
  app.post("/login", bodyParser.urlencoded({ extended: true }), async (req, res) => {
    const { idToken } = req.body;

    try {
      // Verify the ID token
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, email } = decodedToken;

      // Set user in session
      req.session.user = { uid, email };

      // Redirect to dashboard
      res.redirect('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error.message);
      res.status(401).json({ error: 'Authentication failed' });
    }
  });

  // Dashboard page accessible only to authenticated users
  app.get("/dashboard", isAuthenticated, (req, res) => {
    const { email } = req.session.user;

    res.render("dashboard", {
      title: "Dashboard",
      user: { email },
    });
  });

  // Handle logout
  app.post("/logout", (req, res) => {
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
  });

  // Other routes...
  app.get("/", (req, res) => {
    // check if session has user object
    if (req.session && req.session.user && req.session.user.uid) {
      return res.redirect('/dashboard');
    } else {
      res.render("index", {
        title: "Home Page",
      });
    }
  });

  // 6. Server Listening
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(error => {
  console.error('Firebase initialization error:', error);
});
