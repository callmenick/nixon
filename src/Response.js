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
 * @class Response class for the bot. The Response class gets instantiated with
 *   an incoming message, and has a send method to send outoing messages.
 */
class Response {

  /**
   * @constructor
   * @description Constructor for Response class.
   * @param {Message} message
   * @param {Bot} bot
   */
  constructor(message, bot) {
    this.bot = bot;
    this.incoming = new Message(message);
  }

  /**
   * @method send
   * @memberOf Response
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
   * @method reply
   * @memberOf Response
   * @description Replies to someone directly.
   * @return Nothing
   */
  reply() {
  }

}

module.exports = Response;
