const express = require("express");
const session = require("express-session");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const webpackConfig = require("../../webpack.config");
const admin = require("firebase-admin");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 3000;
const viewsDirectory = path.join(__dirname, "../client/views");
const compiler = webpack(webpackConfig);

const userRoutes = require("../routes/userRoutes");

// Generate a secure random string for the session secret
const sessionSecret = crypto.randomBytes(32).toString("hex");

// 1. View Engine and Partial Registration
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", viewsDirectory);

// 2. Static Files
app.use(express.static(path.join(__dirname, "dist")));

// 3. Webpack Middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);

app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());

// 4. Firebase Admin Initialization
const getConfigData = require("../../service-account.config");
const initializeFirebase = () => {
  return new Promise((resolve, reject) => {
    getConfigData()
      .then((configData) => {
        admin.initializeApp({
          credential: admin.credential.cert(configData),
          databaseURL: "https://gotocart-mobile-app.firebaseio.com",
        });
        resolve();
      })
      .catch((error) => {
        // Handle errors from getConfigData
        console.error("Error getting config data:", error);
        reject(error);
      });
  });
};

// 5. Session Middleware
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use((req, res, next) => {
  res.locals.copyrightYear = new Date().getFullYear();
  next();
});

// Initialize Firebase, and start the server when initialization is complete
initializeFirebase()
  .then(() => {
    // 7. User Routes
    app.use(userRoutes);

    app.get("/", (req, res) => {
      // check if session has user object
      if (req.session && req.session.user && req.session.user.uid) {
        return res.redirect("/dashboard");
      } else {
        res.render("index", {
          title: "Home Page",
        });
      }
    });

    // Other routes...

    app.get("/about", (req, res) => {
      res.render("about", {
        title: "About Page",
      });
    });

    app.get("/page-not-found", (req, res, next) => {
      res.status(404).render("404", {
        title: "404",
        message: "Page Not Found",
      });
    });

    app.use((req, res) => {
      res.status(404).render("404", {
        title: "404",
        message: "Page Not Found",
      });
    });
  })
  .catch((error) => {
    console.error("Firebase initialization error:", error);
  });

// 6. Server Listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
