const path = require("path")
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: "development",
  entry: "./src/map.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  externals: {
    L: "L",
  },
  context: path.join(__dirname, ''),
  plugins: [
      new CopyWebpackPlugin({
          patterns: [
              { from: 'static' }
          ]
      }),
      new HtmlWebpackPlugin({
        title: 'Map',
        template: './src/map.html',
        inject: 'body'
      })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    compress: true,
    port: 8003,
  },
}
