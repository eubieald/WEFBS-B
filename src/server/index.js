const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");
const webpackConfig = require("../../webpack.config");

const app = express();
const PORT = process.env.PORT || 3000;
const viewsDirectory = path.join(__dirname, "../client/views");
const compiler = webpack(webpackConfig);

// 1. Static Files
app.use(express.static(path.join(__dirname, 'dist')));

// 2. Webpack Middleware
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
  })
);

app.use(webpackHotMiddleware(compiler));

// 3. View Engine and Partial Registration
app.engine("html", mustacheExpress());
app.set("view engine", "html");
app.set("views", viewsDirectory);

app.use((req, res, next)=>{
  res.locals.copyrightYear = new Date().getFullYear();
  next();
});

// 4. Route Handlers
app.get('/', (req, res) => {
  res.render("index", {
    title: "Home Page",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "About Page",
  });
});

// 5. Server Listening
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
