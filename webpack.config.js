var path = require("path");

var DIST_DIR = path.join(__dirname, "dist"),
  CLIENT_DIR = path.join(__dirname, "src");

module.exports = {
  context: CLIENT_DIR,

  entry: "./main.js",

  output: {
    path: DIST_DIR,
    filename: "bundle.js"
  },

  resolve: {
    extensions: [".js"]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  }
};
