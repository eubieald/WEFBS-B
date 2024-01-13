const path = require('path'); // For working with file paths

// Webpack config for development mode 
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Webpack config
module.exports = {
  entry: './src/client/index.js', // Entry file
  mode: 'development', // Mode set to development
  output: {
    filename: 'bundle.js', // Output file
    path: path.resolve(__dirname, 'dist'), // Output path
  },
  plugins: [
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    new HtmlWebpackPlugin({
      template: './src/server/views/index.ejs',
    }),
  ],
  module: {
    // Add your rules for custom modules here
    // Learn more about loaders from https://webpack.js.org/loaders/
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          esModule: false,
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
