const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const _ = require('lodash');
const uuid = require('uuid');
const webpack = require('webpack');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const webpackConfig = require('../../webpack.config');
const serverConfig = require('./config');
const words = require('./words');
const acceptedManager = require('./badDatabase/acceptedManager');
const usersManager = require('./badDatabase/usersManager');
const bracketManager = require('./badDatabase/bracketManager');

const compiler = webpack(webpackConfig);
const { publicPath } = webpackConfig.output;

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());

app.get('/ping', (req, res) => {
  res.send('Pong!');
});

app.get('/userid', (req, res) => {
  res.send(req.cookies.userId);
});

app.use((req, res, next) => {
  let { userId } = req.cookies;
  if (!userId) {
    userId = uuid.v4();

    if (usersManager.getUserCount() >= 2) {
      next(Error('Too many users!'));
      return;
    }

    usersManager.add(userId);
    res.cookie('userId', userId);
    res.redirect('/');
    return;
  }

  if (!usersManager.has(userId)) {
    res.clearCookie('userId');
    res.redirect('/');
    return;
  }

  next();
});

if (serverConfig.hotReload) {
  app.use(devMiddleware(compiler, { publicPath }));
  app.use(hotMiddleware(compiler));
} else {
  app.use(express.static('./build/client/'));
}

app.get(
  '/word',
  (req, res, next) => {
    if (!serverConfig.isBracketModeEnabled) {
      next();
      return;
    }

    if (bracketManager.getPairCount() === 0) {
      const allAcceptedWords = usersManager.getUserIds().map((userId) => acceptedManager.getAcceptedWords(userId)).flat();
      bracketManager.initialize(_.shuffle(allAcceptedWords));
    }

    const firstTupleNotVotedOn = bracketManager.findFirstTupleNotVotedOn(req.cookies.userId);
    if (firstTupleNotVotedOn === null) {
      next(Error('ohnor!'));
      return;
    }

    res.send(firstTupleNotVotedOn);
  },
  (req, res, next) => {
    if (acceptedManager.getAcceptedCount(req.cookies.userId) >= serverConfig.wordLimitPerUser) {
      next(Error('All words done!'));
      return;
    }

    res.send(_.sample(words));
  },
);

app.post(
  '/accepted',
  (req, res, next) => {
    if (serverConfig.isBracketModeEnabled) {
      next(Error('"Accepted" in bracket mode is not implemented'));
      return;
    }

    next();
  },
  (req, res, next) => {
    const { userId } = req.cookies;

    if (acceptedManager.getAcceptedCount(userId) >= serverConfig.wordLimitPerUser) {
      next(Error('All words done!'));
      return;
    }

    acceptedManager.add(req.cookies.userId, req.body.word);
    res.sendStatus(200);
  },
);

app.use((error, req, res, next) => {
  res.status(500).send(error.message);
  next();
});

module.exports = app;
