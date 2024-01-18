const path = require("path"); // For working with file paths

const webpack = require("webpack"); // Webpack module

// Webpack config for development mode
const HtmlWebpackPlugin = require("html-webpack-plugin");

// Webpack config for production mode
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Remove files from webpack build folder when webpack is run in production mode
const RemovePlugin = require("remove-files-webpack-plugin");

// const dotenv = require('dotenv');
// Load environment variables from .env file
// dotenv.config();

const Dotenv = require("dotenv-webpack");

// Webpack config
module.exports = {
  entry: {
    index: ["webpack-hot-middleware/client", "./src/client/js/index.js"],
    style: ["./src/client/scss/theme.scss"],
  },
  mode: "development", // Mode set to development
  output: {
    filename: "[name].js", // Output file
    path: path.resolve(__dirname, "dist"), // Output path
  },
  resolve: {
    // fallback: {
    //   buffer: require.resolve('buffer/'),
    //   path: require.resolve("path-browserify"),
    //   os: require.resolve("os-browserify/browser"),
    //   crypto: require.resolve("crypto-browserify"),
    // },
    fallback: {
      fs: false, // Exclude 'fs' module
      "path": require.resolve("path-browserify"),
    },
    alias: {
      // Ensure there is an alias for 'firebase-config' pointing to the correct file
      "@firebase.config": path.resolve(__dirname, "firebase.config.js"),
    },
  },
  plugins: [
    // Add your plugins here
    // Environment Variables
    new Dotenv(),
    // new webpack.DefinePlugin({
    //   'process.env': {
    //     FIREBASE_API_KEY: JSON.stringify(config.FIREBASE_API_KEY),
    //     FIREBASE_AUTH_DOMAIN: JSON.stringify(config.FIREBASE_AUTH_DOMAIN),
    //     FIREBASE_STORAGE_BUCKET: JSON.stringify(config.FIREBASE_STORAGE_BUCKET),
    //     FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(config.FIREBASE_MESSAGING_SENDER_ID),
    //     FIREBASE_APP_ID: JSON.stringify(config.FIREBASE_APP_ID),
    //     FIREBASE_TYPE: JSON.stringify(config.FIREBASE_TYPE),
    //     FIREBASE_PROJECT_ID: JSON.stringify(config.FIREBASE_PROJECT_ID),
    //     FIREBASE_PRIVATE_KEY_ID: JSON.stringify(config.FIREBASE_PRIVATE_KEY_ID),
    //     FIREBASE_PRIVATE_KEY: JSON.stringify(config.FIREBASE_PRIVATE_KEY),
    //     FIREBASE_CLIENT_EMAIL: JSON.stringify(config.FIREBASE_CLIENT_EMAIL),
    //     FIREBASE_CLIENT_ID: JSON.stringify(config.FIREBASE_CLIENT_ID),
    //     FIREBASE_AUTH_URI: JSON.stringify(config.FIREBASE_AUTH_URI),
    //     FIREBASE_TOKEN_URI: JSON.stringify(config.FIREBASE_TOKEN_URI),
    //     FIREBASE_AUTH_PROVIDER_X509_CERT_URL: JSON.stringify(config.FIREBASE_AUTH_PROVIDER_X509_CERT_URL),
    //     FIREBASE_CLIENT_X509_CERT_URL: JSON.stringify(config.FIREBASE_CLIENT_X509_CERT_URL),
    //     UNIVERSE_DOMAIN: JSON.stringify(config.UNIVERSE_DOMAIN),
    //   },
    // }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
    new RemovePlugin({
      before: {
        include: ["./dist/style.js"],
      },
      after: {
        include: ["./dist/style.js"], // Remove style.js
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  module: {
    // Add your rules for custom modules here
    // Learn more about loaders from https://webpack.js.org/loaders/
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], // Use MiniCssExtractPlugin.loader and css-loader
      },
      {
        test: /\.js$/, // Apply Babel to all .js files
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images",
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ["html-loader"],
      },
    ],
  },
};
