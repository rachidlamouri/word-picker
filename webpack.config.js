const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

const getAbsolutePath = (pathFromRoot) => path.resolve(__dirname, pathFromRoot);

module.exports = {
  mode: 'development',
  entry: [
    './src/client/index.js',
    'webpack-hot-middleware/client',
  ],
  output: {
    path: getAbsolutePath('./build/client/'),
    filename: 'client.js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader',
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: getAbsolutePath('./src/client/index.html'),
    }),
    new VueLoaderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      components: getAbsolutePath('./src/client/components/'),
    },
    extensions: [
      '.js',
      '.vue',
    ],
  },
};
