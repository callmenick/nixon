/* =============================================================================
    Name: server.js
    Description: A simple server to host the bot.
    Author: Nick Salloum
    License: MIT
============================================================================= */

require('dotenv').load();

const bodyParser = require('body-parser');
const Bot = require('./Bot.js');
const express = require('express');
const http = require('http');
const log = require('./util/log.js');
const morgan = require('morgan');
const token = process.env.API_TOKEN || '';
const app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const server = http.createServer(app).listen(process.env.PORT || 3000, (err) => {
  if (err) {
    log('error', err);
    return;
  }

  log('info', 'Server listening on port ' + server.address().port);

  return new Bot(token);
});
