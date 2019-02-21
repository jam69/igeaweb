const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    "main": [
      "./src/index.js"
    ],
    "scripts": [
      "script-loader!./node_modules\\leaflet\\dist\\leaflet.js",
      "script-loader!./node_modules\\leaflet.pm\\dist\\leaflet.pm.min.js",
      "script-loader!./node_modules\\osmbuildings\\dist\\OSMBuildings-Leaflet.js",
      "script-loader!./node_modules\\jquery\\dist\\jquery.min.js"
    ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader" 
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader",
            options: { minimize: false }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
    new ProgressPlugin(),
    new CopyWebpackPlugin([
      { from: 'src/assets' }
    ]),

  ]
};