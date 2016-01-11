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
 * @class Heart
 * @description The heart of the bot. The Bot must have a heart, and the heart is
 *   responsible for getting things going. It opens up a Real Time Messaging
 *   session, establishes a Web Socket connection, and populates some important
 *   variables that the Bot will later use for communication.
 * @extends {EventEmitter}
 */
class Heart extends EventEmitter {

  /**
   * @constructor
   * @description Constructor for Heart.
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
   * @description Specific event listeners for the Heart.
   * @return Nothing
   */
  heartEvents() {
    this.on('heart.beating', this.beating);
    this.on('heart.notBeating', this.notBeating);
  }

  /**
   * @name beat
   * @description Attempts to establish a connection to Slack's Real Time
   *   Messaging API. If the connection was successful, the heart.beating event
   *   gets emitted. If the connection was unsuccessful, the heart.notBeating
   *   event gets emitted.
   * @return Nothing
   */
  beat() {
    api.rtmStart(this.token, response => {
      if (response.ok) {
        this.emit('heart.beating', response);
      } else {
        this.emit('heart.notBeating', response);
      }
    });
  }

  /**
   * @name beating
   * @description Fires when the heart is successfully beating, which is a
   *   result of a successful connection to the Real Time Messaging API. At this
   *   point, important info gets populated, the message stream gets created,
   *   and and a socket connection is established.
   * @param {Object} response The response from the API call
   * @return Nothing
   */
  beating(response) {
    log('success', 'Heart beating...');
    this.self = response.self;
    this.team = response.team;
    this.groups = response.groups;
    this.ims = response.ims;
    this.users = response.users;
    this.url = response.url;
    this.createMessageStream();
    this.openConnection();
  }

  /**
   * @name notBeating
   * @description Fires when the heart isn't beating, and attempts to reconnect
   *   after 5 seconds.
   * @param {Object} response The response from the API call
   * @return Nothing
   */
  notBeating(response) {
    log('error', response.error);
    log('info', 'Attempting to reconnect in 5s...');
    setTimeout(() => this.beat(), 5000);
  }

  /**
   * @name createMessageStream
   * @description Creates a message stream based on events.
   * @return Nothing
   */
  createMessageStream() {
    log('info', 'Creating message stream...');

    this.messages = Rx.Observable
      .fromEvent(this, 'message', data => data)
      .filter(x => x.type === 'message');

    this.subscription = this.messages.subscribe();
  }

  /**
   * @name openConnection
   * @description Opens a WebSocket connection and listens for events.
   * @return Nothing
   */
  openConnection() {
    log('info', 'Opening ws connection...');
    this.ws = new WebSocket(this.url);
    this.ws.on('open', () => this.onConnectionOpen());
    this.ws.on('error', () => this.onConnectionError());
    this.ws.on('message', response => this.onMessage(response));
  }

  /**
   * @name onConnectionOpen
   * @description Runs when web sockets connection successfully opens.
   * @return Nothing
   */
  onConnectionOpen() {
    log('success', 'Ws connection open...');
    this.emit('bot.connected');
  }

  /**
   * @name onConnectionError
   * @description Callback that fires when the Web Socket connection fails.
   *   Waits 5s before attempting to reconnect.
   * @return Nothing
   */
  onConnectionError() {
    log('error', 'Ws connection error, attempting to restablish in 5s...');
    setTimeout(() => this.openConnection(), 5000);
  }

  /**
   * @name onMessage
   * @description Listens for Web Socket message events, and emits a message
   *   event to the message emitter.
   * @return Nothing
   */
  onMessage(response) {
    this.emit('message', JSON.parse(response));
  }

}

module.exports = Heart;
