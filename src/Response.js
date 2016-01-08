/* =============================================================================
    Name: Response.js
    Description: Response class that allows responding.
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
   * @description Constructor for Response class.
   */
  constructor(message, bot) {
    this.bot = bot;
    this.incoming = new Message(message);
  }

  /**
   * @name send
   * @description Sends a string of text to the chat.
   */
  send(message, attachments) {
    this.outgoing = new Message(message, attachments, this.bot);
    api.postMessage(this.bot.token, this.incoming.channel, this.outgoing.text, this.outgoing.options, () => {
      log('success', 'Message sent!');
    });
  }

  /**
   * @name reply
   * @description Replies to someone directly.
   */
  reply() {
  }

}

module.exports = Response;
