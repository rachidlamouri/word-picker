const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.config');
const serverConfig = require('./config');
const words = require('./words');
const acceptedManager = require('./badDatabase/acceptedManager');

const compiler = webpack(webpackConfig);
const { publicPath } = webpackConfig.output;

const app = express();

app.use(bodyParser.json());

if (serverConfig.hotReload) {
  app.use(devMiddleware(compiler, { publicPath }));
  app.use(hotMiddleware(compiler));
} else {
  app.use(express.static('./build/client/'));
}

app.get('/ping', (req, res) => {
  res.send('Pong!');
});

app.get('/word', (req, res) => {
  res.send(_.sample(words));
});

app.post('/accepted', (req, res) => {
  acceptedManager.add(req.body.word);
  res.sendStatus(200);
});

module.exports = app;
