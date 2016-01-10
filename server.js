/* =============================================================================
    Name: server.js
    Description: A simple server to host the bot.
    Author: Nick Salloum
    License: MIT
============================================================================= */

require('dotenv').load();

const bodyParser = require('body-parser');
const Bot = require('./src/Bot.js');
const express = require('express');
const http = require('http');
const log = require('./src/util/log.js');
const morgan = require('morgan');
const token = process.env.API_TOKEN || '';
const app = express();

/**
 * @name init
 * @description Initializes the express application.
 */
(function init() {

  const port = process.env.PORT || 3000;
  const server = http.createServer(app);

  app.use(morgan('combined'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.set('port', port);

  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  /**
   * @name onError
   * @description On error callback if there was on server listen.
   * @param {Object} error The error.
   */
  function onError(error) {
    switch (error.code) {
      case 'EACCES':
        log('error', `Port ${port} requires elevated privileges`);
        process.exit(1);
        break;
      case 'EADDRINUSE':
        log('error', `Port ${port} is already in use`);
        process.exit(1);
        break;
      default:
        log('error', error);
    }
  }

  /**
   * @name onListening
   * @description On listening callback if server successfully listens.
   */
  function onListening() {
    log('success', `Server listening on port ${port}`);
    new Bot(token);
  }

})();
