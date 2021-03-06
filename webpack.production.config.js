const path = require('path');
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');

const config = {
  baseUrl: 'http://sn7257truedatyoutub-production.eu-west-1.elasticbeanstalk.com/',
};

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './frontend/src/index.jsx',
  ],
  output: {
    path: path.resolve(__dirname, 'dist'), // eslint-disable-line
    publicPath: `static${config.baseUrl}`,
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleTracker({ filename: './webpack-stats-production.json' }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('http://sn7257truedatyoutub-production.eu-west-1.elasticbeanstalk.com/'),
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
