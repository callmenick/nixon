/* =============================================================================
    Name: Brain.js
    Description: The brain of the bot. It performs thinking tasks.
    Author: Nick Salloum
    License: MIT
============================================================================= */

const Heart = require('./Heart.js');
const User = require('./User.js');
const _ = require('lodash');

/**
 * @class The Brain of the Bot. It performs thinking tasks.
 * @namespace Brain
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
   * @name userFromId
   * @memberOf Brain
   * @description Fetches a user based on ID.
   * @return {User} A User instance
   */
  userFromId(id) {
    const user = _.findWhere(this.users, {
      id: id
    });

    return new User(id, user);
  }

}

module.exports = Brain;
