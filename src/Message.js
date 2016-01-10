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
  constructor(message, attachments) {
    this.text = message.text || message;
    this.channel = message.channel || null;
    this.attachments = attachments ? JSON.stringify(attachments) : null;
    this.options = {};
    if (this.attachments) { this.options['attachments'] = this.attachments; }
  }

}

module.exports = Message;
