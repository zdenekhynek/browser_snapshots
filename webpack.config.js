const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = {
  baseUrl: 'http://localhost:8080/',
};

module.exports = {
  entry: [
    'react-hot-loader/patch',
    './frontend/src/index.jsx',
  ],
  output: {
    path: __dirname + '/frontend/dist',
    publicPath: config.baseUrl,
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new BundleTracker({ filename: './webpack-stats.json' }),
    new webpack.DefinePlugin({
      API_URL: JSON.stringify('http://127.0.0.1:8000/'),
      //  AGENTS_LIST: JSON.stringify('staging'),
      AGENTS_LIST: JSON.stringify('development'),
    }),
    new CopyWebpackPlugin([
      { from: 'frontend/src/assets', to: 'assets' },
    ]),
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
      {
        test: /\.(ttf|otf|woff(2)?)(\?[a-z0-9]+)?$/,
        loader: 'file-loader?name=assets/fonts/[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|svg|ico|gif)$/i,
        loader: 'file-loader?name=assets/images/[name].[ext]',
      },
    ],
  },
  resolve: {
    extensions: ['*', '.js', '.jsx'],
  },
  devServer: {
    contentBase: './frontend/dist',
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
  },
};
