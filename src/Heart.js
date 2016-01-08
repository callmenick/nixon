/* =============================================================================
    Name: Heart.js
    Description: The heart of the bot.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const api = require('./api.js');
const EventEmitter = require('events');
const log = require('./util/log.js');
const Rx = require('rx');
const WebSocket = require('ws');

/**
 * @class The heart of the bot.
 * @namespace Heart
 * @extends {EventEmitter}
 */
class Heart extends EventEmitter {

  /**
   * @constructor
   * @description Constructor for Heart class.
   */
  constructor(token) {
    super(token);

    this.token = token;

    this.messages = null
    this.subscription = null;

    this.self = null;
    this.team = null;
    this.groups = null;
    this.ims = null;
    this.users = null;
    this.url = null;
    this.ws = null;

    this.heartEvents();
    this.beat();
  }

  /**
   * @name heartEvents
   * @memberOf Heart
   * @description Heart specific events.
   */
  heartEvents() {
    this.on('heart.beating', this.beating);
    this.on('heart.stopped', this.stopped);
  }

  /**
   * @name beat
   * @memberOf Heart
   * @description Makes the heart beat.
   */
  beat() {
    api.rtmStart(this.token, response => {
      if (response.ok) {
        this.emit('heart.beating', response);
      } else {
        this.emit('heart.stopped', response);
      }
    });
  }

  /**
   * @name beating
   * @memberOf Heart
   * @description Heart is beating.
   */
  beating(response) {
    log('success', 'Heart beating...');
    this.self = response.self;
    this.team = response.team;
    this.groups = response.groups;
    this.ims = response.ims;
    this.users = response.users;
    this.url = response.url;
    this._createMessageStream();
    this._openConnection();
  }

  /**
   * @name stopped
   * @memberOf Heart
   * @description Heart has stopped.
   */
  stopped() {
    log('error', 'Heart stopped, attempting to reconnect in 5s...');
    setTimeout(() => this.beat(), 5000);
  }

  /**
   * @private
   * @name _createMessageStream
   * @memberOf Heart
   * @description Creates a message stream based on events.
   */
  _createMessageStream() {
    log('info', 'Creating message stream...');

    this.messages = Rx.Observable
      .fromEvent(this, 'message', data => data)
      .filter(x => x.type === 'message');

    this.subscription = this.messages.subscribe();
  }

  /**
   * @private
   * @name _openConnection
   * @memberOf Heart
   * @description Opens a WebSocket connection and listens for events.
   */
  _openConnection() {
    log('info', 'Opening ws connection...');
    this.ws = new WebSocket(this.url);
    this.ws.on('open', () => this._onConnectionOpen());
    this.ws.on('error', () => this._onConnectionError());
  }

  /**
   * @private
   * @name _onConnectionOpen
   * @memberOf Heart
   * @description Runs when web sockets connection successfully opens.
   */
  _onConnectionOpen() {
    log('success', 'Ws connection open...');
    this._onMessageListener();
    this.emit('bot.connected');
  }

  /**
   * @private
   * @name _onConnectionError
   * @memberOf Heart
   * @description Runs when web sockets connection fails.
   */
  _onConnectionError() {
    console.log('Ws connection error...');
  }

  /**
   * @private
   * @name _onMessageListener
   * @memberOf Heart
   */
  _onMessageListener() {
    this.ws.on('message', response => {
      this.emit('message', JSON.parse(response));
    });
  }

}

module.exports = Heart;
