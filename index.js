let express = require("express"); // For working with express
let app = express(); // Create an express app

let webpack = require("webpack"); // For working with webpack
let webpackDevMiddleware = require("webpack-dev-middleware"); // For working with webpack dev

let webpackConfig = require("./webpack.config"); // For working with webpack config 
let webpackCompiler = webpack(webpackConfig); // Compile webpack
let webpackDevMiddlewareOptions = {
  publicPath: webpackConfig.output.publicPath // Set public path
};

// Set up webpack dev middleware 
app.use(webpackDevMiddleware(webpackCompiler, webpackDevMiddlewareOptions));

// Set up webpack hot middleware 
let port = process.env.PORT || 3000;

// Set up express server and listen on port 3000
app.listen(port, () => console.log(`App listening on ${port}`));
