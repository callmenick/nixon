/* =============================================================================
    Name: Bot.js
    Description: The initial entry point that connects to Slack, opens up a new
      web socket connection, creates a new bot, and puts the bot online.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const api = require('./api.js');
const EventEmitter = require('events');
const fs = require('fs');
const log = require('./util/log.js');
const path = require('path');
const Rx = require('rx');
const WebSocket = require('ws');
const _ = require('lodash');

/**
 * @class Bot
 * @description Class description for Bot.
 */
class Bot {

  /**
   * @constructor
   * @description Constructor for Bot class.
   * @param {String} token Slack API token
   */
  constructor(token) {
    this.token = token;
    this.emitter = new EventEmitter();
    this.connected = false;
    this.self = null;
    this.wsUrl = null;
    this.ws = null;
    this.messages = null;
    this.subscription = null;
    this.modulesPath = path.join(__dirname, '../bot_modules');
    this.init();
  }

  /**
   * @name init
   * @description Initializes the connection and spins up a new bot instance.
   */
  init() {
    api.rtmStart(this.token, response => this._onInit(response));
  }

  /**
   * @name _onInit
   * @description Callback that runs after initialization.
   * @param {Object} response The response object
   */
  _onInit(response) {
    if (response) {
      if (!response.ok) {
        log('error', response.error);
      } else {
        this.wsUrl = response.url;
        this.self = response.self;
        this._createMessageStream();
        this._openConnection();
      }
    }
  }

  /**
   * @name _createMessageStream
   * @description Creates a message stream based on events.
   */
  _createMessageStream() {
    this.messages = Rx.Observable
      .fromEvent(this.emitter, 'message', data => data)
      .filter(x => x.type === 'message');

    this.subscription = this.messages.subscribe();
  }

  /**
   * @name _openConnection
   * @description Opens up a web socket connection once rtm has initiated, and
   *   sets up event listeners on Slack events.
   */
  _openConnection() {
    this.ws = new WebSocket(this.wsUrl);
    this.ws.on('open', () => this._onConnectionOpen());
    this.ws.on('error', () => this._onConnectionError());
  }

  /**
   * @name _onConnectionOpen
   * @description Runs when web sockets connection successfully opens.
   */
  _onConnectionOpen() {
    log('info', 'Connection open...');
    this._onMessageListener();
    this._addModules();
  }

  /**
   * @name _onConnectionError
   * @description Runs when web sockets connection fails.
   * @return {[type]} [description]
   */
  _onConnectionError() {
    log('error', 'Error while connecting...');
  }

  /**
   * @name _onMessageListener
   * @description Listens for web socket message events, and fires a new message
   *   event from the class emitter.
   */
  _onMessageListener() {
    this.ws.on('message', data => {
      data = JSON.parse(data);
      this.emitter.emit('message', data);
    });
  }

  /**
   * @name _addModules
   * @description Adds bot modules to the bot instance.
   */
  _addModules() {
    fs.readdir(this.modulesPath, (err, files) => {
      if (err) {
        log('error', err);
        return;
      }

      _.forEach(files, file => {
        require(path.resolve(this.modulesPath, file))(this);
      });
    });
  }

  /**
   * @name listen
   * @description Listens for messages that match a capture.
   * @return {Disposable} A disposable subscription
   */
  listen(capture, callback) {
    const messages = this.messages
      .filter(m => m && m.user !== this.self.id && m.text && m.text.match(capture));

    const subscription = messages.subscribe(
      x => callback(this.respond(x)),
      err => log('error', err)
    );

    return subscription;
  }

  /**
   * @name respond
   * @description Allows bots to respond with a message of their own.
   * @param {Object} incomingMessage The incoming message from the channel
   * @return {Function} A responder function that a bot module can use
   */
  respond(incomingMessage) {
    return outgoingMessage => {
      api.postMessage(this.token, incomingMessage.channel, outgoingMessage, (response) => {
        response.ok ? log('info', response.message) : log('error', response.error);
      });
    };
  }

}

module.exports = Bot;
