const path = require('path'); // For working with file paths

const webpack = require('webpack'); // Webpack module

// Webpack config for development mode 
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack config for production mode
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Remove files from webpack build folder when webpack is run in production mode
const RemovePlugin = require('remove-files-webpack-plugin');

// Webpack config
module.exports = {
  entry: {
    index: ['webpack-hot-middleware/client', './src/client/js/index.js'],
    style: ['./src/client/scss/theme.scss'],
  },
  mode: 'development', // Mode set to development
  output: {
    filename: '[name].js', // Output file
    path: path.resolve(__dirname, 'dist'), // Output path
  },
  plugins: [
    // Add your plugins here
    // new HtmlWebpackPlugin({
    //   template: './src/client/views/index.html',
    //   filename: 'index.html', // Output file name in the dist folder
    // }),
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new RemovePlugin({
      before: {
        include: ['./dist/style.js'],
      },
      after: {
        include: ['./dist/style.js'], // Remove style.js
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
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'], // Use MiniCssExtractPlugin.loader and css-loader
      },
      {
        test: /\.js$/, // Apply Babel to all .js files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images',
            },
          },
        ],
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      }
    ],
  },
};
