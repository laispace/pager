import 'babel-core/polyfill';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import React from 'react';
import ReactDOM from 'react-dom/server';
import mongoose from 'mongoose';
import fs from './utils/fs';
import chokidar from 'chokidar';

const server = global.server = express();
const port = process.env.PORT || 5000;
server.set('port', port);

//
// Start mongo database
// -----------------------------------------------------------------------------
// todo: move config to config.js
// import { mongodbUrl } from './config';
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
dbConnection.once('open', (undefined)=> {
  console.log('connected: ', dbUri);
});

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
server.use(express.static(path.join(__dirname, 'public')));
server.use(express.static(path.join(__dirname, '../publish')));
server.use(bodyParser.json({limit: '10000 kB'}));
server.use(bodyParser.urlencoded({ extended: true }));

//
// Register API middleware
// -----------------------------------------------------------------------------
server.use('/api/projects', require('./api/projects'));
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
