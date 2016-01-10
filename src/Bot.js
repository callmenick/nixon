/* =============================================================================
    Name: Bot.js
    Description: The friendly bot.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const Brain = require('./Brain.js');
const fs = require('fs');
const log = require('./util/log.js');
const Message = require('./Message.js');
const path = require('path');
const Response = require('./Response.js');
const _ = require('lodash');

/**
 * @class Bot
 * @description The friendly Bot.
 * @extends {Heart}
 */
class Bot extends Brain {

  /**
   * @constructor
   * @description Constructor for Bot.
   */
  constructor(token) {
    super(token);

    this.modulesPath = path.join(__dirname, './modules');

    this.botEvents();
  }

  /**
   * @name botEvents
   * @description Bot specific events.
   * @return Nothing.
   */
  botEvents() {
    this.on('bot.connected', this.addModules);
  }

  /**
   * @name listen
   * @description Listens for messages that match a capture.
   * @param {String} capture
   * @param {Functino} callback
   * @return {Disposable} A disposable subscription.
   */
  listen(capture, callback) {
    const messages = this.messages
      .filter(m => m && m.user !== this.self.id && m.text && m.text.match(capture));

    const subscription = messages.subscribe(
      x => {
        const message = new Message(x, null, this.userFromId(x.user));
        const response = new Response(message, this);
        callback(response);
      },
      err => {
        log('error', err);
      }
    );

    return subscription;
  }

  /**
   * @name hear
   * @description Hears for mentions with the @ symbol in a channel.
   */
  hear() {
  }

  /**
   * @name respond
   * @description Listens/responds to direct messages.
   */
  respond() {
  }

  /**
   * @name update
   * @description Updates an existing message.
   */
  update() {
  }

  /**
   * @name addModules
   * @description Adds modules (pieces of functionality) to the bot.
   * @return Nothing.
   */
  addModules() {
    log('info', 'Adding modules...');

    fs.readdir(this.modulesPath, (err, files) => {
      if (err) {
        log('error', 'Failed to add modules...');
        return;
      }

      _.forEach(files, file => {
        require(path.resolve(this.modulesPath, file))(this);
      });

      log('success', 'Successfully added modules, time to robo!');
    });
  }

}

module.exports = Bot;
