const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

const config = {
  baseUrl: 'https://browser-extension-uploads.s3.amazonaws.com/static/dist/',
};

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './frontend/src/index.jsx',
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
      SOCKET_URL: JSON.stringify('wss://browser-snapshots.herokuapp.com/'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              localIdentName: '[path][name]---[local]---[hash:base64:5]',
              modules: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-import'),
                require('postcss-simple-vars'),
              ],
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
};
