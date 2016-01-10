/* =============================================================================
    Name: Response.js
    Description: Response class.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const api = require('./api.js');
const log = require('./util/log.js');
const Message = require('./Message.js');

/**
 * @class Response
 * @description Response class for the bot. The Response class gets instantiated
 *   with an incoming message, and has a send method to send outoing messages.
 */
class Response {

  /**
   * @constructor
   * @description Constructor for Response.
   * @param {Message} message
   * @param {Bot} bot
   */
  constructor(message, bot) {
    this.bot = bot;
    this.incoming = new Message(message);
  }

  /**
   * @name send
   * @description Posts a message and any attachments to a specific channel.
   * @param {String} message The message string
   * @param {Array} attachments Array of attachments for the response
   * @return Nothing
   */
  send(message, attachments) {
    this.outgoing = new Message(message, attachments, this.bot);

    api.postMessage(
      this.bot.token,
      this.incoming.channel,
      this.outgoing.text,
      this.outgoing.options,
      response => {
        log('info', response);
      }
    );
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
