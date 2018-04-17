const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

const config = {
  baseUrl: 'https://browser-extension-uploads.s3.amazonaws.com/static/dist/',
};

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './frontend/src/index.js',
  ],
  output: {
    path: __dirname + '/browser_snapshots/static/dist',
    publicPath: config.baseUrl,
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleTracker({ filename: './webpack-stats-staging.json' }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('https://browser-snapshots.herokuapp.com/'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};
