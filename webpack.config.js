const path = require('path'); // For working with file paths

// Webpack config for development mode 
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack config for production mode
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// Remove files from webpack build folder when webpack is run in production mode
const RemovePlugin = require('remove-files-webpack-plugin');

// Webpack config
module.exports = {
  entry: {
    index: './src/client/index.js',
    style: ['./src/client/styles.scss'],
  },
  mode: 'development', // Mode set to development
  output: {
    filename: '[name].js', // Output file
    path: path.resolve(__dirname, 'dist'), // Output path
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new HtmlWebpackPlugin({
      template: './src/server/views/index.ejs', // Template file for index.ejs file
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css', // Output file name for styles
    }),
    new RemovePlugin({
      after: {
        include: ['./dist/style.js'], // Remove style.js
      },
    })
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
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          esModule: false,
        },
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
    ],
  },
};
