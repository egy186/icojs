'use strict';

const path = require('path');
const webpack = require('webpack');

const dest = path.join(__dirname, 'dist');
const src = path.join(__dirname, 'src');

module.exports = {
  devtool: 'source-map',
  entry: { ico: path.join(src, 'browser/index.js') },
  module: {
    rules: [
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        test: /\.js$/
      }
    ]
  },
  output: {
    filename: '[name].js',
    library: 'ICO',
    libraryTarget: 'umd',
    path: dest
  },
  plugins: [
    new webpack.LoaderOptionsPlugin({ minimize: true }),
    new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
  ]
};
