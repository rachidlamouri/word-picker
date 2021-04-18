const express = require('express');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.config');
const serverConfig = require('./config');

const compiler = webpack(webpackConfig);
const { publicPath } = webpackConfig.output;

const app = express();

if (serverConfig.hotReload) {
  app.use(devMiddleware(compiler, { publicPath }));
  app.use(hotMiddleware(compiler));
} else {
  app.use(express.static('./build/client/'));
}

app.get('/ping', (req, res) => {
  res.send('Pong!');
});

module.exports = app;
