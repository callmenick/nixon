/* =============================================================================
    Name: Brain.js
    Description: The brain of the bot.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const Heart = require('./Heart.js');
const User = require('./User.js');
const _ = require('lodash');

/**
 * @class The Brain of the Bot. It performs thinking tasks.
 * @extends {Heart}
 */
class Brain extends Heart {

  /**
   * @constructor
   * @description Constructor for Brain class.
   */
  constructor(token) {
    super(token);
  }

  /**
   * @method userFromId
   * @memberOf Brain
   * @description Fetches a user based on ID.
   * @param {String} id The user's ID
   * @return {User} A User with the provided ID.
   */
  userFromId(id) {
    const user = _.findWhere(this.users, {
      id: id
    });

    return new User(id, user);
  }

}

module.exports = Brain;
