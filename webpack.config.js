const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  entry: {
    main: path.resolve(process.cwd(), "src", "main.js"),
  },
  output: {
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "/",
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 500,
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(process.cwd(), "public", "index.html"),
    }),
  ],
};
