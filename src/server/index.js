// Filesystem related imports
const path = require("path");

// Express related imports for server
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Body Parser imports
const bodyParser = require("body-parser");

// Webpack Related imports
const webpack = require("webpack");
const webpackConfig = require("../../webpack.config");
const compiler = webpack(webpackConfig);
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

// Firebase Admin Initialization imports
const admin = require("firebase-admin");

// Template Engine related imports
const mustacheExpress = require("mustache-express");
const viewsDirectory = path.join(__dirname, "../views");

// Session Related import
const session = require("express-session");
const crypto = require("crypto");
const sessionSecret = crypto.randomBytes(32).toString("hex");

// User Routes Import
const userRoutes = require("../routes/user-route");

// CSRF related imports
const cookieParser = require("cookie-parser");

// Date related imports
const moment = require('moment');

// 1. View Engine and Partial Registration
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", viewsDirectory);

// 2. Static Files
app.use(express.static(path.join(__dirname, "dist")));

// 3.  Middleware
// Todo: CSRF Middleware Protection
app.use(cookieParser());


// Webpack Middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);
app.use(webpackHotMiddleware(compiler));
app.use(bodyParser.json());

// Session Middleware
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Set Global Variables available to templates
app.use((req, res, next) => {
  res.locals.copyrightYear = moment().year();
  next();
});

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

// 5. Initialize Firebase, and start the server when initialization is complete
initializeFirebase()
  .then(() => {
    // Register User Routes
    app.use(userRoutes);

    app.get("/", (req, res) => {

      //Todo: CSRF Token
      // const csrfToken = res.locals.csrfToken;
      // console.log('from server / csrfToken', csrfToken);
      // console.log('to be passed to template', csrfToken);

      // check if session has user object
      if (req.session && req.session.user && req.session.user.uid) {
        res.redirect("/dashboard");
      } else {
        res.render("index", {
          title: "Home Page",
                    // csrfToken, // Add the CSRF token
        });
      }
    });

    app.get("/about", (req, res) => {
      res.render("about", {
        title: "About Page",
      });
    });

    app.get("/page-not-found", (req, res) => {
      let goBackUrl = getBackUrl(req.session);

      res.status(404).render("404", {
        title: "404",
        message: "Page Not Found",
        goBackUrl,
      });
    })

    app.use((req, res) => {
      let goBackUrl = getBackUrl(req.session);

      res.status(404).render("404", {
        title: "404",
        message: "Page Not Found",
        goBackUrl
      });
    });
  })
  .catch((error) => {
    console.error("Firebase initialization error:", error);
  });

  const getBackUrl = (session) => {
    if (session && session.user && session.user.uid) {
      return "/dashboard";
    } else {
      return "/";
    }
  }

// 6. Server Listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
