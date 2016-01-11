/* =============================================================================
    Name: Message.js
    Description: Message class that builds up messages.
    Author: Nick Salloum
    License: MIT
============================================================================= */

/**
 * @class Message
 * @description Message class.
 */
class Message {

  /**
   * @constructor
   * @description Constructor for Message class.
   */
  constructor(message) {
    this.user = message.user;
    this.text = message.text;
    this.channel = message.channel;
    this.ts = message.ts ? message.ts : null;
    this.attachments = message.attachments ? JSON.stringify(message.attachments) : null;
  }

}

module.exports = Message;
