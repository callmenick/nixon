/* =============================================================================
    Name: Response.js
    Description: Response class.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const api = require('./api.js');
const Message = require('./Message.js');
const _ = require('lodash');

/**
 * @class Response
 * @description Response class for the bot. The Response class gets instantiated
 *   with an incoming message, and has a send method to send outoing messages.
 */
class Response {

  /**
   * @constructor
   * @description Constructor for Response.
   * @param {Message} incoming
   * @param {Bot} bot
   */
  constructor(incoming, bot) {
    this.incoming = incoming;
    this.bot = bot;
  }

  /**
   * @name send
   * @description Posts a message and any attachments to a specific channel.
   * @param {String} message The message string
   * @param {Array} attachments Array of attachments for the response
   * @return Nothing
   */
  send(message, callback) {
    this.outgoing = new Message(_.extend(message, {
      user: this.bot.self.id,
      channel: this.incoming.channel
    }));

    api.postMessage(this.bot.token, this.outgoing, callback);
  }

  /**
   * @name reply
   * @description Replies to someone directly.
   * @return Nothing
   */
  reply() {
  }

}

module.exports = Response;
