import 'babel-core/polyfill';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOM from 'react-dom/server';
import mongoose from 'mongoose';
import fs from './utils/fs';
import chokidar from 'chokidar';
import morgan from 'morgan';
import passport from 'passport';
import flash from 'connect-flash';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import User from './models/user';

const MongoStore = require('connect-mongo')(session);
const server = global.server = express();
const port = process.env.PORT || 5000;
server.set('port', port);

//
// Start mongo database
// -----------------------------------------------------------------------------
// todo: move to config/database.js
const dbHost = process.env['MONGODB_PORT_27017_TCP_ADDR'] || 'localhost';
const dbPort = process.env['MONGODB_PORT_27017_TCP_PORT'] || 27017;
const dbName = process.env['MONGODB_INSTANCE_NAME'] || 'pager';
const dbUsername = process.env['MONGODB_USERNAME'] || 'pager';
const dbPassword = process.env['MONGODB_PASSWORD'] || 'pass4pager';
const dbUri = 'mongodb://' + dbHost + ':' + dbPort + '/' + dbName;
const dbOptions = {
  user: dbUsername,
  pass: dbPassword
};
const dbConnection = mongoose.connect(dbUri, dbOptions).connection;
dbConnection.on('error', (error) => {throw error});
dbConnection.once('open', ()=> { console.log('database connected: ', dbUri);});

// Logs
server.use(morgan('dev'));

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.static(path.join(__dirname, '../publish')));
server.use(bodyParser.json({limit: '10000 kB'}));
server.use(bodyParser.urlencoded({ extended: true }));

// Required for passport
server.use(cookieParser());
server.use(session({
  secret: 'pagerSecret',
  saveUninitialized: true,
  resave: true,
  // using store session on MongoDB using express-session + connect
  store: new MongoStore({
    mongooseConnection: dbConnection,
    collection: 'sessions'
  })
}));

server.use(passport.initialize());
server.use(passport.session());
// passport
var GitHubStrategy = require('passport-github').Strategy;
passport.use(new GitHubStrategy({
    clientID: '3f47332ff98af09bf74d',
    clientSecret: '1df1df8675e9fce619d55dc2a636e2cadd4914fd',
    callbackURL: "http://127.0.0.1:3000/api/auth/login/github/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log('accessToken', accessToken);
    console.log('refreshToken', refreshToken);
    console.log('profile', profile);
    User.findOne({ githubId: profile.id }, function (err, user) {
      if (err) {
        return cb(err);
      }
      if (user) {
        return cb(null, user);
      } else {
        var newUser = new User({
          type: 'github',
          name: profile.displayName,
          githubId: profile.id,
          githubProfile: profile
        });
        newUser.save(function (err) {
          "use strict";
          if (err) {
            throw err;
          }
          return cb(null, newUser);
        });
      }
    });
  }
));
passport.serializeUser(function(user, cb) {
  cb(null, user);
});
passport.deserializeUser(function(user, cb) {
  cb(null, user);
});

// check auth middleware
const checkLogin = async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      next(null);
    } else {
      res.status(403).send({
        retcode: 403,
        msg: "未登录"
      });
    }
  } catch (err) {
    next(err);
  }
};

//
// Register API middleware
// -----------------------------------------------------------------------------
// server.use('/api', checkLogin);
server.use('/api/auth', require('./api/auth'));
server.use('/api/users', require('./api/users'));
server.use('/api/projects',require('./api/projects'));
server.use('/api/components', require('./api/components'));
server.use('/api/localComponents', require('./api/localComponents'));
server.use('/api/pages', require('./api/pages'));
server.use('/api/preview', require('./api/pages'));
server.use('/api/sync', require('./api/sync'));
server.use('/api/generate', require('./api/generate'));
server.use('/api/download', require('./api/download'));
server.use('/api/publish', require('./api/publish'));

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
server.get('*', async (req, res, next) => {
  try {
    const html = await fs.readFile(path.join(__dirname, 'index.html'));
    res.status(200).type('html').send(html);
  } catch (err) {
    next(err);
  }
});

//
// Launch the server
// -----------------------------------------------------------------------------
server.listen(port, () => {
  /* eslint-disable no-console */
  console.log(`The server is running at http://localhost:${port}/`);
});
