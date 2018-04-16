const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

const config = {
  baseUrl: 'http://localhost:8081/',
};

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './frontend/src/index.js'
  ],
  output: {
    path: __dirname + '/frontend/dist',
    publicPath: config.baseUrl,
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleTracker({filename: './webpack-stats.json'})
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  devServer: {
    contentBase: './frontend/dist',
    hot: true
  }
};
